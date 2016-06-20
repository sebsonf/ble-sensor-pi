#!/usr/bin/env python

import RPi.GPIO as GPIO

class pi_relay:

    def __init__(self, pin):
        self.pin = pin

        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.pin, GPIO.OUT)
	self.off()

    def __del__(self):
        GPIO.cleanup()

    def on(self):
        GPIO.output(self.pin, 0)

    def off(self):
        GPIO.output(self.pin, 1)
