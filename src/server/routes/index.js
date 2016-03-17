var express = require('express');
var router = express.Router();
var helpers = require('../lib/helpers');
var passport = require('../lib/auth');
var queries = require('./queries/queries');

router.get('/logout', function(req, res, next) {
  var redirect = req.query.redirect;
  console.log('redirect: ', redirect);
  req.logout();
  req.flash('message', {status: 'success', value: 'Successfully logged out.'});
  res.redirect(redirect);
});

router.get('/login', function(req, res, next) {
  var messages = req.flash('message');
  res.render('login', {messages: messages});
});

// Up to the school if they display the events
router.get('/:schoolId', function(req, res, next) {
  var user = req.user;
  req.flash('school_id', req.params.schoolId);
  var school_id = req.params.schoolId;
  var messages = req.flash('message');
  queries.getAllEvents(school_id)
  .then(function(result) {
    var params = {
      title: 'Littleton High School',
      user: user,
      school_id: school_id,
      messages: messages,
      image: 'http://pics4.city-data.com/cpicc/cfiles1318.jpg',
      events: result,
    };
    res.render('index', params);
  });
});


router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user) {
    var school_id = req.flash('school_id')[0];
    if (err) {
      req.flash('message', {
        status: 'danger',
        value: 'Email or Password is incorrect.  Please try again.',
      });
      return res.redirect('/' + school_id);
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      req.flash('message', {
        status: 'success',
        value: 'Welcome ' + user.first_name,
      });
      if (req.user) {
        return res.redirect('/' + req.user.school_id);
      }
      if (school_id) {
        return res.redirect('/' + school_id);
      }
      return res.send('You broke this so bad!');
    });
  })(req, res, next);
});

module.exports = router;
