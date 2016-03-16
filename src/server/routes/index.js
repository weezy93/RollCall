var express = require('express');
var router = express.Router();
var helpers = require('../lib/helpers');
var passport = require('../lib/auth');
var queries = require('./queries/queries');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var studentCsv = require('./studentCsv.js');

router.get('/logout', function(req, res, next) {
  var redirect = req.query.redirect;
  console.log('redirect: ', redirect);
  req.logout();
  req.flash('message', {status: 'success', value: 'Successfully logged out.'});
  res.redirect(redirect);
});

// Up to the school if they display the events
router.get('/:schoolId', function(req, res, next) {
  var user = req.user;
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

router.post('/guests/:id/edit', function(req, res, next) {
  var id = req.params.id;
  queries.editGuest(req.body, id).then(function(data) {
    console.log(data);
    res.send('success');
  });
});

router.get('/guest/:id', function(req, res, next) {
  var id = req.params.id;
  queries.getGuests({id: id}).then(function(data) {
    res.json(data);
  });
});

router.get('/:schoolId/addstudents', function(req, res) {
  res.render('addStudents', {
    title: 'I love files!',
    schoolId: req.params.schoolId,
  });
});

router.post('/:schoolId/addstudent', function(req, res) {
  queries.addStudent(req.body)
  .then(function() {
    res.redirect('/' + req.params.schoolId);
  });
});

router.post('/:schoolId/addstudents', upload.single('csv'),
  function(req, res, next) {
  studentCsv.uploadStudentCsv(req, res, next);
});
router.post('/:schoolId/addstudents/parse', function(req, res, next) {
  studentCsv.studentCsvParser(req, res, next);
});

router.get('/teacher/add', helpers.loginRedirect, function(req, res, next) {
  var message = req.flash('message') || '';
  res.render('addTeacher', {title: 'Add Teacher', messages: message});
});

router.post('/teacher/add', helpers.ensureAdmin, function(req, res, next) {
  queries.addTeacher(req.body, req.user.school_id)
  .then (function() {
    req.flash('message', {
      status: 'success',
      value: 'Successfully Registered.',
    });
    res.redirect('/' + req.user.school_id + '/admin');
  })
  .catch(function(err) {
    if (err) {
      req.flash('message', {
        status: 'danger',
        value: 'Email already exists.  Please try again.',
      });
    }
  });
});


router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user) {
    if (err) {
      return next(err);
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      req.flash('message', {
        status: 'success',
        value: 'Welcome ' + user.first_name,
      });
      return res.redirect('/' + user.school_id);
    });
  })(req, res, next);
});




module.exports = router;
