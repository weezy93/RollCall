var knex = require('../../db/knex');
function Events() {
  return knex('events');
}

function getAllEvents(req, res) {
  // query for school name?
  Events().select().then(function (result) {
    console.log(result);
    res.render('index', { title: 'Events', events: result });
  })
  .catch(function (error) {
    console.log(error);
  });
}

module.exports = {
  getAllEvents: getAllEvents
};
