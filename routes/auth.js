var jwt = require('jsonwebtoken');
var dotenv = require('dotenv').load();
var User = require('../model/user');

exports.isAuthenticated = function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(403)
    return res.send({
      success: false,
      message: 'No token provided.'
    });
  }
}

exports.authenticate = function(req, res) {
  // find the user
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.json({
        success: false,
        message: 'Authentication failed. User not found.'
      });
    } else if (user) {
      // check if password matches
      if (user.password != req.body.password) {
        res.json({
          success: false,
          message: 'Authentication failed. Wrong password.'
        });
      } else {
        // if user is found and password is right create a token
        var token = jwt.sign(user, process.env.SECRET, {
          expiresIn: 60 * 60 // expires in 1 hour
        });
        res.json({
          success: true,
          token: token
        });
      }
    }
  });
}