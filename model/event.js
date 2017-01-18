var mongoose = require('mongoose');
var ProductSchema = require('./product');

var EventSchema = new mongoose.Schema({
  name: String,
  date: Date,
  time: String,
  place: String,
  city: String,
  state: String,
  image: String,
  products: [ProductSchema],
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
