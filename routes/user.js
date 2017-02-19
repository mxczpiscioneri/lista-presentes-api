var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
var User = require('../model/user');

exports.findById = function(req, res) {
  User.findById(new ObjectId(req.params.id), function(err, user) {
    if (err) {
      res.status(500);
      res.json({
        success: false,
        message: "Error occured: " + err
      });
    } else {
      if (user) {
        res.json({
          success: true,
          data: user
        });
      } else {
        res.status(404);
        res.json({
          success: false,
          message: "User " + req.params.id + " not found"
        });
      }
    }
  });
}

exports.findAll = function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      res.status(500);
      res.json({
        success: false,
        message: "Error occured: " + err
      });
    } else {
      res.json({
        success: true,
        data: users
      });
    }
  });
}

exports.add = function(req, res) {
  // valid user
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.status(500);
    return res.json({
      success: false,
      message: 'Please enter name, email and password.'
    });
  }

  // create user
  var UserNew = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  // save user
  UserNew.save(function(err) {
    if (err) {
      res.status(500);
      return res.json({
        success: false,
        message: 'Duplicate email'
      });
    } else {
      res.json({
        success: true,
        message: "User added successfully"
      });
    }
  });
}

exports.update = function(req, res) {
  // valid user
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.status(500);
    return res.json({
      success: false,
      message: 'Please enter name, email and password.'
    });
  }

  // update user
  User.findByIdAndUpdate(new ObjectId(req.params.id), req.body, function(err, user) {
    if (err) {
      res.status(500);
      res.json({
        success: false,
        message: "Error occured: " + err
      });
    } else {
      if (user) {
        res.json({
          success: true,
          message: "User: " + req.params.id + " updated successfully"
        });
      } else {
        res.json({
          success: false,
          message: "User: " + req.params.id + " not found"
        });
      }
    }
  });
}

exports.delete = function(req, res) {
  User.findByIdAndRemove(new Object(req.params.id), function(err, user) {
    if (err) {
      res.status(500);
      res.json({
        success: false,
        message: "Error occured: " + err
      });
    } else {
      res.json({
        success: true,
        message: "User: " + req.params.id + " deleted successfully"
      });
    }
  });
}
