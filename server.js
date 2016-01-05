// Import all the packages we need
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mysql = require('mysql');
var sanitizer = require('sanitizer');
var passport = require('passport');
var flash    = require('connect-flash');
var app      = express();

// Start our server
var server = app.listen(3000);
console.log('The magic happens on port 3000');
var io = require('socket.io').listen(server);


// connect to our database
require('./config/passport')(passport); // pass passport for configuration

var dbconfig = require('./config/database');
var db = mysql.createConnection(dbconfig.connection);
db.query('USE ' + dbconfig.database);

// Define/initialize our global vars
var messages = [];
var isInitmessages = false;
var users = {};

io.on('connection', function(socket){
  socket.on('login', function(name) {
    users[socket.id] = name; // Map this socket id to the username
    var userList = []; // Create a list with the users that are currently online
    Object.keys(users).forEach(function(key) {
        userList.push(users[key]);
    });
    socket.broadcast.emit('chat message', {user: 'Admin', message: '** User: \''+name+'\' connected **'});
    console.log('user \''+ users[socket.id] +'\' connected');
    // Let all sockets know who online
    io.emit('users connected', userList);
      
    // Load chat backlog
    if (! isInitmessages) { // The first time, get chat history from database
        // Initial app start, run db query
        db.query('SELECT * FROM messages')
            .on('result', function(data){
                // Push results onto the messages array
                messages.push(data);
            })
            .on('end', function(){
                // Only emit messages after query has been completed
                socket.emit('initial messages', messages);
            });

        isInitmessages = true
    } else { // All messages are alread stored in memory, no need to connect to the database
        socket.emit('initial messages', messages);
    }
  });
  
  socket.on('disconnect', function(){
    socket.broadcast.emit('chat message', {user: 'Admin', message: '** User: \''+users[socket.id]+'\' disconnected **'});
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
    // Sanitize the message to prevent XSS
    msg = sanitizer.sanitize(msg);
    messages.push({user: users[socket.id], message: msg});
    socket.broadcast.emit('chat message', {user: users[socket.id], message: msg}); // Send message to everyone except the author
    // Use node's db injection format to filter incoming data
    db.query('INSERT INTO messages (message,user) VALUES (?)', [[msg,users[socket.id] ]]);
  });

  socket.on('delete messages', function() {
    console.log('Messages being deleted...');
    // Deletes everything inside the messages table
    db.query("TRUNCATE TABLE messages");
    // Clears the local variable and sends it to every user
    messages = [];
    io.emit('initial messages', messages);
    console.log('Messages deleted!')
  });

});

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
  secret: 'vidyapathaisalwaysrunning',
  resave: true,
  saveUninitialized: true
} )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// load our routes and pass in our app and fully configured passport
require('./app/routes.js')(app, passport);