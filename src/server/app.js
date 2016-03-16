// *** Main dependencies *** //
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var session = require('express-session');
var passport = require('./lib/auth');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');



// *** Routes *** //
var routes = require('./routes/index.js');
var admin = require('./routes/admin.js');
var event = require('./routes/events.js');
var school = require('./routes/schools.js');

// *** Express instance *** //
var app = express();


// *** View engine *** //
var swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');


// *** Static directory *** //
app.set('views', path.join(__dirname, 'views'));


// *** Config middleware *** //
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SECRET_KEY || 'secret_awesome_group',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '../client')));


// *** Main routes *** //
app.use('/', routes);
app.use('/event', event);
app.use('/school', school);
app.use('/admin', admin);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// *** Error handlers *** //

// Development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// Production error handler
// No stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});


module.exports = app;
