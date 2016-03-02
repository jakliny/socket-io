var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('./'));

io.on('connection', function (socket) {
  console.log('connected: ' + socket);
  socket.on('chat message', function (msg) {
    console.log(msg);
    io.emit('chat message', msg);
  });
  
  // whiteboard
  var canvasCommands = [];

  socket.on('whiteboard', function (request) {
    io.emit('draw', { msg: "initCommands", data: canvasCommands });
  });
  // Handle closed connections
  socket.on('close', function () {

  });
  
  // Handle incoming messages
  socket.on('message', function (message) {
    if (message.msg === 'clear') {
      canvasCommands = [];
    }
    else {
      canvasCommands.push(message);
    }

    io.emit('draw', message);
  });

});

http.listen(port, function () {
  console.log('listening on :' + port);
});
