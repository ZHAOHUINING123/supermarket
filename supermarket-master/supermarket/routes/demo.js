const express = require('express');
const bodyParser = require("body-parser");
const Product = require('../models/Product');
const authenticate = require('../authenticate');

const productRouter = express.Router();

productRouter.use(bodyParser.json());

productRouter.get( '/', authenticate.verifyUser, function(req,res,next){
  if(req.query.search){
    console.log(req.query.search);
    let search_content = new RegExp(req.query.search);
    Product.find({'name':{$regex: search_content, $options:'i'}}).exec(function (error, docs) {
      if(error){
        return next(error);
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(docs);
    })
  }else{
    let large = Number(req.query.large);
    let small = Number(req.query.small);
    let queryobject = {};
    queryobject.large_class = large;
    if(small !== -1)
      queryobject.small_class = small;
    Product.find(queryobject).exec(function (error, docs) {
      if(error){
        return next(error);
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(docs);
    });
  }
});

module.exports = productRouter;