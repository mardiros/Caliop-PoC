import logging
from mailbox import Message as Rfc2822

from caliop.core.user import User


log = logging.getLogger(__name__)


class Message(object):

    def __init__(self, raw):
        try:
            self.mail = Rfc2822(raw)
        except Exception, exc:
            log.error('Parse message failed %s' % exc)
            raise
        self.users = self._resolve_users()

    def _address_to_user(self, addr):
        """Clean an email address for user resolve"""
        name, domain = addr.lower().split('@', 2)
        if '+' in name:
            name, ext = name.split('+', 2)
        # unicode everywhere
        return u'%s@%s' % (name, domain)

    def _resolve_users(self):
        """Find all users involved in this mail"""
        addrs = [self.mail.get('To', [])]
        addrs.extend(self.mail.get('Cc', []))
        addrs.extend(self.mail.get('Bcc', []))
        find_users = []
        for addr in addrs:
            try:
                # XXX : remove extension in mail to find correctly user (+)
                user = User.get(self._address_to_user(addr))
                if not user in find_users:
                    find_users.append(user)
            except:
                # XXX handle NotFound only
                pass
        return find_users
