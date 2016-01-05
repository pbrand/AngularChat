// app/routes.js
module.exports = function(app, passport) {

	// The home page with login and register forms.
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	// The login page
	app.get('/login', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/chat', // redirect to the chat section
            failureRedirect : '/login', // redirect back to the login page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
        	// Create a cookie to use with the session
            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	// The register page
	app.get('/register', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('register.ejs', { message: req.flash('signupMessage') });
	});

	// process the register form
	app.post('/register', passport.authenticate('local-signup', {
		successRedirect : '/chat', // redirect to the chat section
		failureRedirect : '/register', // redirect back to the register page if there is an error
		failureFlash : true // allow flash messages
	}));

	// The chatroom page, only accessable when you are logged in.
	// We will use route middleware to verify this (the isLoggedIn function)
	app.get('/chat', isLoggedIn, function(req, res) {
		res.render('chat.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// Logout
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
	res.redirect('/');
}
