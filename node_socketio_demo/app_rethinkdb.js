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

var conn;

server.listen(3000);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// permit access to ressources folder
app.use(express.static('ressources'));

r.connect({
    host: '192.168.0.2',
    port: 28015,
    db: 'anbau',
}, function(err, connection) {
    conn = connection;


    io.sockets.on('connection', function (socket) {
      console.log('a user connected');

      r.table('plant_stats').changes().run(connection, function(err, cursor) {
        console.log('Kack ding 1');
        cursor.each(function(err,row){
          if (err) throw err;
            console.log(row['new_val']['temperature']);
            socket.emit('news', row['new_val']);
        });
      });
        //dataSet.save();

      r.db('anbau').table("plant_stats").filter(
          r.row('time').during(r.now().sub(86400), r.now())
      ).run(connection, function(err, cursor) {
        console.log('Kack ding 2');
        cursor.toArray(function(err,data){
          if (err) throw err;
            socket.emit('history', data);
            //socket.emit('news', row['new_val']);
        });
      });
        //var historyQuery = Stats.find().sort({timestamp:-1}).limit(1000);
        //historyQuery.select('timestamp t006');

        //historyQuery.exec(function (err, data) {
        //  if (err) return handleError(err);
        //  socket.emit('history', data);
        //})

      	//socket.emit('news', data);
      //});

    });



});









// r.table('plant_stats').orderBy(r.desc('time')).limit(1).run(conn, function(err, cursor) {
//   console.log('Kack ding 2');
//   cursor.each(function(err,row){
//     if (err) throw err;
//       console.log(row);
//   });
// });
//
// io.sockets.on('connection', function (socket) {
//   console.log('a user connected');
//
//
//     //dataSet.save();
//
//     //var historyQuery = Stats.find().sort({timestamp:-1}).limit(1000);
//     //historyQuery.select('timestamp t006');
//
//     //historyQuery.exec(function (err, data) {
//     //  if (err) return handleError(err);
//     //  socket.emit('history', data);
//     //})
//
//   	//socket.emit('news', data);
//   //});
//
// });
