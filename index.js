var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

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

http.listen(process.env.PORT || 3000, function () {
  console.log('listening on :' + process.env.PORT);
});
