var localStrategy = require('passport-local').Strategy;
var User = require('../app/models/User');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://anonrealty%40gmail.com:hell0w0rld@smtp.gmail.com');

var mailOptions = {
	from: '"Bill Kernan" <wkernan@gmail.com>',
	to: 'wkernan@gmail.com',
	subject: 'Worked',
	text: 'Looks like it is working'
};

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use('local-signup', new localStrategy({
		usernameField: 'email',
		passwordField: 'password',
		
		passReqToCallback: true
	},
	function(req, email, password, done) {
		process.nextTick(function() {
			User.findOne({'local.email': email}, function(err, user) {
				if (err)
					return done(err);

				if (user) {
					return done(null, false);
				} else {
					var newUser = new User();
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

					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);
					newUser.local.firstName = req.body.firstName;
					newUser.local.lastName = req.body.lastName;
					newUser.local.company = req.body.company;
					newUser.local.website = req.body.website;
					newUser.local.address1 = req.body.address1;
					newUser.local.address2 = req.body.address2;
					newUser.local.country = req.body.country;
					newUser.local.state = req.body.state;
					newUser.local.city = req.body.city;
					newUser.local.zipcode = req.body.zipcode;
					newUser.local.phone = req.body.phone;
					newUser.local.cell = req.body.cell;
					newUser.local.orientation = req.body.orientation;
					newUser.local.bio = req.body.bio;
					newUser.local.license = req.body.license;
					newUser.local.license_year = req.body.license_year;
					newUser.local.nar = nar;
					newUser.local.distinctions = req.body.distinctions;
					newUser.local.specialties = req.body.specialties;
					newUser.local.acknowledgement = acknowledgement;

					newUser.save(function(err) {
						if (err) {
							throw err;
						} else {
							var mailToAdmin = {
								from: 'Anonymous Realty',
								to: 'anonrealty@gmail.com',
								subject: 'New Agent Signup',
								html: "<h2>A new agent has signed up! Click the Verify button to confirm their request.</h2><h5>Agent Name: " + newUser.local.firstName + ' ' + newUser.local.lastName + "</h5><h5>Agent Email: " + newUser.local.email + "</h5><form action='http://anon-realty.herokuapp.com/verified/" + newUser._id + "?_method=put' method='POST'><button type='submit'>Verify</button></form>"
							};

							var mailToAgent = {
								from: 'Anonymous Realty',
								to: newUser.local.email,
								subject: 'New Account with Anonymous Realty',
								html: "<h2>Thank you for signing up, please wait while our admin verify your account</h2><h3>You will recieve an email shortly letting you know your account is ready!</h3>"
							};

							transporter.sendMail(mailToAdmin, function(err, info) {
								if(err) {
									return console.log(err);
								}
								console.log('message sent');
							});
							transporter.sendMail(mailToAgent, function(err, info) {
								if(err) {
									return console.log(err);
								}
								console.log('message sent');
							});
							return done(null, newUser);
						}
					});
				}
			});
		});
	}));

	passport.use('local-login', new localStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
		User.findOne({'local.email': email}, function(err, user) {
			if (err)
				return done(err);

			if (!user)
				return done(null, false);

			if (!user.validPassword(password))
				return done(null, false);

			return done(null, user);
		});
	}));
};