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
var r = require('rethinkdb');


r.connect({
    host: 'localhost',
    port: 28015,
    db: 'anbau',
}, function(err, conn) {
    r.table('plant_stats').changes().run(conn, function(err, cursor) {
      cursor.each(function(err,row){
        if (err) throw err;
          console.log(row['new_val']['baro']);
      });
    });
});



server.listen(3000);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static('ressources'));


io.sockets.on('connection', function (socket) {
  console.log('a user connected');


    //dataSet.save();

    //var historyQuery = Stats.find().sort({timestamp:-1}).limit(1000);
    //historyQuery.select('timestamp t006');

    //historyQuery.exec(function (err, data) {
    //  if (err) return handleError(err);
    //  socket.emit('history', data);
    //})

  	//socket.emit('news', data);
  //});

});
