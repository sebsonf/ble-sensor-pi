// More sensortag demo stuff by Michael Saunby. April 2013
//
// This nodejs server script requires the following to be in place -
// A suitable index.html in the same directory as this script.
// A logfile - see 'var sensortag' below.
// The logfile has new lines written to it, each should be a JSON string.


var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);


var cp = require('child_process');
var sensorlog = 'sensortag.log';

server.listen(3000);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


io.sockets.on('connection', function (socket) {
    console.log('a user connected');
    var child = cp.spawn('tail', ['-f', sensorlog]);
    child.stdout.on('data', function(data){
	data = data.toString();
	console.log(data);
	data = data.split('\n');
	data = JSON.parse(data[0]);
	socket.emit('news', data);
    });

});
