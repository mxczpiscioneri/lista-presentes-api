var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
  buscapeId: Number,
  categoryId: Number,
  name: String,
  pricemin: Number,
  pricemax: Number,
  link: String,
  image: String,
  bought: Number,
  buyers: {
    id: String,
    name: String,
    email: String,
    date: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  modified: {
    type: Date,
    default: Date.now
  }
});

module.exports = ProductSchema;
