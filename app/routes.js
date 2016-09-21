module.exports = function(app, passport) {

	app.get('/', function(req,res) {
		res.render('index');
	});

	app.get('/about', function(req, res) {
		res.render('about')
	})

	app.get('/login', function(req, res) {
		res.render('login')
	});

	app.get('/signup', function(req, res) {
		res.render('signup')
	});

	app.get('/search', function(req, res) {
		res.render('search')
	})

	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile', {user: req.user})
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

		app.use(function (req, res){
		res.redirect('/');
	});

};

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated())
		return next();
	res.redirect('/');
}