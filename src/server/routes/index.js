var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var helpers = require('../lib/helpers');
var passport = require('../lib/auth');
var queries = require('./queries/queries');

function Teachers() {
  return knex('teachers');
}


router.get('/', function(req, res, next) {
  var user = req.user;
  var messages = req.flash('message');
  queries.getAllEvents()
  .then(function(result) {
    console.log(result);
    console.log(messages);
    var params = {
      title: 'Express',
      user: user,
      messages: messages,
      events: result,
    }
    res.render('index', params);
  })
});

router.get('/sales', function (req, res, next) {
  res.render('saleStart', { title: 'Sell Page' });
});

router.post('/sales', function (req, res, next) {
  queries.sellTicket(req, res).then(function (ticketNum) {
    console.log(ticketNum);
    res.render('saleEnd', { title: 'Ticket Sold', tickets: ticketNum, max: eventquery });
  });
});

router.get('/addStudent', function (req, res, next) {
  res.render('addStudent', { title: 'Add Student(s)' });
});

router.get('/addEvent', function (req, res, next) {
  res.render('addEvent', { title: 'Create Event' });
});

router.post('/addEvent', function (req, res, next) {
  queries.addEvent(req, res).then(function (result) {
    res.redirect('/');
  });
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
  var email_address = req.body.email;
  var password = req.body.password;
  Teachers().where('email_address', req.body.email).then(function( data) {
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
            email_address: email_address,
            password: hashedPassword
        }).then(function() {
            req.flash('message', {status: 'success', value: 'Successfully Registered.'});
            res.redirect('/');
        });
      }
    });
});


router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user) {
    if (err) {
      return next(err);
    } else {
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        req.flash('message', {status: 'success', value: 'Welcome '+ user.first_name});
        return res.redirect('/');
      });
    }
  })(req, res, next);
});

router.get('/logout', function(req, res, next) {
  req.logout();
  req.flash('message', {status: 'success', value:'Successfully logged out.'});
  res.redirect('/');
});


module.exports = router;
