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
    // var connection = request.accept('whiteboard-example', request.origin);
    // connections.push(connection);

    // console.log(connection.remoteAddress + " connected - Protocol Version " + connection.webSocketVersion);
    
    // Send all the existing canvas commands to the new client
    // connection.sendUTF(JSON.stringify({
    //   msg: "initCommands",
    //   data: canvasCommands
    // }));
    
    io.emit('draw', { msg: "initCommands", data: canvasCommands });

  });
  // Handle closed connections
  socket.on('close', function () {
    console.log(socket.remoteAddress + " disconnected");
    // var index = connections.indexOf(connection);
    // if (index !== -1) {
    //   // remove the connection from the pool
    //   connections.splice(index, 1);
    // }
  });
  
  // Handle incoming messages
  socket.on('message', function (message) {
    // if (message.type === 'utf8') {
    //   try {
    //     var command = JSON.parse(message.utf8Data);

    if (message.msg === 'clear') {
      canvasCommands = [];
    }
    else {
      canvasCommands.push(message);
    }

    io.emit('draw', message);
    // // rebroadcast command to all clients
    // connections.forEach(function (destination) {
    //   // destination.sendUTF(message.utf8Data);
    //   destination.emit(message.utf8Data);
    // });
  });

});

http.listen(process.env.PORT || 3000, function () {
  console.log('listening on :' + process.env.PORT);
});
