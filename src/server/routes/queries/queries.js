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

function getStudentInfo(id) {
  return Students().where('student_id', id)
}

function getTicketNum(studentId, eventId) {
  return Tickets().where({
    student_id: studentId,
    event_id: eventId,
  }).then(function(result) {
    return result.length;
  })
}


// This is going to be done in ajax,

function sellTicket(studentId, eventId) {
  return Students().where('id', studentId)
  .then(function(student) {
    return Tickets().insert({
      student_id:  student[0].id,
      event_id: eventId,
    })
    .then(function() {
      return Tickets().where({
        student_id: studentId,
        event_id: eventId,
      });
    });
  })
    .catch(function(error) {
      console.log(error);
    });
}

function ticketCount(params) {
  return Tickets().where(params).count('id');
}

function getGuests(params) {
  return Guests().where(params);
}

function addStudent(params) {
  return Students().insert(params);
}

function addGuest(params) {
  return Guests().insert(params).returning('id');
}

module.exports = {
  getAllEvents: getAllEvents,
  addEvent: addEvent,
  sellTicket: sellTicket,
  getStudentInfo: getStudentInfo,
  getTicketNum: getTicketNum,
  addGuest: addGuest,
  getGuests: getGuests,
  addStudent: addStudent,
  ticketCount: ticketCount,
};
