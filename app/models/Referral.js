var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ReferralSchema = new Schema({
  refFirstName: String,
  refLastName: String,
  refPhone: String,
  refEmail: String,
  refInterest: String,
  refComments: String,
  isActive: {
  	type: Boolean,
  	default: false
  },
  isPending: {
  	type: Boolean,
  	default: true
  },
  isDeclined: {
  	type: Boolean,
  	default: false
  },
  isComplete: {
  	type: Boolean,
  	default: false
  }
});

var Referral = mongoose.model('Referral', ReferralSchema);

module.exports = Referral;