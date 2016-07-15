var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// ###########################################################
// EXPRESS WEBSERVER CONFIGURATION
// ###########################################################
server.listen(3000);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static('ressources'));

// ###########################################################
// MONGOOSE MONGODB DATABASE CONFIGURATION
// ###########################################################
var mongoose = require('mongoose');
mongoose.connect('mongodb://82.165.163.195/anbau');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
    console.log('connected to database!');
});

// mongoose schema representing sensor data
var sensorSchema = mongoose.Schema({
  time: Date,
  temperature: Number,
  humidity: Number,
  climateState: Boolean
});

// create mongoose model
var PlantStats = mongoose.model('plant_stats', sensorSchema);

// ###########################################################
// ON USER CONNECTION
// ###########################################################
io.sockets.on('connection', function ( socket) {

    console.log('a user connected');

    // get data from last hour
    updateLastHourHistory();

    // get most recent datapoint
    emitMostRecentDatapoint();

    // calculate mean, max and min for temperature and humidity from current hour
    calculateStatsFromCurrentHour();
});


function queryFromTimeSelection( startTime, stopTime, callback, params ){
  PlantStats.find({time: { $gte: startTime, $lt: stopTime}}).exec(function( err, data ) {
    callback( err, data, params);
  });
}



function calculateStatsFromCurrentHour(){
  // calculate mean from current hour
  var startTime = new Date();
  var stopTime = new Date();
  startTime.setMinutes(0);
  startTime.setSeconds(0);

  var timespan = startTime.getHours().toString() + ':' + startTime.getMinutes().toString() + ' - ' + stopTime.getHours().toString() + ':' + stopTime.getMinutes().toString();
  console.log(timespan);

  var params = {
    channel: 'stats-current-hour',
    startTime: startTime,
    timespan: timespan
  }

  queryFromTimeSelection( startTime, stopTime, calculateStatsFromTimeSelection, params);

}

// calculates the mean from time selection of query data and emits data on channel
function calculateStatsFromTimeSelection( err, data, params ){
  if (err){
    console.log(err);
  } else {
    var meanTemp = 0;
    var maxTemp = 0;
    var minTemp = 100;
    var meanHumid = 0;
    var maxHumid = 0;
    var minHumid = 100;

    for (var i = 0; i < data.length; i++){
      meanTemp += data[i].temperature;
      maxTemp = Math.max(maxTemp, data[i].temperature);
      minTemp = Math.min(minTemp, data[i].temperature);
      meanHumid += data[i].humidity;
      maxHumid = Math.max(maxHumid, data[i].humidity);
      minHumid = Math.min(minHumid, data[i].humidity);
    }
    meanTemp /= data.length;
    meanHumid /= data.length;

    var stats = {
      't': params.startTime,
      'timespan': params.timespan,
      'meanTemp': meanTemp,
      'maxTemp': maxTemp,
      'minTemp': minTemp,
      'meanHumid': meanHumid,
      'maxHumid': maxHumid,
      'minHumid': minHumid
    };
    console.log('vor emit: ', params.channel, params.timespan);
    io.sockets.emit( params.channel, stats );
  }
}

function emitMostRecentDatapoint(){
  PlantStats.findOne().sort({time:-1}).exec(function( err, data ) {
    if (err) return handleError(err);
    console.log(data['time'], data['temperature'], data['humidity'], data['fanState']);
    io.sockets.emit('most-recent-datapoint', data);
  });
}



function updateLastHourHistory(){
  // get current open hour
  var startTime = new Date();
  var stopTime = new Date();
  startTime.setHours( startTime.getHours() - 1);

  var params = {
    channel: 'last-hour-history'
  };

  queryFromTimeSelection( startTime, stopTime, emitLastHourHistory, params);
}

function emitLastHourHistory(err, data, params){
  if (err){
    console.log(err);
  }
  io.sockets.emit(params.channel, data);
}

// ###########################################################
// poll for new database entries every 10 seconds
// ###########################################################
setInterval(function(){
    // get last entry
    emitMostRecentDatapoint();

    updateLastHourHistory();

    // calculate mean, max and min for temperature and humidity from current hour
    calculateStatsFromCurrentHour();
}, 10000);
