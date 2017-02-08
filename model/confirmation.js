var mongoose = require('mongoose');

var ConfirmationSchema = new mongoose.Schema({
  name: String,
  accept: Boolean,
  adults: Number,
  children: Number,
  email: String,
  phone: String,
  message: String,
  created: {
    type: Date,
    default: Date.now
  },
  modified: {
    type: Date,
    default: Date.now
  }
});

module.exports = ConfirmationSchema;
