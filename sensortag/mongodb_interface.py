#!/usr/bin/env python

from pymongo import MongoClient
from datetime import datetime
import pytz
from bson.objectid import ObjectId

class mongodb_interface:

    def __init__(self, server, port, database, collection):
        self.server = server
        self.port = port
        self.database = database
        self.collection = collection

        self.client = MongoClient(self.server, self.port)

    	self.db = self.client[self.database]
    	self.coll = self.db[self.collection]

    	self.tz = pytz.timezone('Europe/Berlin')

        #if self.database in r.db_list().run(self.conn):
        #    print('Database ' + self.database + ' exists! Using it.')
        #else:
        #    resp = r.db_create(self.database).run(self.conn)
        #    if resp["dbs_created"] == 1:
        #        print('Database ' + self.database + ' was successfully created.')
        #    else:
        #        print('Error while creating database ' + self.database + '.')

        #self.conn.use(self.database)

        #if self.table in r.table_list().run(self.conn):
        #    print('Table ' + self.table + ' exists! Using it.')
        #else:
        #    resp = r.table_create(self.table).run(self.conn)
        #    if resp["tables_created"] == 1:
        #        print('Table ' + self.table + ' was successfully created.')
        #    else:
        #        print('Error while creating table ' + self.table + '.')

    def __del__(self):
        print('Closing database connection.')
        #self.conn.close()

    def insert(self, temp_data):
        data = temp_data
        data['_id'] = ObjectId()

        data['time'] = datetime.now(self.tz)
        self.coll.insert_one(data)
