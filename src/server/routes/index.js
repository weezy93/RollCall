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

// Up to the school if they display the events
router.get('/:schoolId', function(req, res, next) {
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

router.get('/event/:eventId/sale_start', function(req, res, next) {
  res.render('saleStart', {
    title: 'Sell Page',
    eventId: req.params.eventId,
    event_max_tix: '?', // Query event.max_tix
  });
});

// router.post('/event/:eventId/sales', function(req, res, next) {
//   // queries.sellTicket(req, res).then(function(ticketNum) {
//   //   console.log(ticketNum);
//     res.render('saleEnd', {
//       title: 'Ticket Sold',
//       tickets: ticketNum,
//       script: 'saleEnd.js',
//       stylesheet: 'saleEnd.css',
//     });
//   // });
// });

// This works
router.get('/event/:eventId/sales/',
function(req, res, next) {
  var studentId = req.query.studentId
  var eventId = req.params.eventId;

  queries.getStudentInfo(studentId).then(function(student) {
      res.render('saleEnd', {
        name: student[0].first_name + ' ' + student[0].last_name,
        eventId: eventId,
        studentId: student[0].id,
        script: 'saleEnd.js',
        stylesheet: 'saleEnd.css',
      });
    });
});

router.post('/event/:eventId/sales/:studentId',
function(req, res, next) {
  var eventId = req.body.event_id;
  var studentId = req.body.student_id;

  queries.sellTicket(studentId, eventId).then(function() {
    res.send('success');
  });
});

router.get('/event/:eventId/sales/:studentId/ticket_count',
function(req, res, next) {
  var params = {
    student_id: req.params.studentId,
    event_id: req.params.eventId,
  }
  queries.ticketCount(params).then(function(count) {
    res.send(count[0].count);
  })
})

router.post('/event/:eventId/sales/:studentId/addguest',
function(req, res, next) {
  queries.addGuest(req.body)
  .then(function(guestId) {
    res.json({success: 'Added guest #' + guestId})
  })
  .catch(function(err) {
    res.json({error: err});
  })
});

router.get('/event/:eventId/sales/:studentId/getguests',
function(req, res, next) {
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
  })
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
})
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
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/logout', function(req, res, next) {
  req.logout();
  req.flash('message', {status: 'success', value: 'Successfully logged out.'});
  res.redirect('/');
});


module.exports = router;
