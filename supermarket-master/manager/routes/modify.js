const express = require('express');
const bodyParser = require("body-parser");
const Product = require('../models/Product');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const global = require('../global_var');

const modifyRouter = express.Router();

modifyRouter.use(bodyParser.json());

modifyRouter.post('/normal', function(req,res,next){
  let all_info = req.body;
  for(let key in all_info){
    all_info = key;
  }
  all_info = JSON.parse(all_info);
  if(all_info.inventory === 0){
    delete all_info.inventory;
  }
  if(all_info.id){
    Product.findById(all_info.id, function (error, doc) {
      if(error){
        next(error);
        return;
      }
      doc.set(all_info);
      doc.save(function (err, updateduser) {
        if (err) {
          next(err);
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({id: doc._id});
      });
    })
  }else{
    Product.create(all_info, function (error, doc) {
      if(error){
        next(error);
        return;
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({id: doc._id})
    });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, global.workdir + '/publicfiles/files/pics');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const storage1 = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, global.workdir + '/publicfiles/files/index');
  },
  filename: function (req, file, cb) {
    fs.readdir(global.workdir + '/publicfiles/files/index', (err, files) => {
      if(err){
        cb(1,null);
        return;
      }
      if(files.length === 3){
        for (const file of files) {
          fs.unlinkSync(path.join(global.workdir + '/publicfiles/files/index', file));
        }
        cb(null, file.originalname);
      }
      cb(null, file.originalname);
    });

  }
});

const cvFileFilter = (req, file, cb) => {
  if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
    return cb(new Error('You can upload only pic file!'), false);
  }
  cb(null, true);
};

const upload = multer({storage: storage, fileFilter: cvFileFilter});
const upload1 = multer({storage: storage1, fileFilter: cvFileFilter});

modifyRouter.route('/pic_index')
  .post(upload1.array('pic'), function (req, res, next) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({"state" : "successful"});
  });

modifyRouter.route('/pic')
  .post(upload.single('pic'), function (req, res, next) {
    let id = req.query.id;
    Product.findById(id, function(err, doc){
      if(err){
        next(err);
        return;
      }
      if(doc){
        let oldpath = doc.pic_path;
        if(oldpath && fs.existsSync(oldpath)){
          fs.unlinkSync(oldpath);
        }
        doc.set({"pic_path" : req.file.path});
        doc.save(function (err, updateduser) {
          if (err) {
            next(err);
            return;
          }
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({"state" : "successful"});
        });
      }
    });

  });

modifyRouter.delete('/delete', function(req,res,next){
  let id = req.query.id;
  Product.remove({_id: id}, function (err) {
    if (err) return next(err);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/text');
    res.json({status:true});
  });
});

modifyRouter.get('/for_index', function(req,res,next){
  fs.readdir(global.workdir  + '/manager/publicfiles/files/index', (err, files) => {
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

module.exports = modifyRouter;