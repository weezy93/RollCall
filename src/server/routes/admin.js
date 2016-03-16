var express = require('express');
var router = express.Router();
var helpers = require('../lib/helpers');
var passport = require('../lib/auth');
var queries = require('./queries/queries');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var studentCsv = require('./studentCsv.js');


router.get('/:schoolId/addstudents', helpers.ensureAdmin, function(req, res) {
  res.render('addStudents', {
    title: 'I love files!',
    schoolId: req.params.schoolId,
  });
});

router.post('/:schoolId/addstudent', helpers.ensureAdmin, function(req, res) {
  queries.addStudent(req.body)
  .then(function() {
    res.redirect('/' + req.params.schoolId);
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

router.get('/teacher/add', helpers.ensureAdmin,
function(req, res, next) {
  var message = req.flash('message') || '';
  res.render('addTeacher', {title: 'Add Teacher', messages: message});
});

router.post('/teacher/add', helpers.ensureAdmin,
function(req, res, next) {
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

module.exports = router;
