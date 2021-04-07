var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');
//var cors = require('cors');

var indexRouter = require('./routes/index');
var accountRouter = require('./routes/account');
var postsRouter = require('./routes/posts');
var profileRouter = require('./routes/profile');
var sellerRouter = require('./routes/');

/*
var storage = multer.diskStorage({
  destination: function(req,file,callback){
    callback(null,'uploads');
  },
  filename: function(req,file,callback){
    callback(null,file.originalname+Date.now)
  }
});
var upload = multer({
  storage: storage,
  limits:{
    files: 10,
    fileSize: 1024*1024*1024,
  }
});
*/
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(cors());
//app.use(multer());


app.use('/', indexRouter);
app.use('/account', accountRouter);
app.use('/post', postsRouter);
app.use('/profile', profileRouter);
app.use('/seller',sellerRouter);

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
