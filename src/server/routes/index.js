var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var helpers = require('../lib/helpers');
var queries = require('./queries/queries');

router.get('/', function (req, res, next) {
  queries.getAllEvents(req, res);
});

router.get('/sales', function (req, res, next) {
  res.render('saleStart', { title: 'Sell Page' });
});

router.post('/sales', function (req, res, next) {
  queries.sellTicket(req, res);
});

router.get('/addStudent', function (req, res, next) {
  res.render('addStudent', { title: 'Add Student(s)' });
});

router.get('/addEvent', function (req, res, next) {
  res.render('addEvent', { title: 'Create Event' });
});

// router.get('/teacher/add', function (req, res, next) {
//   res.render('addTeacher', {title: 'Add Teacher'});
// });
//
// router.post('/teacher/add', function (req, res, next) {
//   res.json(req.body);
// });

router.get('/teacher/add', helpers.loginRedirect, function (req, res, next) {
  var message = req.flash('message') || '';
  res.render('addTeacher', {title: 'Add Teacher', messages: message});
});

router.post('/teacher/add', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  Teachers().where('email', req.body.username).then(function( data) {
    if (data.length) {
      req.flash('message', {
        status: 'danger',
        value: 'Email already exists.  Please try again.'
      });
      res.redirect('/teacher/add');
    } else {
      // hash and salt the password
      var hashedPassword = helpers.hashing(password);
      Teachers().insert({
          email: username,
          password: hashedPassword
      }).then(function() {
          req.flash('message', {status: 'success', value: 'Successfully Registered.'});
          res.redirect('/');
      });
      }
    });
});


module.exports = router;
