var knex = require('../../db/knex');

function Events() {
  return knex('events');
}

function Tickets() {
  return knex('tickets');
}

function getAllEvents(req, res) {
  // query for school name?
  Events().select().then(function (result) {
    res.render('index', { title: 'Events', events: result });
  })
  .catch(function (error) {
    console.log(error);
  });
}

function addEvent(req, res) {
  return Events().insert({
    name: req.body.event_name,
    event_date: req.body.event_date,
    // school_id:
    description: req.body.description,
    address: req.body.event_address,
    city_state_zip: req.body.city_state_zip
  })
  .catch(function (error) {
    console.log(error);
  });
}

// doesn't work

function sellTicket(req, res) {
  return Tickets().insert({ student_id: req.body.studentId })
  .then(function () {
    return Tickets().count('id')
    .then(function (count) {
      return count[0];
    });
  })
  .catch(function (error) {
    console.log(error);
  });
}

module.exports = {
  getAllEvents: getAllEvents,
  addEvent: addEvent,
  sellTicket: sellTicket
};
