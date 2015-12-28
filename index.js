var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('user \''+ socket.id +'\' connected');
  socket.on('disconnect', function(){
    console.log('user \''+ socket.id + '\' disconnected');
  });
socket.on('chat message', function(msg){
    console.log('user \''+ socket.id +'\' says: \"'+msg+'\"');
    //io.emit('chat message', msg); // This emits to all.
    socket.broadcast.emit('chat message', {author: socket.id, message: msg}); // Send message to everyone except the author
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});