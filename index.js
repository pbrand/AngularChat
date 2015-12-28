var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = {};  

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('login', function(credentials) {
      users[socket.id] = credentials.name;
  });
  console.log('user \''+ users[socket.id] +'\' connected');
  socket.on('disconnect', function(){
    console.log('user \''+ users[socket.id] + '\' disconnected');
  });
socket.on('chat message', function(msg){
    console.log('user \''+ users[socket.id] +'\' says: \"'+msg+'\"');
    //io.emit('chat message', msg); // This emits to all.
    socket.broadcast.emit('chat message', {user: users[socket.id], message: msg}); // Send message to everyone except the author
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});