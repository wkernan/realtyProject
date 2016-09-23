module.exports = function(app, passport) {

	app.get('/', function(req,res) {
		res.render('index', {user: req.user});
	});

	app.get('/about', function(req, res) {
		res.render('about', {user: req.user});
	})

	app.get('/login', function(req, res) {
		res.render('login')
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}))

	app.get('/signup', function(req, res) {
		res.render('signup', {user: req.user});
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	app.get('/search', function(req, res) {
		res.render('search', {user: req.user})
	});

	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile', {user: req.user})
	});

	app.get('/admin', isAdmin, function(req, res) {
		res.render('admin', {user: req.user})
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

		app.use(function (req, res){
		res.redirect('/');
	});

};

function isAdmin() {
	
}

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated())
		return next();
	res.redirect('/');
}