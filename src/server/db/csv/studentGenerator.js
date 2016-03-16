var fs = require('fs');
var faker = require('faker');

function generateStudents(numberOfStudents, numberOfTickets, numberOfGuests) {
  var writer = 'last_name,first_name,middle_name,student_id,grade\n';
  for (i = 0; i < numberOfStudents; i++) {
    var firstName = faker.name.firstName();
    var lastName = faker.name.lastName();
    var middleName = faker.name.firstName();
    if (faker.random.number({min: 1, max: 10,}) > 8) {
      middleName = '';
    }
    var studentId = 100001 + i;
    var grade = faker.random.number({min: 9, max: 12,});
    writer += lastName + ',' + firstName + ',' + middleName + ','
      + studentId + ',' + grade + '\n';
  }
  fs.writeFileSync('students.csv', writer);
  generateGuestsAndTickets(numberOfStudents, numberOfTickets, numberOfGuests);
}

function generateGuestsAndTickets(numberOfStudents, numberOfTickets,
    numberOfGuests) {
  var usedIds = [];
  var guests = 'student_id,first_name,last_name,school,event_id\n';
  var tickets = 'student_id,sold_timestamp,event_id\n';
  for (i = 0; i < numberOfGuests; i++) {
    studentId = faker.random.number({
      min: 1,
      max: numberOfStudents,
    });
    while (usedIds.indexOf(studentId) != -1) {
      studentId = faker.random.number({
        min: 1,
        max: numberOfStudents,
      });
    }
    usedIds.push(studentId);
    var firstName = faker.name.firstName();
    var lastName = faker.name.lastName();
    var school = faker.lorem.words()[0] + ' High School';
    guests += studentId + ',' + firstName + ',' + lastName + ',' + school +
      ',' + 1 + '\n';
    soldTimestamp = faker.date.between('3/3/16','3/7/16');
    tickets += studentId + ',' + soldTimestamp.toISOString() + ',' + 1 + '\n';
    tickets += studentId + ',' + soldTimestamp.toISOString() + ',' + 1 + '\n';
  }
  var currentTicketCount = usedIds.length * 2
  for (i = 0; i < numberOfTickets - currentTicketCount; i++) {
    studentId = faker.random.number({
      min: 1,
      max: numberOfStudents,
    });
    while (usedIds.indexOf(studentId) != -1) {
      studentId = faker.random.number({
        min: 1,
        max: numberOfStudents,
      });
    }
    usedIds.push(studentId);
    soldTimestamp = faker.date.between('3/3/16','3/7/16');
    tickets += studentId + ',' + soldTimestamp.toISOString() + ',' + 1 + '\n';
  }
  fs.writeFileSync('guests.csv', guests);
  fs.writeFileSync('tickets.csv', tickets);
}

generateStudents(1000, 300, 40);
