#!/usr/bin/env python

import rethinkdb as r
from datetime import datetime

class rethinkdb_interface:

    def __init__(self, server, port, database, table):
        self.server = server
        self.port = port
        self.database = database
        self.table = table
        self.data = []

        self.conn = r.connect(self.server, self.port)

        if self.database in r.db_list().run(self.conn):
            print('Database ' + self.database + ' exists! Using it.')
        else:
            resp = r.db_create(self.database).run(self.conn)
            if resp["dbs_created"] == 1:
                print('Database ' + self.database + ' was successfully created.')
            else:
                print('Error while creating database ' + self.database + '.')

        self.conn.use(self.database)

        if self.table in r.table_list().run(self.conn):
            print('Table ' + self.table + ' exists! Using it.')
        else:
            resp = r.table_create(self.table).run(self.conn)
            if resp["tables_created"] == 1:
                print('Table ' + self.table + ' was successfully created.')
            else:
                print('Error while creating table ' + self.table + '.')

    def __del__(self):
        print('Closing database connection.')
        self.conn.close()

    def insert(self, data):
        self.data = data
        self.data['time'] = r.expr(datetime.now(r.make_timezone('+02:00')))
        r.table(self.table).insert(self.data).run(self.conn)
