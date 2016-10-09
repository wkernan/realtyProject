var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ReferralSchema = new Schema({
  refFirstName: String,
  refLastName: String,
  refPhone: String,
  refEmail: String,
  refInterest: String,
  refComments: String
});

var Referral = mongoose.model('Referral', ReferralSchema);

module.exports = Referral;