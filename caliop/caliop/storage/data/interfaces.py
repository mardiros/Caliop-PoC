# -*- coding: utf-8 -*-
"""
Caliop storage data _IStorables
"""

from __future__ import absolute_import, print_function, unicode_literals

from zope.interface import Attribute, Interface


class _IStorable(Interface):

    #@classmethod
    def create(cls, **kwargs):
        """
         Create a storable oject in the storage engine and return it.
        """

    def save(self):
        """
         Save the current state of the storable object in the storage engine.
        """

class IRawMail(_IStorable):
    raw_id = Attribute('Mail identifier')
    users = Attribute('List of users to deliver this mail')
    data = Attribute('Binary content of mail')


class IUser(_IStorable):
    user_id = Attribute('User email')
    password = Attribute('encrypted password')
    date_insert = Attribute('Creation date of the user')
    first_name = Attribute('First name')
    last_name = Attribute('Last name')
    params = Attribute('Other user parameters in a dict')


class ICounter(_IStorable):
    user_id = Attribute('Email address')
    message_id = Attribute('Identifier of the message')
    thread_id = Attribute('Identifier of the thread')


class ITag(_IStorable):
    user_id = Attribute('Email address')
    label = Attribute('Label of the tag')
    background = Attribute('Background color')
    color = Attribute('Foreground color')


class IContact(_IStorable):
    contact_id = Attribute('Contact identifier')
    user_id = Attribute('Email address')
    first_name = Attribute('First name')
    last_name = Attribute('Last name')
    date_insert = Attribute('Creation date')
    date_update = Attribute('Last update date')
    groups = Attribute('columns.Text')
    infos = Attribute('Contact informations in a dict object')


class IContactLookup(_IStorable):
    """Lookup any information needed to recognize a user contact"""
    user_id = Attribute('User email address to look up')
    value = Attribute('A value in a Contact.info that match '
                      'the associated contact')
    contact_id = Attribute('Identifier of the message')


class IThread(_IStorable):
    """
    Represent a discussion thread.
    """
    # XXX threading simplest model, most data are only in index
    user_id = Attribute('User email of the thread')
    thread_id = Attribute('')
    date_insert = Attribute('')
    security_level = Attribute('')
    subject = Attribute('Thread subject')


class IMessage(_IStorable):
    message_id = Attribute('Message identifier')
    user_id = Attribute('User email that own the message')
    thread_id = Attribute('Thread that own the message')
    date_insert = Attribute('Creation date')
    security_level = Attribute('Caliop Security Score')
    subject = Attribute('Message subject')
    external_message_id = Attribute('MIME message id or '
                                    'other protocol like id')
    external_parent_id = Attribute('In-Reply-To')
    parts = Attribute('List of message parts in the message')
    tags = Attribute('List of tags in the message')


class IMessagePart(_IStorable):
    """
    Build a mime message part
    """
    id = Attribute('Part identifier for MIME Message')
    position = Attribute('')
    content_type = Attribute('Content type')
    size = Attribute('Size of the payload')
    filename = Attribute('Filename')
    disposition = Attribute('Content-Disposition of part')
    payload = Attribute('base64 encoded payload')
    users = Attribute('Map user and related message for this part')


class IMessageLookup(_IStorable):
    """Reverse index for external message id"""
    user_id = Attribute('User email')
    external_id = Attribute('Parent Message identifier')
    message_id = Attribute('Child Message identifier')
    thread_id = Attribute('Tread identifier')
    offset = Attribute('Message offset in the tree')


## Calendar

class IRRule(_IStorable):
    """Recurrence Rule"""
    id = Attribute('')
    user_id = Attribute('User email')    # partition key
    type = Attribute('')
    occurrence = Attribute('')
    value = Attribute('')
    events = Attribute('')


class IEvent(_IStorable):
    user_id = Attribute('User email')    # partition key
    id = Attribute('')
    date_start = Attribute('')
    end_date = Attribute('')
    description = Attribute('')
    rrule_id = Attribute('')
    latitude = Attribute('')
    longitude = Attribute('')
