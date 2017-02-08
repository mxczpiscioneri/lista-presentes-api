var mongoose = require('mongoose');
var ProductSchema = require('./product');
var ConfirmationSchema = require('./confirmation');

var EventSchema = new mongoose.Schema({
  name: String,
  slug: {
    type: String,
    unique: true
  },
  date: Date,
  time: String,
  place: String,
  city: String,
  state: String,
  image: String,
  products: [ProductSchema],
  confirmations: [ConfirmationSchema],
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
