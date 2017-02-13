var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
var User = require('../model/user');
var ProductSchema = require('../model/product');
var Lomadee = require("lomadee-api");
var dotenv = require('dotenv').load();

exports.search = function(req, res) {

  var lomadee = new Lomadee(process.env.APPLICATIONID, process.env.SOURCEID);

  lomadee.product({
    keyword: req.params.name,
    page: req.params.page,
    sort: req.params.sort,
    results: 100
  }, (err, results) => {
    res.json(results);
  });
}

exports.findAll = function(req, res) {
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
            data: user.events[0].products
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

exports.add = function(req, res) {
  // create product
  Product = mongoose.model('Product', ProductSchema);
  var ProductNew = new Product({
    buscapeId: req.body.buscapeId,
    categoryId: req.body.categoryid,
    name: req.body.name,
    pricemin: req.body.pricemin,
    pricemax: req.body.pricemax,
    link: req.body.link,
    image: req.body.image,
    bought: req.body.bought
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
      // add product
      user.events[0].products.push(ProductNew);

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
            message: "Product added successfully",
            productId: user.events[0].products[user.events[0].products.length - 1]._id
          });
        }
      });
    }
  });
}

exports.delete = function(req, res) {
  User.findById(new ObjectId(req.params.user), function(err, user) {
    if (err) {
      res.status(500);
      res.json({
        success: false,
        message: "Error occured: " + err
      });
    } else {
      // remove product
      user.events[0].products.remove({
        _id: req.params.id
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
            message: "Product deleted successfully"
          });
        }
      });
    }
  });
}

exports.buy = function(req, res) {
  User.findById(new ObjectId(req.params.user), function(err, user) {
    if (err) {
      res.status(500);
      res.json({
        success: false,
        message: "Error occured: " + err
      });
    } else {
      // find product
      user.events[0].products.forEach(function(product) {
        if (product._id == req.params.id) {
          // add buy
          product.bought = req.params.bought;
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
            message: "Product bought successfully"
          });
        }
      });
    }
  });
}

exports.bought = function(req, res) {
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
          var products = user.events[0].products;
          products = products.filter(function(el) {
            return el.bought > 0;
          });

          res.json({
            success: true,
            data: products
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