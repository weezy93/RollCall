var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var util = require('util');
var fs = require('fs');


router.get('/', function(req, res) {
  res.render('throwawayform', {title: 'I love files!'});
})

router.post('/upload', upload.single('csv'), function(req, res, next) {
  if (req.file) {
    fs.exists(req.file.path, function(exists) {
      if (exists) {
        res.end('Got your file ' + req.file.path);
      } else {
        res.end('Well, thereis no magic for those who don\'t believe in it')
      }
    });
  } else {
    res.send('no file, what the fuck?');
  }
});

module.exports = router;
