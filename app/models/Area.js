var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AreaSchema = new Schema({
  country: String,
  state: String,
  city: String,
  area: String
});

var Area = mongoose.model('Area', AreaSchema);

module.exports = Area;