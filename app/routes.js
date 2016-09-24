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
		User.find({'local.city': req.query.city, 'local.state': req.query.state}).exec(function(err, result){
			console.log(result);
			res.render('search', {user: req.user, agents: result});
		});
	});

	app.get('/profile', isLoggedIn, function(req, res) {
		console.log(req.user._id);
		res.render('profile', {user: req.user})
	});

	app.put('/profile', function(req, res) {
		var query = {};
		for(key in req.body){
			if(req.body[key] != ''){
				query[key] = req.body[key];				
			}
		}
		console.log(query);
		User.findOneAndUpdate({ '_id': req.user._id}, {$set: {'local.firstName': req.body.firstName, 'local.lastName': req.body.lastName, 'local.city': req.body.serviceAreaCity, 'local.state': req.body.serviceAreaState}}, {new: true})
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