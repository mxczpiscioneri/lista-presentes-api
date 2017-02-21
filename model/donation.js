var mongoose = require('mongoose');

var DonationSchema = new mongoose.Schema({
  name: String,
  email: String,
  amount: Number,
  reference: String,
  transaction: String,
  status: String,
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