from __future__ import absolute_import, unicode_literals

import json

from pyramid.response import Response

from .api import API



class ThreadMessages(API):
    filename = 'messages.json'

    def __call__(self):
        messages = json.loads(self.read_json())
        recipients = json.loads(self.read_json(filename='recipients.json'))

        thread_id = int(self.request.matchdict.get('thread_id'))

        # grep messages of the wanted thread
        filtered_messages = filter(lambda m: m['thread_id'] == thread_id, messages)

        for message in filtered_messages:
            # link author
            message['author'] = filter(lambda r: r['id'] == message['author'],
                                       recipients).pop()

        return Response(json.dumps(filtered_messages))


class Messages(API):
    filename = 'messages.json'
