var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
var multer = require('multer');
var User = require('../model/user');
var EventSchema = require('../model/event');
var ConfirmationSchema = require('../model/confirmation');

exports.findByName = function(req, res) {
  // find event
  User.findOne({ 'events.slug': req.params.slug }, { 'events.$': 1 }, function(err, event) {

    if (err) {
      res.status(500);
      res.json({
        success: false,
        message: "Error occured: " + err
      });
    } else {
      if (event) {
        res.json({
          success: true,
          data: event
        });
      } else {
        res.status(404);
        res.json({
          success: false,
          message: "Event " + req.params.slug + " not found"
        });
      }
    }
  });
}

exports.findById = function(req, res) {
  // find user
  User.findById(new ObjectId(req.params.user), function(err, user) {
    console.log(user);

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
          data: user.events[0]
        });
      } else {
        res.status(404);
        res.json({
          success: false,
          message: "Event " + req.params.id + " not found"
        });
      }
    }
  });
}

exports.confirmations = function(req, res) {
  // find user
  User.findById(new ObjectId(req.params.user), function(err, user) {
    console.log(user);

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
          data: user.events[0].confirmations
        });
      } else {
        res.status(404);
        res.json({
          success: false,
          message: "Event " + req.params.id + " not found"
        });
      }
    }
  });
}

exports.confirmation = function(req, res) {
  // create confirmation
  Confirmation = mongoose.model('Confirmation', ConfirmationSchema);
  var ConfirmationNew = new Confirmation({
    name: req.body.name,
    accept: req.body.accept,
    adults: req.body.adults,
    children: req.body.children,
    email: req.body.email,
    phone: req.body.phone,
    message: req.body.message
  });

  // find user
  User.findById(new ObjectId(req.params.user), function(err, user) {
    if (err) {
      res.status(500);
      res.json({
        success: false,
        message: "Error occured: " + err
      });
    } else {
      // add confirmation
      user.events[0].confirmations.push(ConfirmationNew);

      // save user
      user.save(function(err) {
        if (err) {
          res.status(500);
          return res.json({
            success: false,
            message: 'Error occured: ' + err
          });
        } else {
          res.json({
            success: true,
            message: "Confirmation added successfully"
          });
        }
      });
    }
  });
}

exports.add = function(req, res) {
  // create event
  Event = mongoose.model('Event', EventSchema);
  var EventNew = new Event({
    name: req.body.name,
    date: req.body.date,
    time: req.body.time,
    place: req.body.place,
    city: req.body.city,
    state: req.body.state
  });

  // find user
  User.findById(new ObjectId(req.params.user), function(err, user) {
    if (err) {
      res.status(500);
      res.json({
        success: false,
        message: "Error occured: " + err
      });
    } else {
      // add event in user
      user.events.push(EventNew);

      // save event
      user.save(function(err) {
        if (err) {
          res.status(500);
          return res.json({
            success: false,
            message: 'Error occured:: ' + err
          });
        } else {
          res.json({
            success: true,
            message: "Event added successfully"
          });
        }
      });
    }
  });
}

exports.update = function(req, res) {
  // update event
  User.findById(new ObjectId(req.params.user), function(err, user) {
    if (err) {
      res.status(500);
      res.json({
        success: false,
        message: "Error occured: " + err
      });
    } else {
      // add event in user
      user.events[0] = req.body;

      // save event
      user.save(function(err) {
        if (err) {
          res.status(500);
          return res.json({
            success: false,
            message: 'Error occured:: ' + err
          });
        } else {
          res.json({
            success: true,
            message: "Event updated successfully"
          });
        }
      });
    }
  });
}

exports.upload = function(req, res) {
  //multers disk storage settings
  var storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, __dirname + '/../public/uploads/');
    },
    filename: function(req, file, cb) {
      var datetimestamp = Date.now();
      cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
  });

  //multer settings
  var upload = multer({
    storage: storage
  }).single('file');

  // Upload
  upload(req, res, function(err) {
    if (err) {
      res.status(500);
      res.json({
        success: false,
        message: err
      });
      return;
    }
    res.status(200);
    res.json({
      success: true,
      data: req.file.filename
    });
  });
}
