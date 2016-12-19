var mongoose = require('mongoose');
var dotenv = require('dotenv');
dotenv.load();

module.exports = function() {

  mongoose.connect(process.env.MONGO_URI, function (err) {
    if (err) {
      return console.log('Cannot connect to database', err);
    }
    return console.log('Database connected.');
  });

};