var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
  buscapeId: {
    type: Number,
    unique: true
  },
  categoryId: Number,
  name: String,
  pricemin: Number,
  pricemax: Number,
  link: String,
  image: String,
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
