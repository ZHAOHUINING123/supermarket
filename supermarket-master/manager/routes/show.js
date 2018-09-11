const express = require('express');
const bodyParser = require("body-parser");
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

const showRouter = express.Router();

showRouter.use(bodyParser.json());

showRouter.get('/', function(req,res,next){
  let small = req.query.small;
  let large = req.query.large;
  let query_obj = {};
  if(small!=='-1')
    query_obj.small_class = Number(small);
  if(large !== '-1')
    query_obj.large_class = Number(large);
    Product.find(query_obj, function (error, docs) {
      if(error){
        next(error);
        return;
      }
      if(docs.length === 0){
        res.statusCode = 404;
        res.end();
        return;
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(docs);
    })
});

showRouter.get('/order', function(req,res,next){
  let type = req.query.type;
  let begin = req.query.begin;
  let end = req.query.end;
  if(type === '0'){
    type = 0;
  }else if(type === '1'){
    type = 1;
  }else if(type === '2'){
    type = 2;
  }
  Order.find({status:type}).sort('-send_date').skip(Number(begin)).limit(Number(begin) - Number(end)).exec(function (error, docs) {
    if(error){
      return next(error);
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(docs);
  })
});

showRouter.get('/order_number', function(req,res,next){
  let type = req.query.type;
  if(type === '0'){
    type = 0;
  }else if(type === '1'){
    type = 1;
  }else if(type === '2'){

  }
  Order.count({status:type}).exec(function (error, count) {
    if(error){
      console.log(error);
      return next(error);
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({count:count});
  })
});

showRouter.get('/details', function(req,res,next){
  let id = req.query.id;
  Order.findById(id).populate('buyer').exec(function (error, doc) {
    if(error){
      console.log(error);
      return next(error);
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(doc);
  })
});

showRouter.get('/mark', function(req,res,next){
  let id = req.query.id;
  Order.findById(id).exec(function (error, doc) {
    if(error){
      console.log(error);
      return next(error);
    }
    doc.status = Number(req.query.type);
    doc.save(function(error, aa){
      if(error){
        return next(error);
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({status:true});
    });
  })
});


module.exports = showRouter;