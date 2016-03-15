var knex = require('../../db/knex');

function Events() {
  return knex('events');
}

function Tickets() {
  return knex('tickets');
}

function Students() {
  return knex('students');
}

function Guests() {
  return knex('guests');
}

function getAllEvents() {
  // Query for school name?
  return Events().select()
  .catch(function(error) {
    console.log(error);
  });
}

function addGuest(params) {
  return Guests().insert(params).returning('id');
}


function addEvent(req, res) {
  return Events().insert({
    name: req.body.event_name,
    event_date: req.body.event_date,
    // School_id:
    description: req.body.description,
    address: req.body.event_address,
    city_state_zip: req.body.city_state_zip,
  })
  .catch(function(error) {
    console.log(error);
  });
}


// Need to query event table for max tickets, need event id somehow

function sellTicket(req, res) {
  return Students().where('student_id', req.body.studentId).select()
  .then(function(student) {
    return Tickets().insert({ student_id:  student[0].id })
    .then(function() {
      return Tickets().count('id')
      .then(function(count) {
        console.log(count);
        return count[0].count;
      });
    });
  })
    .catch(function(error) {
      console.log(error);
    });
}
function getGuests(params) {
  return Guests().where(params);
}
function addStudent(params) {
  return Students().insert(params);
}

module.exports = {
  getAllEvents: getAllEvents,
  addEvent: addEvent,
  sellTicket: sellTicket,
  addGuest: addGuest,
  getGuests: getGuests,
  addStudent: addStudent,
};
