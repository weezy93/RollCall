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

function getAllEvents(school_id) {
  // Query for school name?
  return Events().select().where('school_id', school_id)
  .catch(function(error) {
    console.log(error);
  });
}

function addGuest(params) {
  return Guests().insert(params).returning('id');
}

function getStudentsByEvent(searchFor) {
  var queryString =
  'select '
  + 'students.id, '
  + 'students.student_id, '
  + 'students.first_name, '
  + 'students.middle_name, '
  + 'students.last_name, '
  + 'students.grade, '
  + 'tickets.id as ticket_number, '
  + 'tickets.sold_timestamp, '
  + 'tickets.redeemed_on '
  + 'from students '
  + 'inner join tickets on tickets.student_id = students.id '
  + 'inner join events on tickets.event_id = events.id '
  + 'where events.id = ' + searchFor.eventId;
  if (searchFor.matcher) {
    queryString +=
    ' AND (students.student_id like \'' + searchFor.matcher + '%\''
    + ' OR students.first_name like \'' + searchFor.matcher + '%\''
    + ' OR students.last_name like \'' + searchFor.matcher + '%\')';
  }
  queryString += ' order by students.last_name, tickets.id limit 10';
  return knex.raw(queryString)
  .then(function(students) {
    return getGuestsByEventGroupByStudentId(searchFor.eventId)
    .then(function(guestsObject) {
      var studentsIdsWithGuests = Object.keys(guestsObject);
      var count = -1;
      var returner = [];
      students.rows.forEach(function(student) {
        console.log(student.id);
        if (studentsIdsWithGuests.indexOf(student.id + '') != -1) {
          count++;
          if (count > 0) {
            student['guest_first_name'] =
              guestsObject[student.id + ''][count - 1][0];
            student['guest_last_name'] =
              guestsObject[student.id + ''][count - 1][1];
            student['guest_id'] =
              guestsObject[student.id + ''][count - 1][2];
            console.log(student);
            returner.push(student)
          } else {
            returner.push(student);
          }
        } else {
          returner.push(student);
          count = -1;
        }
      });
      return returner;
    });
  });
}
function getGuestsByEventGroupByStudentId(eventId) {
  var queryString =
  'select guests.first_name, guests.last_name, guests.id as guest_id, ' +
    'students.id as student_id '
  + 'from guests '
  + 'inner join students on guests.student_id = students.id '
  + 'inner join tickets on tickets.student_id = students.id '
  + 'inner join events on events.id = tickets.event_id '
  + 'where events.id = ' + eventId
  + ' group by guests.id, students.id';
  return knex.raw(queryString).then(function(results) {
    var returner = {
    };
    results.rows.forEach(function(row) {
      if (returner[row.student_id]) {
        returner[row.student_id].push([row.first_name, row.last_name,
          row.guest_id,]);
      } else {
        returner[row.student_id] = [[row.first_name, row.last_name,
          row.guest_id,],];
      }
    });
    return returner;
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


// This is going to be done in ajax,

// function sellTicket(req, res) {
//   return Students().where('student_id', req.body.studentId).select()
//   .then(function(student) {
//     return Tickets().insert({ student_id:  student[0].id })
//     .then(function() {
//       return Tickets().count('id')
//       .then(function(count) {
//         console.log(count);
//         return count[0].count;
//       });
//     });
//   })
//     .catch(function(error) {
//       console.log(error);
//     });
// }

function getGuests(params) {
  return Guests().where(params);
}

function addStudent(params) {
  return Students().insert(params);
}

module.exports = {
  getAllEvents: getAllEvents,
  addEvent: addEvent,
  // sellTicket: sellTicket,
  addGuest: addGuest,
  getGuests: getGuests,
  addStudent: addStudent,
  getStudentsByEvent: getStudentsByEvent,
};
