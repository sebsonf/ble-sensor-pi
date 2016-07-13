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

server.listen(3000);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static('ressources'));


// var stream = PlantStats.find().stream({ transform: JSON.stringify });
//
// stream.on('data', function(doc){
//     console.log('New item!');
//     console.log(doc);
// }).on('error', function (error){
//     console.log(error);
// }).on('close', function () {
//     console.log('closed');
// });



io.sockets.on('connection', function ( socket) {

    console.log('a user connected');



    // var historyQuery = Stats.find().sort({timestamp:-1}).limit(1000);
    // historyQuery.select('timestamp t006');
    //
    // historyQuery.exec(function (err, data) {
    //   if (err) return handleError(err);
    //   socket.emit('history', data);
    // })
    //
  	// socket.emit('news', data);
});

var lastDate;

// poll for new database entries
setInterval(function(){

    // get last entry
    var queryResult = PlantStats.findOne().sort({time:-1});
    queryResult.select('time temperature humidity');

    queryResult.exec(function( err, data ) {
      if (err) return handleError(err);
      console.log(data['time'], data['temperature'], data['humidity']);
      io.sockets.emit('news', data);
    });
}, 10000);
