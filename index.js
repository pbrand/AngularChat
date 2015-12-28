var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');
var db = mysql.createConnection({
	host: 'localhost',
	user: 'cs4105',
	password: 'cs4105',
	database: 'AngularChat_insecure'
});


// Log any errors connected to the db
db.connect(function(err){
    if (err) console.log(err)
})

// Define/initialize our global vars
var messages = [];
var isInitmessages = false;
var users = {};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('login', function(credentials) {
      users[socket.id] = credentials.name;
      var userList = [];
      Object.keys(users).forEach(function(key) {
          userList.push(users[key]);
      });
      socket.broadcast.emit('chat message', {user: 'Server', message: '** User: \''+credentials.name+'\' connected **'});
      console.log('user \''+ users[socket.id] +'\' connected');
      // Let all sockets know who are connected
      io.emit('users connected', userList);
  });
  
  socket.on('disconnect', function(){
    socket.broadcast.emit('chat message', {user: '', message: '** User: \''+users[socket.id]+'\' disconnected **'});
    console.log('user \''+ users[socket.id] + '\' disconnected');
    delete users[socket.id];
    var userList = [];
    Object.keys(users).forEach(function(key) {
        userList.push(users[key]);
    });
    // Let all sockets know who are connected
    io.emit('users connected', userList);
  });
  
  socket.on('chat message', function(msg){
    console.log('user \''+ users[socket.id] +'\' says: \"'+msg+'\"');
    messages.push({user: users[socket.id], message: msg});
    //io.emit('chat message', msg); // This emits to all.
    socket.broadcast.emit('chat message', {user: users[socket.id], message: msg}); // Send message to everyone except the author
    // Use node's db injection format to filter incoming data
    db.query('INSERT INTO messages (message,author) VALUES (?)', [[msg,users[socket.id] ]]);
  });
  
  console.log("Nothing here???");
  // Check to see if initial query/messages are set
  if (! isInitmessages) {
    console.log("what happened "+socket.id);
    // Initial app start, run db query
    db.query('SELECT * FROM messages')
        .on('result', function(data){
            // Push results onto the messages array
            messages.push(data);
        })
        .on('end', function(){
            console.log('Send initial messages'+" data: "+messages);
            // Only emit messages after query has been completed
            socket.emit('initial messages', messages);
        });

    isInitmessages = true
  } else {
      console.log("what happened 2 "+socket.id+" data: "+messages);
    // Initial messages already exist, send out
    socket.emit('initial messages', messages);
  }
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});