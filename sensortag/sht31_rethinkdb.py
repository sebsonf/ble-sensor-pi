import time
import smbus
from rethinkdb_interface import *
from climate_controller import *
from sht31 import *


def main():
    
    data = {}
    db = rethinkdb_interface("jferch.no-ip.org", 28015, 'anbau', 'plant_stats')
    controller = climate_controller(pin=17, minHum=35, maxHum=65, minTemp=21, maxTemp=24)

    while True:
    	try:
            with SHT31(1) as sht31:
                #print sht31.check_heater_status()
                sht31.turn_heater_on()
                #print sht31.check_heater_status()
                sht31.turn_heater_off()
                #print sht31.check_heater_status()
                temperature, humidity = sht31.get_temp_and_humidity()
		data['temperature'] = temperature
		data['humidity'] = humidity
                print "Temperature: %s" % temperature
                print "Humidity: %s" % humidity
		
		controller.check(temperature, humidity)
		
		if int(time.time()) % 10 == 0:
	            db.insert(data)
		
		time.sleep(1)
        except IOError, e:
            #print e
            #print "Error creating connection to i2c.  This must be run as root"
            pass


if __name__ == "__main__":
    main()
