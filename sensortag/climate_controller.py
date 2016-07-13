#!/usr/bin/env python

from pi_relay import *

# implements hysteresis controller
class climate_controller:

    def __init__(self, pin, minHum, maxHum, minTemp, maxTemp):
        self.minHum = minHum
        self.maxHum = maxHum
        self.minTemp = minTemp
        self.maxTemp = maxTemp
        self.pi_relay = pi_relay(pin)
        self.pi_relay.off()
        self.state = False
	    print "Climate controller initialized!"

    def calcStateFromHumid(self, humid):
        if ( humid > self.maxHum ) and ( self.state == False ):
            return True
        elif ( humid < self.minHum ) and ( self.state == True ):
            return False
        else:
            return self.state

    def calcStateFromTemp(self, temp):
        if ( temp > self.maxTemp ) and ( self.state == False ):
            return True
        elif ( temp < self.minTemp ) and ( self.state == True ):
            return False
        else:
            return self.state

    def updateState(self, temp, humid):
        if ( ( calcStateFromTemp(temp) or calcStateFromHumid(humid) ) == True ):
	    #print "relay on"
            self.pi_relay.on()
            self.state = True
        else:
	    #print "relay off"
            self.pi_relay.off()
            self.state = False

    def getState(self):
        return self.state
