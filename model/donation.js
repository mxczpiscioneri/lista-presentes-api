var mongoose = require('mongoose');

var DonationSchema = new mongoose.Schema({
  name: String,
  email: Boolean,
  reference: String,
  code: String,
  status: Number,
  grossamount: Number,
  xml: String,
  created: {
    type: Date,
    default: Date.now
  },
  modified: {
    type: Date,
    default: Date.now
  }
});

module.exports = DonationSchema;