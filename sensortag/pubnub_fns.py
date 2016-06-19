#!/usr/bin/env python

from pubnub import Pubnub
import datetime
import time
import os

def callback(message, channel):
    print('[' + channel + ']: ' + str(message))

class Pubnub_stream:

    def __init__(self):
        self.pubnub = Pubnub(
            publish_key = os.getenv('ANBAU_PUBLISH_KEY'),
            subscribe_key = os.getenv('ANBAU_SUBSCRIBE_KEY'))

        self.channel = "stats"
        self.message = "A message"

        self.pubnub.subscribe(
            self.channel,
            callback = callback)
        print('PubNub stream created!')

    def write(self, data):
        self.pubnub.publish(channel = self.channel, message = data)
