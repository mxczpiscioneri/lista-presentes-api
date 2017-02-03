var mongoose = require('mongoose');
var dotenv = require('dotenv');
dotenv.load();

module.exports = function() {

  mongoose.connect(process.env.MONGO_URI);
  var db = mongoose.connection;

  db.on('error', function(err) {
    console.error('MongoDB connection error:', err);
  });
  db.once('open', function callback() {
    console.info('MongoDB connection is established');
  });

};
