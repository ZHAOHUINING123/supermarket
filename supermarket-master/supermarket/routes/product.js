const express = require('express');
const bodyParser = require("body-parser");
const User = require('../models/User');
const authenticate = require('../authenticate');
const Product = require('../models/Product');
const Order = require('../models/Order');
const email = require('../config_email');

const productRouter = express.Router();

productRouter.use(bodyParser.json());

productRouter.get('/', function(req,res,next){
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

productRouter.post('/', authenticate.verifyUser, (req, res, next) =>{
  let amount_array = [];
  amount_array = req.body.items.map(obj => obj.id);
  Product.find({
    '_id': { $in: amount_array}
  }, function(err, docs){
    if(err){
      return next(err);
    }
    let result = [];
    amount_array.forEach(function(key) {
      docs.forEach(function (doc) {
        if(key === doc._id.toString()){
          result.push(doc);
        }
      })
    });

    for(let i = 0; i < result.length; i++){
      if(amount_array[i] > result[i].inventory){
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json({err : 'no_amount'});
        return;
      }
    }

    User.findById(req.user._id, function (error, doc) {
      if(error)
        return next(error);
      if(!doc || doc.length === 0){
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.json({err : 'no_user'});
        return;
      }
      let items = req.body.items;
      for(let i = 0; i < items.length; i++){
        items[i].old_id = items[i].id;
        delete items[i].id;
      }
      if(!items || items.length ===0){
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json({err:'no_item'});
        return;
      }
      if(!req.body.address){
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json({err:'no_address'});
        return;
      }
      let submit_content={};
      submit_content.items = items;
      submit_content.address = req.body.address;
      submit_content.buyer = doc;
      submit_content.send_date = req.body.send_date;
      submit_content.send_time = req.body.send_time;
      Order.create(submit_content, function (error, suc) {
        if(error){
          return next(error);
        }
        email.transporter.sendMail(email.getOptaion(doc.username, 'order'),
          function(error, info){
          });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({});
      })
    })
  });
});

productRouter.get('/amount', (req, res, next) =>{
  let ids = req.query.ids;
  if(ids.length <= 0){
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.json({});
  }
  Product.find({
    '_id': { $in: ids}
  }, function(err, docs){
    if(err){
      return next(err);
    }
    let result = [];
    ids.forEach(function(key) {
      docs.forEach(function (doc) {
        if(key === doc._id.toString()){
          result.push(doc);
        }
      })
    });

    let result_amount = [];
    result.forEach(function (key) {
      result_amount.push(key.inventory);
    });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({amount:result_amount});

  });

});

productRouter.get('/order_history', authenticate.verifyUser, (req, res, next) =>{
  if(req.query.mode === 'simple'){
    Order.find({buyer: req.user._id}, function (error, docs) {
      if(error){
        return next(error);
      }
      let result = docs.map((item) => {
        let obj = {};
        obj.id = item._id;
        obj.date = item.createdAt.getTime();
        obj.status = item.status;
        let total_price = 0;
        for(let i = 0; i < item.items.length; i++)
          total_price += item.items[i].price * item.items[i].amount;
        obj.total_price = total_price.toFixed(2);
        return obj;
      });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(result);
    })
  }else if(req.query.mode === 'complex'){
    Order.findOne({buyer: req.user._id, _id:req.query.id}, function (error, docs) {
      if(error){
        return next(error);
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(docs);
    })
  }
});

module.exports = productRouter;