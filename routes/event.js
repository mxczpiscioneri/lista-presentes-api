var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var tinify = require('tinify');
var pagseguro = require('pagseguro.js');
var dotenv = require('dotenv');
dotenv.load();
var User = require('../model/user');
var EventSchema = require('../model/event');
var ConfirmationSchema = require('../model/confirmation');
var DonationSchema = require('../model/donation');

exports.findByName = function(req, res) {
  // find event
  User.findOne({
    'events.slug': req.params.slug
  }, {
    'events.$': 1
  }, function(err, event) {

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
          data: event,
          password: event.events[0].password ? true : false
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

    if (err) {
      res.status(500);
      res.json({
        success: false,
        message: "Error occured: " + err
      });
    } else {
      if (user) {
        if (user.events[0]) {
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

exports.confirmations = function(req, res) {
  // find user
  User.findById(new ObjectId(req.params.user), function(err, user) {

    if (err) {
      res.status(500);
      res.json({
        success: false,
        message: "Error occured: " + err
      });
    } else {
      if (user) {
        if (user.events[0]) {
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
      // check password
      if (user.events[0].password && user.events[0].password != req.params.password) {
        return res.json({
          success: false,
          message: 'Authentication failed. Wrong password.'
        });
      }

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

exports.donations = function(req, res) {
  // find user
  User.findById(new ObjectId(req.params.user), function(err, user) {

    if (err) {
      res.status(500);
      res.json({
        success: false,
        message: "Error occured: " + err
      });
    } else {
      if (user) {
        if (user.events[0]) {
          res.json({
            success: true,
            data: user.events[0].donations
          });
        } else {
          res.status(404);
          res.json({
            success: false,
            message: "Event " + req.params.id + " not found"
          });
        }
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

exports.donation = function(req, res) {
  // create donation
  Donation = mongoose.model('Donation', DonationSchema);
  var DonationNew = new Donation({
    name: req.body.name,
    email: req.body.email,
    amount: req.body.amount
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
      user.events[0].donations.push(DonationNew);

      // save user
      user.save(function(err) {
        if (err) {
          res.status(500);
          return res.json({
            success: false,
            message: 'Error occured: ' + err
          });
        } else {

          process.env['PAGSEGURO_TEST'] = true;

          var pag = pagseguro({
            'name': user.events[0].name,
            'email': user.events[0].emailPagseguro,
            'token': user.events[0].tokenPagseguro,
            'reference': user._id + '|@|' + DonationNew._id,
            'redirectURL': req.get('origin') + '/' + user.events[0].slug + '/vaquinha/',
            'notificationURL': 'https://listadepresentes-api.herokuapp.com/api/notification/' + user._id + '/'
          });

          pag.product.add({
            'id': DonationNew._id,
            'description': 'Vaquinha ' + user.events[0].name,
            'amount': DonationNew.amount,
            'quantity': 1,
            'shippingCost': 1
          });

          pag.shipping.set({
            'type': 3,
            'cost': 0
          });

          pag.checkout(function(err, resp, body) {
            if (!err && !body.errors) {
              res.json({
                success: true,
                message: "Donatios added successfully",
                code: body.checkout.code
              });
            }
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
            message: 'Error occured: ' + err
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
      // Valid slug
      User.find({}, function(err, users) {
        if (err) {
          res.status(500);
          res.json({
            success: false,
            message: "Error occured: " + err
          });
        } else {
          users.forEach(function(user) {
            if (user._id != req.params.user && user.events[0].slug == req.body.slug) {
              res.status(409);
              return res.json({
                success: false,
                message: 'Duplicate slug'
              });
            }
          });

          // add event in user
          user.events[0] = req.body;

          // save event
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
                message: "Event updated successfully"
              });
            }
          });
        }
      });
    }
  });
}

exports.upload = function(req, res) {
  var nameImage = req.files.file.name.split('.')[0] + "-" + Date.now() + "." + req.files.file.name.split('.')[req.files.file.name.split('.').length - 1];

  tinify.key = process.env.TINIFY_KEY;
  var source = tinify.fromFile(req.files.file.path);
  source.store({
    service: "s3",
    aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
    aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION,
    path: process.env.S3_BUCKET + "/cover/" + nameImage
  });

  res.status(200);
  res.json({
    success: true,
    data: nameImage
  });
}
