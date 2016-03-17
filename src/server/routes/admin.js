var express = require('express');
var router = express.Router();
var helpers = require('../lib/helpers');
var passport = require('../lib/auth');
var queries = require('./queries/queries');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var studentCsv = require('./studentCsv.js');


router.get('/:schoolId/addstudents', helpers.ensureAdmin, function(req, res) {
  var messages = req.flash('message');
  res.render('addStudents', {
    title: 'Upload Students',
    schoolId: req.params.schoolId,
    user: req.user,
    messages: messages,
  });
});

router.post('/:schoolId/addstudent', helpers.ensureAdmin, function(req, res) {
  queries.addStudent(req.body)
  .then(function(data) {
    req.flash('message', {
      status: 'success',
      value: 'Student added successfully'
    });
    res.redirect('/admin/' + req.params.schoolId + '/addstudents');
  });
});

router.post('/:schoolId/addstudents', helpers.ensureAdmin, upload.single('csv'),
  function(req, res, next) {
  studentCsv.uploadStudentCsv(req, res, next);
});

router.post('/:schoolId/addstudents/parse', helpers.ensureAdmin,
function(req, res, next) {
  studentCsv.studentCsvParser(req, res, next);
});

router.get('/:schoolId/addteachers', helpers.ensureAdmin,
function(req, res, next) {
  var message = req.flash('message') || '';
  res.render('addTeacher', {title: 'Add Teacher', user: req.user, messages: message});
});

router.post('/:schoolId/addteachers', helpers.ensureAdmin,
function(req, res, next) {
  queries.addTeacher(req.body, req.params.schoolId)
  .then (function() {
    console.log('success');
    req.flash('message', {
      status: 'success',
      value: 'Successfully Registered.',
    });
    res.redirect('/admin/' + req.user.school_id + '/addteachers');
  })
  .catch(function(err) {
    if (err) {
      console.log('failure');
      console.log(err);
      req.flash('message', {
        status: 'danger',
        value: 'Email already exists.  Please try again.',
      });
      res.redirect('/admin/' + req.user.school_id + '/addteachers');
    }
  });
});

router.get('/:schoolId/addevents', helpers.ensureAdmin, function(req, res, next) {
  var messages = req.flash('message');
  var user = req.user;
  res.render('addEvent', {messages: messages, user: user});
});

router.post('/:schoolId/addevents', helpers.ensureAdmin, function(req, res, next) {
  queries.addEvent(req.body, req.params.schoolId)
  .then(function(data) {
    req.flash('message', {
      status: 'success',
      value: 'Event successfully added.',
    });
    res.redirect('/' + req.user.school_id);
  });
});

module.exports = router;
