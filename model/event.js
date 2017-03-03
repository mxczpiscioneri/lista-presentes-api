var mongoose = require('mongoose');
var ProductSchema = require('./product');
var ConfirmationSchema = require('./confirmation');
var DonationSchema = require('./donation');

var EventSchema = new mongoose.Schema({
  name: String,
  slug: String,
  date: String,
  time: String,
  place: String,
  city: String,
  state: String,
  image: String,
  products: [ProductSchema],
  confirmations: [ConfirmationSchema],
  donations: [DonationSchema],
  emailPagseguro: String,
  tokenPagseguro: String,
  created: {
    type: Date,
    default: Date.now
  },
  modified: {
    type: Date,
    default: Date.now
  }
});

module.exports = EventSchema;
