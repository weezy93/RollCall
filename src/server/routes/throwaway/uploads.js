var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var util = require('util');
var fs = require('fs');


router.get('/', function(req, res) {
  res.render('throwawayform', {title: 'I love files!'});
})
router.post('/parsed', function(req, res) {
  res.json(req.file);
})

router.post('/upload', upload.single('csv'), function(req, res, next) {
  if (req.file) {
    fs.exists(req.file.path, function(exists) {
      if (exists) {
        fs.readFile(req.file.path, 'utf8', (err, data) => {
          var returnData = [];
          var columns = [];
          var first = true;
          var lines = data.split('\n');
          var previewLinesCount = Math.min(10, lines.length);
          for (var i = 0; i < previewLinesCount; i++) {
            var splitLine = lines[i].split(',');
            console.log(splitLine);
            if (first) {
              for (var j = 0; j < splitLine.length; j++) {
                columns.push(j);
              }
              first = false;
            }
            returnData.push(splitLine);
          }
          var params = {
            columns: columns,
            lines: returnData,
          }
          res.render('uploadparsing', params);
        });
      } else {
        res.end('Well, thereis no magic for those who don\'t believe in it')
      }
    });
  } else {
    res.send('no file, what the fuck?');
  }
});

module.exports = router;
