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

function sellTicket(req, res) {
  Tickets().insert({
    student_id: req.body.studentId,

    // event_id: ,
  })
  .then(function () {
    Tickets().count('id')
    .then(function (count) {
      res.render('saleEnd', { title: 'Ticket sold', ticket:  count[0] });
    });
  })
  .catch(function (error) {

  });
}

module.exports = {
  getAllEvents: getAllEvents,
  sellTicket: sellTicket
};
