var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
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

exports.findById = function(req, res) {
  Product.findById(new ObjectId(req.params.id), function(err, product) {
    if (err) {
      res.status(500);
      res.json({
        success: false,
        message: "Error occured: " + err
      });
    } else {
      if (product) {
        res.json({
          success: true,
          data: product
        });
      } else {
        res.status(404);
        res.json({
          success: false,
          message: "Product " + req.params.id + " not found"
        });
      }
    }
  });
}

exports.findAll = function(req, res) {
  Product = mongoose.model('Product', ProductSchema);
  Product.find({}, function(err, products) {
    if (err) {
      res.status(500);
      res.json({
        success: false,
        message: "Error occured: " + err
      });
    } else {
      res.json({
        success: true,
        data: products
      });
    }
  });
}

exports.add = function(req, res) {
  // create product
  Product = mongoose.model('Product', ProductSchema);
  var ProductNew = new Product({
    buscapeId: req.body.id,
    categoryId: req.body.categoryid,
    name: req.body.productname,
    pricemin: req.body.pricemin,
    pricemax: req.body.pricemax,
    link: req.body.link,
    image: req.body.image,
  });

  // save product
  ProductNew.save(function(err, product) {
    if (err) {
      res.status(500);
      return res.json({
        success: false,
        message: err //'That product already exists.'
      });
    } else {
      console.log('Product saved successfully');
      res.json({
        success: true,
        data: product,
        message: "Product added successfully"
      });
    }
  });
}

exports.update = function(req, res) {
  // valid product
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.status(500);
    return res.json({
      success: false,
      message: 'Please enter name, email and password.'
    });
  }

  // update product
  Product.findByIdAndUpdate(new ObjectId(req.params.id), req.body, function(err, product) {
    if (err) {
      res.status(500);
      res.json({
        success: false,
        message: "Error occured: " + err
      });
    } else {
      if (product) {
        res.json({
          success: true,
          message: "Product: " + req.params.id + " updated successfully"
        });
      } else {
        res.json({
          success: false,
          message: "Product: " + req.params.id + " not found"
        });
      }
    }
  });
}

exports.delete = function(req, res) {
  Product.findByIdAndRemove(new Object(req.params.id), function(err, product) {
    if (err) {
      res.status(500);
      res.json({
        success: false,
        message: "Error occured: " + err
      });
    } else {
      res.json({
        success: true,
        message: "Product: " + req.params.id + " deleted successfully"
      });
    }
  });
}