var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var userSchema = new Schema({
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
		image: String,
		distinctions: String,
		specialties: String,
		isAdmin: {
			type: Boolean,
			default: 0
		},
		areas: [{type: Schema.Types.ObjectId,
      ref: 'Area'}]
	}
});

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);