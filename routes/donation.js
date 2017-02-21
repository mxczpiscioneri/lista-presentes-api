var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
var request = require('request');
var dotenv = require('dotenv').load();
var xml2js = require('xml2js');
var User = require('../model/user');

exports.notification = function(req, res) {

  User.findById(new ObjectId(req.params.id), function(err, user) {
    if (err) {
      res.status(500);
      res.json({
        success: false,
        message: "Error occured: " + err
      });
    } else {
      if (user) {
        // Generate URL notification
        var uri = "https://ws.sandbox.pagseguro.uol.com.br/v3/transactions/notifications/" + req.body.notificationCode + "?email=" + user.events[0].emailPagseguro + "&token=" + user.events[0].tokenPagseguro;

        // Get xml transaction
        request(uri, function(error, response, body) {
          if (!error && response.statusCode == 200) {

            var parser = new xml2js.Parser();
            parser.parseString(body, function(err, result) {

              // find donation
              user.events[0].donations.forEach(function(donation) {
                if (donation._id == String(result.transaction.reference).split("|@|")[1]) {
                  // add details donation
                  donation.transaction = result.transaction.code;
                  donation.reference = result.transaction.reference;
                  donation.status = result.transaction.status;
                  donation.xml = body;
                  return;
                }
              });

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
                    message: "Donation updated successfully"
                  });
                }
              });
            });
          }
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