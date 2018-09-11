const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const favicon = require('serve-favicon');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let modifyRouter = require('./routes/modify');
let showRouter = require('./routes/show');
let publicRouter = require('./routes/forpublic');

let app = express();

// connect mongodb ---------------------------------------------------------------
const config = require('./config');
const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then(()=>{
  console.log('Connected correctly to mongodb');
}, (err) => {console.log(err);});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//basic authentication
function auth(req, res, next){
  let authHeader = req.headers.authorization;
  if(!authHeader){
    let err = new Error('You are not authenticated');
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    return next(err);
  }

  let auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
  let username = auth[0];
  let password = auth[1];
  if(username === 'aihua' && password === 'daijunchengzhenshuai'){
    next();
  }else{
    let err = new Error('You are not authenticated');
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    return next(err);
  }
}

app.use(express.static(path.join(__dirname, 'publicfiles')));
app.use('/forpublic', publicRouter);

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/modify', modifyRouter);
app.use('/show',showRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
