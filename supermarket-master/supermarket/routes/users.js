const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/User');
const passport = require('passport');
const authenticate = require('../authenticate');
const email = require('../config_email');

const router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function (req, res, next){
  User.register(new User({username: req.body.username, firstname:req.body.firstname,
    lastname: req.body.lastname, phone: req.body.phone}),
    req.body.password, (err, user) => {
      if(err){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err:err});
      }else{
        passport.authenticate('local')(req, res, () =>{
          email.transporter.sendMail(email.getOptaion(req.body.username, 'signup'),
            function(error, info){
          });
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success : true, status: 'Registration Successful'});
        });
      }
    })
});

router.post('/login', passport.authenticate('local'), function (req, res, next) {
  let token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success : true, token:token, status: 'You are successfully logged in'});
});

router.post('/validate', authenticate.verifyUser, function (req, res, next) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(req.user);
});

router.post('/add_address', authenticate.verifyUser, function (req, res, next) {
  User.findById(req.user._id, function (err, doc){
    if(err){
      return next(err);
    }
    if(!doc || doc.length === 0){
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end();
      return;
    }
    doc.address.push(req.body);
    doc.save(function (error, doc) {
      if(error){
        return next(error);
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({});
    });
  });
});

router.get('/get_address', authenticate.verifyUser, function (req, res, next) {
  User.findById(req.user._id, function (err, doc){
    if(err){
      return next(err);
    }
    if(!doc){
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end();
      return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(doc.address);
  });
});

router.get('/delete_address', authenticate.verifyUser, function (req, res, next) {
  User.findById(req.user._id, function (err, doc){
    if(err){
      return next(err);
    }
    if(!doc){
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end();
      return;
    }
    doc.address.pull({ _id: req.query.id});
    doc.save(function (error , aa) {
      if(error)
        return next(error);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({status:true});
    });
  });
});

router.post('/change_password',authenticate.verifyUser, function (req, res, next) {
  User.findById(req.user._id, function (err, doc){
    if(err){
      return next(err);
    }
    if(!doc){
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end();
      return;
    }
    doc.setPassword(req.body.password, function (error, newpass) {
      if(error) {
        return next(error);
      }
      newpass.save(function (error, aa) {
        if(error){
          return next(error);
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({});
      });

    });
  });
});

router.get('/logout', authenticate.verifyUser, function (req, res, next) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({});
});

router.get('/retrieve', function (req, res, next) {
  let username = req.query.username;
  User.findOne({username: username}, function (error, doc) {
    if(error){
      return next(error);
    }
    if(!doc){
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end();
      return;
    }
    let random_string = makeid();
    doc.retrieve = random_string;
    doc.save(function (error, su) {
      if (error) {
        return next(error);
      }
      email.transporter.sendMail(email.getOptaion(username, 'back', random_string),
        function (error, info) {
          if (error) {
            res.statusCode = 304;
            res.setHeader('Content-Type', 'application/json');
            res.json({status: false});
          } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({});
          }
        });
    })
  })
});

router.post('/retrieve', function (req, res, next) {
  let username = req.query.username;
  let back_string = req.query.back_string;
  User.findOne({username: username}, function (error, doc) {
    if(error){
      return next(error);
    }
    if(!doc){
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end();
      return;
    }
    if(back_string === doc.retrieve){
      doc.setPassword(req.body.password, function (error, newpass) {
        if(error) {
          return next(error);
        }
        newpass.save(function (error, aa) {
          if(error){
            return next(error);
          }
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({});
        });

      });
    }else{
      res.statusCode = 304;
      res.setHeader('Content-Type', 'application/json');
      res.json({status: false});
    }
  })
});



module.exports = router;

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 80; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}