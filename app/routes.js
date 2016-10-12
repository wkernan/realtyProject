var User = require('./models/User');
var Area = require('./models/Area');
var Referral = require('./models/Referral');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://anonrealty%40gmail.com:hell0w0rld@smtp.gmail.com');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

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
	}));

	app.post('/upload', function(req, res) {
		  // create an incoming form object
	  var form = new formidable.IncomingForm();

	  // specify that we want to allow the user to upload multiple files in a single request
	  form.multiples = true;

	  // store all uploads in the /uploads directory
	  form.uploadDir = path.join(__dirname, '/uploads');
	  console.log(form.uploadDir);

	  // every time a file has been uploaded successfully,
	  // rename it to it's orignal name
	  form.on('file', function(field, file) {
	  	User.findOneAndUpdate({'_id': req.user._id}, {$set: {'local.image': file.name}}, {new:true})
	  	.exec(function(err, result) {
	    	fs.rename(file.path, path.join(form.uploadDir, file.name));
	  	})
	  });

	  // log any errors that occur
	  form.on('error', function(err) {
	    console.log('An error has occured: \n' + err);
	  });

	  // once all the files have been uploaded, send a response to the client
	  form.on('end', function() {
	    res.end('success');
	  });

	  // parse the incoming request containing the form data
	  form.parse(req);
	});

	app.get('/signup', function(req, res) {
		res.render('signup', {user: req.user});
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	app.get('/search', function(req, res) {
		User.find({}).populate('local.areas').exec(function(err, result){
			res.render('search', {user: req.user, agents: result});
		});
	});

	app.get('/agent/:id', function(req,res) {
		User.find({'_id': req.params.id})
		.populate('local.areas')
		.exec(function(err, result) {
			result = result[0];
			res.render('agent', {user: req.user, agent: result});
		})
	});

	app.get('/profile', isLoggedIn, function(req, res) {
		User.find({'_id': req.user._id})
		.populate('local.areas')
		.exec(function(err, result) {
			result = result[0];
			res.render('profile', {user: req.user, areas: result.local.areas});
		})
	});

	app.get('/referral', isLoggedIn, function(req, res) {
		User.find({'_id': req.user._id})
		.populate('local.referrals')
		.exec(function(err, result) {
			result = result[0];
			res.render('referral', {user: req.user, referrals: result.local.referrals});
		})
	})

	app.delete('/profile/:id', isLoggedIn, function(req, res) {
		Area.find({'_id': req.params.id}).remove()
		.exec(function(err, result) {
			res.redirect('/profile');
		})
	});

	app.put('/verified/:id', function(req, res) {
		User.findOneAndUpdate({'_id': req.params.id}, {$set: {'local.isVerified': true}}, {new: true})
		.exec(function(err, result) {
			var mailOptions = {
				from: 'Anonymous Realty',
				to: result.local.email,
				subject: 'Account Approved',
				html: '<h1>Thank You!</h1><h2>Your account has been approved</h2><h2><a href="http://localhost:3000/login">Click</a> here to log in</h2>'
			};
			transporter.sendMail(mailOptions, function(err, info) {
				if(err) {
					return console.log(err);
				}
				console.log('message sent');
			});
			res.redirect('/admin');
		})
	})

	app.put('/profile', function(req, res) {
		var query = {};
		for(key in req.body){
			if(req.body[key] != ''){
				query[key] = req.body[key];				
			}
		}

		var nar;
		var acknowledgement;

		if(req.body.nar == 'on') {
			nar = true;
		} else {
			nar = false;
		}
		if(req.body.acknowledgement == 'on') {
			acknowledgement = true;
		} else {
			acknowledgement = false;
		}

		User.findOneAndUpdate({ '_id': req.user._id}, {$set: {'local.firstName': req.body.firstName, 'local.lastName': req.body.lastName, 'local.nar': nar, 'local.acknowledgement': acknowledgement, 'local.orientation': req.body.orientation, 'local.license': req.body.license, 'local.license_year': req.body.license_year, 'local.bio': req.body.bio, 'local.distinctions': req.body.distinctions, 'local.specialties': req.body.specialties}}, {new: true})
		.exec(function(err, result) {
			res.redirect('/profile');
		})
	});

	app.post('/referral', function(req, res) {
		var newReferral = new Referral({'refFirstName': req.body.firstName, 'refLastName': req.body.lastName, 'refPhone': req.body.phone, 'refEmail': req.body.email, 'refInterest': req.body.interest, 'refComments': req.body.comments});
		newReferral.save(function(err,doc) {
			User.findOneAndUpdate({'_id': req.body.id}, {$push: {'local.referrals': doc._id}}, {new: true})
			.exec(function(err, result) {
				var mailToAgent = {
					to: req.body.agentEmail,
					from: req.body.email,
					subject: 'You have a new referral',
					html: '<h1>' + req.body.firstName + ' ' + req.body.lastName + ' is interested in ' + req.body.interest + '</h1><h2><a href="http://localhost:3000/login">Log in</a> to view and confirm</h2>'
				}

				transporter.sendMail(mailToAgent, function(err, info) {
					if(err) {
						return console.log(err);
					}
					console.log('message sent');
				});

				res.redirect('back');
			})
		})
	})

	app.post('/profile', function(req, res) {
		var newArea = new Area({'country': req.body.serviceAreaCountry, 'city': req.body.serviceAreaCity, 'state': req.body.serviceAreaState, 'area': req.body.serviceAreaArea});
		newArea.save(function(err,doc) {
			User.findOneAndUpdate({'_id': req.user._id}, {$push: {'local.areas': doc._id}}, {new: true})
			.exec(function(err, result) {
				res.redirect('/profile');
			})
		})
	})

	app.get('/admin', isAdmin, function(req, res) {
		User.find({}).exec(function(err, result) {
			res.render('admin', {user: req.user, agent: result});
		})
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

		app.use(function (req, res){
		res.redirect('/');
	});

};

function isAdmin(req,res,next) {
	if(req.isAuthenticated()) {
		User.find({'_id': req.user._id})
		.exec(function(err,result) {
			if(err) {
				res.redirect('/');
			}
			var result = result[0];
			if(result.local.isAdmin)
				return next();
			res.redirect('/');
		})
	} else {
		res.redirect('/');
	}
}

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated())
		return next();
	req.session.returnTo = req.path;
	res.redirect('/login');
}