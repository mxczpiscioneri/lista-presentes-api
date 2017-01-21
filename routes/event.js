var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
var User = require('../model/user');
var EventSchema = require('../model/event');

exports.findById = function(req, res) {
  // find user and event
  User.findOne({ _id: new ObjectId(req.params.user) }, { 'events': { $elemMatch: { _id: new ObjectId(req.params.id) } } }, function(err, user) {

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
          message: "Event " + req.params.id + " not found"
        });
      }
    }
  });
}


exports.findAll = function(req, res) {
  // find user and event
  User.find({ _id: new ObjectId(req.params.user), 'events': { "$exists": true } }, function(err, user) {

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
          message: "Events not found"
        });
      }
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
  User.findOneAndUpdate({ _id: new ObjectId(req.params.user), 'events._id': new ObjectId(req.params.id) }, { "$set": { "events.$": req.body } }, function(err, user) {
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
          message: "Event: " + req.params.id + " updated successfully"
        });
      } else {
        res.json({
          success: false,
          message: "Event: " + req.params.id + " not found"
        });
      }
    }
  });
}

exports.delete = function(req, res) {
  User.findOneAndUpdate({ _id: new ObjectId(req.params.user) }, { $pull: { events: { _id: new ObjectId(req.params.id) } } }, req.body, function(err, user) {
  
    if (err) {
      res.status(500);
      res.json({
        success: false,
        message: "Error occured: " + err
      });
    } else {
      res.json({
        success: true,
        message: "Event: " + req.params.id + " deleted successfully"
      });
    }
  });
}
