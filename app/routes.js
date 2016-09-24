var User = require('./models/User');

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
		console.log(req.user._id);
		res.render('profile', {user: req.user})
	});

	app.put('/profile', function(req, res) {
		console.log(req.user._id);
		console.log(req.body.firstName);
		User.findOneAndUpdate({ '_id': req.user._id}, {$set: {'local.firstName': req.body.firstName, 'local.lastName': req.body.lastName}}, {new: true})
		.exec(function(err, result) {
			res.redirect('/profile');
		})
	})

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