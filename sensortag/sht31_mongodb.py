import time
import smbus
from mongodb_interface import *
from fan_controller import *
from sht31 import *


def main():

    data = {}
    db = mongodb_interface("82.165.163.195", 27017, 'anbau', 'plant_stats')
    controller = fan_controller(pin=17, minHum=45, maxHum=65, minTemp=23, maxTemp=24)
    inserted = 0

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

                controller.updateState(temperature, humidity)
                data['fanState'] = controller.getState()
                print "Fan state: %d" % controller.getState()

                # insert data into database every 10 seconds
                if int(time.time()) % 10 == 0:
                    if inserted == 0:
	       	            db.insert(data)
                        inserted = 1
                else:
                    inserted = 0

                time.sleep(0.8)
        except IOError, e:
        #print e
        #print "Error creating connection to i2c.  This must be run as root"
            pass

if __name__ == "__main__":
    main()
