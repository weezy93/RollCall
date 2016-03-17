var express = require('express');
var router = express.Router();
var fs = require('fs');
var knex = require('../db/knex.js');
var Students = function() {
  return knex('students');
}

function studentCsvParser(req, res, next) {
  var schoolId = Number(req.params.schoolId);
  var uploadedPath = req.flash('uploadedFile')[0];
  var insertArray = [];
  var formKeys = Object.keys(req.body);
  var firstNameColumn = -1;
  var middleNameColumn = -1;
  var lastNameColumn = -1;
  var studentIdNameColumn = -1;
  var gradeColumn = -1;
  for (var key in formKeys) {;
    if (!isNaN(key)) {
      switch (req.body[key]) {
        case 'firstname': {
          firstNameColumn = Number(key);
          break;
        }
        case 'middlename': {
          middleNameColumn = Number(key);
          break;
        }
        case 'lastname': {
          lastNameColumn = Number(key);
          break;
        }
        case 'studentid': {
          studentIdNameColumn = Number(key);
          break;
        }
        case 'grade': {
          gradeColumn = Number(key);
          break;
        }
        default: {
          break;
        }
      }
    }
  }
  fs.readFile(uploadedPath, 'utf8', (err, data) => {
    var arrayOfRows = [];
    var lines = data.split('\n');
    var start = 0;
    if (req.body.ignoreHeaders == 'true') {
      start = 1;
    }
    for (var i = start; i < lines.length; i++) {
      if (lines[i] !== '') {
        var splitLine = lines[i].split(',');
        var tempObject = {
          student_id: splitLine[studentIdNameColumn],
          first_name: splitLine[firstNameColumn],
          middle_name: splitLine[middleNameColumn],
          last_name: splitLine[lastNameColumn],
          grade: splitLine[gradeColumn],
          school_id: schoolId,
        }
        arrayOfRows.push(tempObject);
      }
    }
    // Stupid name for delete!
    fs.unlink(uploadedPath, (err) => {
      if (err) {
        console.log('Couldn\'t delete file ' + err);
      }
    })
    knex.batchInsert('students', arrayOfRows, 1000)
    .then(function() {
      req.flash('message', {
        status: 'success',
        value: 'Students uploaded successfully.'
      });
      res.redirect('/');
    })
    .catch(function(err) {
      res.send('Something went wrong! ' + err);
    })
  });
}

function uploadStudentCsv(req, res, next) {
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
            user: req.user,
            schoolId: req.params.schoolId,
          }
          req.flash('uploadedFile', req.file.path);
          res.render('uploadparsing', params);
        });
      } else {
        res.end('Well, thereis no magic for those who don\'t believe in it')
      }
    });
  } else {
    res.send('no file, what the fuck?');
  }
};

module.exports = {
  uploadStudentCsv: uploadStudentCsv,
  studentCsvParser: studentCsvParser,
};
