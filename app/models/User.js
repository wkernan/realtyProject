var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema({
	local: {
		firstName: String,
		lastName: String,
		company: String,
		website: String,
		address1: String,
		address2: String,
		country: String,
		state: String,
		city: String,
		zipcode: String,
		phone: String,
		cell: String,
		email: String,
		password: String,
		orientation: String,
		bio: String,
		license: String,
		license_year: Number,
		nar: Boolean,
		distinctions: String,
		specialties: String,
		area: [{country: String, state: String, city: String, area: String}]
	}
});

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);