var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/sales', function(req, res, next) {
  res.render('saleStart', { title: 'Sell Page' });
});

router.get('/addStudent', function(req, res, next) {
  res.render('addStudent', { title: 'Add Student(s)' });
});

router.get('/addEvent', function(req, res, next) {
  res.render('addEvent', { title: 'Create Event' });
});



module.exports = router;
