#!/usr/bin/env python
# Michael Saunby. April 2014
#
#   Copyright 2014 Michael Saunby
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.

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
