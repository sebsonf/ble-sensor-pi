#!/usr/bin/env python

from pi_relay import *

class climate_controller:

    def __init__(self, pin, minHum, maxHum, minTemp, maxTemp):
        self.minHum = minHum
        self.maxHum = maxHum
        self.minTemp = minTemp
        self.maxTemp = maxTemp
        self.pi_relay = pi_relay(pin)


    def check(self, temp, humid):
        if (temp > self.maxTemp) or ( ((self.maxTemp < temp) and (temp < self.minTemp)) and (humid > self.maxHum) ) or ((temp < self.minTemp) and (humid > self.maxHum)):
            self.pi_relay.on()
        else:
            self.pi_relay.off()
