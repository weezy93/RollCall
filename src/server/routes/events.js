var express = require('express');
var router = express.Router();
var helpers = require('../lib/helpers');
var passport = require('../lib/auth');
var queries = require('./queries/queries');
var multer = require('multer');
var upload = multer({dest: 'src/client/images/'});


// Public facing
router.get('/:eventId', function(req, res, next) {
  var id = req.params.eventId;
  var params = {
    event_id: id,
  }

  queries.getTickets(params).then(function(tickets) {
    queries.getEventById(id).then(function(data) {
      data[0].description = data[0].description.split('\n').join('<br>')
        .split('\r').join('<br>')
      res.render('event', {
        user: req.user,
        event: data[0],
        tickets_bought: tickets.length,
        stylesheet: 'event.css',
      });
    });
  })
});

// Public facing - search student
router.get('/:eventId/sale_start', helpers.ensureAuthenticated,
function(req, res, next) {
  var messages = req.flash('message');
  var ticketsBought;
  var maxTickets;
  var ticketsRemaining;
  var params = {
    event_id: req.params.eventId,
  }
  var renderParams = {
    title: 'Sell Page',
    eventId: req.params.eventId,
    user: req.user,
    stylesheet: 'saleStart.css',
    messages: messages,
  }
  queries.getTickets(params)
  .then(function(tickets) {
    return tickets.length;
  })
  .then(function(length) {
    queries.getEventById(req.params.eventId)
    .then(function(event) {
      renderParams['ticketsRemaining'] = event[0].max_tickets - length;
      res.render('saleStart', renderParams);
    });
  });
});

router.get('/:eventId/redeem', helpers.ensureAuthenticated,
function(req, res, next) {
  var params = {
    eventId: req.params.eventId,
    script: 'redeem.js',
    stylesheet: 'redeem.css',
    user: req.user,
  }
  res.render('redeem.html', params)
})
// Student info and maybe sale
// Public facing
router.get('/:eventId/sales/', helpers.ensureAuthenticated,
function(req, res, next) {
  var studentId = req.query.studentId;
  var eventId = req.params.eventId;

  queries.getStudentInfo(studentId).then(function(student) {
    if (student.length) {
      res.render('saleEnd', {
        name: student[0].first_name + ' ' + student[0].last_name,
        eventId: eventId,
        studentId: student[0].id,
        script: 'saleEnd.js',
        stylesheet: 'saleEnd.css',
        count: 0,
        user: req.user,
      });
    } else {
      req.flash('message', {
        status: 'warning',
        value: 'That student doesn\'t exist',
      })
      res.redirect('/event/' + eventId + '/sale_start');
    }
  });
});

// Public facing
router.get('/:eventId/edit',
function(req, res, next) {
  queries.getEventById(req.params.eventId).then(function(data) {
    var params = {
      eventId: req.params.eventId,
      script: 'editEvent.js',
      stylesheet: 'editEvent.css',
      event: data[0],
      user: req.user,
    };
    res.render('editevent', params);
  });
});

// Ajax route
router.post('/:eventId/sales/:studentId', helpers.ensureAuthenticated,
function(req, res, next) {
  var eventId = req.body.event_id;
  var studentId = req.body.student_id;

  queries.sellTicket(studentId, eventId).then(function() {
    res.send();
  });
});

// Ajax route
router.get('/:eventId/sales/:studentId/ticket_count',
helpers.ensureAuthenticated,
function(req, res, next) {
  var params = {
    student_id: req.params.studentId,
    event_id: req.params.eventId,
  };

  queries.getTickets(params).then(function(tickets) {
    res.send(tickets);
  })
  .catch(function(err) {
    console.log(err);
  })
});

router.delete('/deleteTicket/:studentId/:ticketNumber', function(req, res, next) {
  queries.deleteTicket(req.params.studentId, req.params.ticketNumber)
  .then(function() {
    res.json({success: 'Ticket deleted'});
  })
  .catch(function(err) {
    res.json({error: 'Error: ' + err});
  })
});

// Ajax route
router.post('/:eventId/sales/:studentId/addguest', helpers.ensureAuthenticated,
function(req, res, next) {
  queries.addGuest(req.body)
  .then(function(guestId) {
    res.json({success: 'Added guest #' + guestId});
  })
  .catch(function(err) {
    res.json({error: err});
  });
});

// Ajax route
router.get('/:eventId/sales/:studentId/getguests', helpers.ensureAuthenticated,
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
  });
});

// Ajax route
router.get('/:eventId/getstudents',helpers.ensureAuthenticated,
function(req, res, next) {
  var searchFor = {
    eventId: req.params.eventId,
  };
  if (req.query.matcher) {
    searchFor['matcher'] = req.query.matcher;
  }
  queries.getStudentsByEvent(searchFor)
  .then(function(results) {
    res.json(results);
  });
});

router.put('/:eventId/delete', function(req, res, next) {
  var id = req.params.eventId;
  var user = req.user;
  queries.deleteEvent(id).then(function(data) {
    res.end();
  });
});

// Ajax route
router.post('/:eventId/edit', helpers.ensureAdmin, upload.single('picture'),
function(req, res, next) {
  delete req.body.picture;
  if (req.file) {
    req.body['image_url'] = req.file.path.substring(10)
  }
  queries.editEvent(req.body, req.params.eventId)
  .then(function(data) {
    res.redirect('/event/' + req.params.eventId);
  });
});

// Ajax
router.post('/:eventId/guest/:id/edit', helpers.ensureAdmin,
function(req, res, next) {
  var id = req.params.id;
  queries.editGuest(req.body, id).then(function(data) {
    res.send('success');
  });
});

// Ajax
router.get('/:eventId/guest/:id', helpers.ensureAuthenticated,
function(req, res, next) {
  var id = req.params.id;
  queries.getGuests({id: id}).then(function(data) {
    res.json(data);
  });
});

router.put('/:eventId/redeem/:ticketNumber/', helpers.ensureAuthenticated,
function(req, res, next) {
  queries.redeemTicket(req.params.ticketNumber)
  .then(function() {
    res.json({success: 'yay!'})
  })
  .catch(function(err) {
    res.json({error: err});
  })
})

module.exports = router;
