var localStrategy = require('passport-local').Strategy;
var User = require('../app/models/User');

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
						if (err)
							throw err;
						return done(null, newUser);
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