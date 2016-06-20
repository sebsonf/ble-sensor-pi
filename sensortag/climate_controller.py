#!/usr/bin/env python

from pi_relay import *

class climate_controller:

    def __init__(self, pin, minHum, maxHum, minTemp, maxTemp):
        self.minHum = minHum
        self.maxHum = maxHum
        self.minTemp = minTemp
        self.maxTemp = maxTemp
        self.pi_relay = pi_relay(pin)
	print "Climate controller initialized!"

    def check(self, temp, humid):
        if (temp > self.maxTemp) or ( ((temp < self.maxTemp) and (self.minTemp < temp)) and (humid > self.maxHum) ) or ((temp < self.minTemp) and (humid > self.maxHum)):
	    #print "relay on"
            self.pi_relay.on()
        else:
	    #print "relay off"
            self.pi_relay.off()
