var express = require('express');
var serveStatic = require('serve-static');
var compression = require('compression');
var path = require('path');
var os = require('os');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var gql = require('./gqlquery'); //graphql扩展
var config = require('./config');

var index = require('./index');
var users = require('./users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false;
  }
  // fallback to standard filter function
  return true;//compression.filter(req, res);
}
app.use(compression({filter: shouldCompress}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
/*
app.use(function(req,res,next){
  if(req.url.match(/.*\.appcache$/)){
    res.header("MIME-Type", "text/cache-manifest");
  }
  next();
});
*/
//app.use(express.static(config.public));
app.use(serveStatic(config.public));

app.use('/', index);
app.use('/users', users);

gql(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
  res.send(err.toString());
});

module.exports = app;
