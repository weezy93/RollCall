var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var helpers = require('../lib/helpers');
var passport = require('../lib/auth');
var queries = require('./queries/queries');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var studentCsv = require('./studentCsv.js');


function Teachers() {
  return knex('teachers');
}

router.get('/logout', function(req, res, next) {
  var redirect = req.query.redirect;
  console.log('redirect: ', redirect);
  req.logout();
  req.flash('message', {status: 'success', value: 'Successfully logged out.'});
  res.redirect(redirect);
});

// Up to the school if they display the events
router.get('/:school_id', function(req, res, next) {
  var user = req.user;
  var school_id = req.params.school_id;
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

router.get('/event/:eventId/sales', function(req, res, next) {
  res.render('saleStart', {
    title: 'Sell Page',
    eventId: req.params.eventId,
  });
});

router.post('/event/:eventId/sales', function(req, res, next) {
  queries.sellTicket(req, res).then(function(ticketNum) {

    res.render('saleEnd', {
      title: 'Ticket Sold',
      tickets: ticketNum,
      script: 'saleEnd.js',
      stylesheet: 'saleEnd.css',
    });
  });
});

router.post('/event/:eventId/sales/:studentId/addguest',
function(req, res, next) {
  queries.addGuest(req.body)
  .then(function(guestId) {
    res.json({success: 'Added guest #' + guestId});
  })
  .catch(function(err) {
    res.json({error: err});
  });
});

router.get('/event/:eventId/sales/:studentId/getguests', function(req, res, next) {
  var params = {
    student_id: req.params.studentId,
    event_id: req.params.eventId,
  };
  queries.getGuests(params)
  .then(function(guests) {
    res.json(guests);
  })
  .catch(function(err) {
    res.json({error: err});
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
//
// router.get('/addStudent', function(req, res, next) {
//   res.render('addStudent', { title: 'Add Student(s)' });
// });
//
// router.get('/addEvent', function(req, res, next) {
//   res.render('addEvent', { title: 'Create Event' });
// });
//
// router.post('/addEvent', function(req, res, next) {
//   queries.addEvent(req, res).then(function(result) {
//     res.redirect('/');
//   });
// });

// router.get('/teacher/add', function (req, res, next) {
//   res.render('addTeacher', {title: 'Add Teacher'});
// });
//
// router.post('/teacher/add', function (req, res, next) {
//   res.json(req.body);
// });


router.get('/teacher/add', helpers.loginRedirect, function(req, res, next) {
  var message = req.flash('message') || '';
  res.render('addTeacher', {title: 'Add Teacher', messages: message});
});

router.post('/teacher/add', function(req, res, next) {
  var email_address = req.body.email;
  var password = req.body.password;
  Teachers().where('email_address', req.body.email).then(function(data) {
    if (data.length) {
      req.flash('message', {
        status: 'danger',
        value: 'Email already exists.  Please try again.',
      });
      res.redirect('/teacher/add');
    } else {
      // Hash and salt the password
      var hashedPassword = helpers.hashing(password);
      Teachers().insert({
        email_address: email_address,
        password: hashedPassword,
      }).then(function() {
        req.flash('message', {
          status: 'success',
          value: 'Successfully Registered.',
        });
        res.redirect('/');
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
      return res.redirect('/'+user.school_id);
    });
  })(req, res, next);
});




module.exports = router;
