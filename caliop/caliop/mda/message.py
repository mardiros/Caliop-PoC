import base64

from mailbox import Message as Rfc2822
from dateutil.parser import parse as parse_date
from itertools import groupby

from caliop.helpers.format import clean_email_address
from caliop.helpers.log import log
from caliop.core.user import User


class MdaMessage(object):
    """Got a mail in raw rfc2822 format, parse it to
    resolve all recipients emails, users and parts
    """

    recipient_headers = ['To', 'Cc', 'Bcc', 'X-Original-To']

    def __init__(self, raw):
        try:
            self.mail = Rfc2822(raw)
        except Exception, exc:
            log.error('Parse message failed %s' % exc)
            raise
        if self.mail.defects:
            # XXX what to do ?
            log.warn('Defects on parsed mail %r' % self.mail.defects)
        self.recipients = self._extract_recipients()
        self.headers = self._extract_headers()
        self.users = self._resolve_users()
        if self.users:
            self.parts = self._extract_parts()
        else:
            self.parts = []
        self.subject = self.mail.get('Subject')
        self.text = self._decode_text_payload()
        self.from_ = clean_email_address(self.mail.get('From'))
        self.date = parse_date(self.mail.get('Date'))
        # will be converted as external_id
        self.message_id = self.mail.get('Message-Id')
        self.thread_id = self.mail.get('In-Reply-To')
        self.size = len(self.mail.get_payload())

    def _extract_recipients(self):
        addrs = []
        for header in self.recipient_headers:
            if self.mail.get(header):
                if ',' in self.mail.get(header):
                    addrs.extend(self.mail.get(header).split(','))
                else:
                    addrs.append(self.mail.get(header))
        return [clean_email_address(x) for x in addrs]

    def _extract_headers(self):
        """Duplicate on headers exists, group them by name
        with a related list of values"""
        def keyfunc(item):
            return item[0]

        # Group multiple value for same headers into a dict of list
        headers = {}
        data = sorted(self.mail.items(), key=keyfunc)
        for k, g in groupby(data, key=keyfunc):
            headers[k] = [x[1] for x in g]
        return headers

    def all_recipients(self):
        return self.recipients + [self.from_]

    def _resolve_users(self):
        """Find all users involved in this mail"""
        find_users = []
        for addr in self.recipients:
            try:
                user = User.get(addr)
                if not user in find_users:
                    find_users.append(user)
            except:
                # XXX handle NotFound only
                pass
        return find_users

    def _extract_parts(self):
        """Multipart message, extract parts"""
        parts = []
        for p in self.mail.walk():
            if not p.is_multipart():
                parts.append(p)
        return parts

    def _decode_text_payload(self):
        """Decode all text payloads, be care about charset"""
        text_payloads = []
        for part in self.mail.walk():
            if part.is_multipart():
                continue
            log.debug('Part is %s type' % part.get_content_type())
            if 'text' in part.get_content_type():
                charsets = part.get_charsets()
                if len(charsets) > 1:
                    raise Exception('Too many charset %r for %s' %
                                    (charsets, part.get_payload()))
                text = part.get_payload()
                if 'Content-Transfer-Encoding' in part.keys():
                    if part.get('Content-Transfer-Encoding') == 'base64':
                        text = base64.b64decode(text)
                if charsets[0]:
                    text = part.get_payload().decode(charsets[0], 'replace'). \
                        encode('utf-8')
                text_payloads.append(text)
        return '\n'.join(text_payloads)
