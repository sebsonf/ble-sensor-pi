// More sensortag demo stuff by Michael Saunby. April 2013
//
// This nodejs server script requires the following to be in place -
// A suitable index.html in the same directory as this script.
// A logfile - see 'var sensortag' below.
// The logfile has new lines written to it, each should be a JSON string.

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/plant_stats');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
    console.log('connected to database!');
});

// mongoose schema representing sensortag data
var sensortagSchema = mongoose.Schema({
  timestamp: Date,
  bluetoothAddress: String,
  t006: Number,
  acceleration: {
    x: Number,
    y: Number,
    z: Number
  },
  barometer: {
    temperature: Number,
    pressure: Number
  },
  humiditySensor: {
    temperature: Number,
    humidity: Number
  },
  magnetometer: {
    x: Number,
    y: Number,
    z: Number
  }
});

// create model
var Stats = mongoose.model('Stats', sensortagSchema);

var cp = require('child_process');
var sensorlog = 'sensortag.log';

server.listen(3000);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static('ressources'));


io.sockets.on('connection', function (socket) {
  console.log('a user connected');
  var child = cp.spawn('tail', ['-f', sensorlog]);
  child.stdout.on('data', function(data){
  	data = data.toString();
  	// console.log(data);
  	data = data.split('\n');
  	data = JSON.parse(data[0]);

    var dataSet = new Stats({
      timestamp: data.time,
      bluetoothAddress: data.addr,
      t006: data.t006,
      acceleration: {
        x: data.accl[0],
        y: data.accl[1],
        z: data.accl[2]
      },
      barometer: {
        temperature: data.baro[0],
        pressure: data.baro[1]
      },
      humiditySensor: {
        temperature: data.humd[0],
        humidity: data.humd[1]
      },
      magnetometer: {
        x: data.magn[0],
        y: data.magn[1],
        z: data.magn[2]
      }
    });

    dataSet.save();

    var historyQuery = Stats.find().sort({timestamp:-1}).limit(1000);
    historyQuery.select('timestamp t006');

    historyQuery.exec(function (err, data) {
      if (err) return handleError(err);
      socket.emit('history', data);
    })

  	socket.emit('news', data);
  });

});
