const express = require('express');
const bodyParser = require("body-parser");
const Product = require('../models/Product');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const global = require('../global_var');

const publicRouter = express.Router();

publicRouter.use(bodyParser.json());

publicRouter.get('/for_index', function(req,res,next){
  fs.readdir(global.workdir + '/publicfiles/files/index', (err, files) => {
    console.log(files);
    if(err){
      return next(err);
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/text');
    res.header('Access-Control-Allow-Origin', '*');
    res.jsonp(files);
  })
});
module.exports = publicRouter;