var $status;
// These will be set in swig.
var eventId = 1;
var studentId = 2;
$(function() {
  loadGuests();
  console.log('sanity check');
  $status = $('<div id="status">').appendTo('body');
  $status.slideUp();
  $('#addGuest').click(popUpAddGuest);
});

function popUpAddGuest() {
  $status.slideDown();
  var guestForm =
  '<label for="first_name">First Name</label>' +
  '<input type="text" id="guestFirstName" value="" placeholder="First">' +
  '<label for="last_name">Last Name</label>' +
  '<input type="text" id="guestLastName" value="" placeholder="Last">' +
  '<label for="guestSchool">Guest\'s School</label>' +
  '<input type="text" id="guestSchool" value="" placeholder="School">' +
  '<button id="doAddGuest">Add Guest</button>';
  $status.html(guestForm);
  var $doAddGuest = $('#doAddGuest');
  console.log($doAddGuest);
  $doAddGuest.click(postGuest);
}
function postGuest() {
  var params = {
    first_name: $('#guestFirstName').val(),
    last_name: $('#guestLastName').val(),
    school: $('#guestSchool').val(),
    event_id: eventId,
    student_id: studentId,
  };
  console.log(params);
  $.ajax({
    type: 'POST',
    url: '/sales/' + eventId + '/' + studentId + '/addguest',
    data: params,
  }).done(function(data) {
    if (data.success) {
      loadGuests();
      $status.append('<p>' + data.success + '</p>');
      $status.delay(500).slideUp();
    } else {
      $status.append('<p>' + data.error + '</p>');
      $status.delay(500).slideUp();
    }
  });
}
function loadGuests() {
  $.ajax({
    type: 'GET',
    url: '/sales/' + eventId + '/' + studentId + '/getguests',
  }).done(function(data) {
    console.log(data);
    var guestString = '<h2>Guests</h2>';
    for (var i = 0; i < data.length; i++) {
      var dat = data[i];
      guestString += '<div>';
      guestString += '<p>' + dat.first_name + ' ' + dat.last_name + '</p>';
      guestString += '<p>From: ' + dat.school + '</p></div>';
    }
    $('#guestsSection').html(guestString);
  });
}


// function getStudentInfo() {
//   var params = {
//   student_id: studentId
//   }
//   $.ajax({
//     type: 'GET',
//     url: '/event/' + eventId + '/sales/' + studentId
//   }).done(function(data) {
//     console.log(data);
//     var studentInfo
//   });
//
// }
