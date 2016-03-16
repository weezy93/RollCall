var $status;
// These will be set in swig.
var $doAddGuest = $('#doAddGuest');

$(function() {
  loadCount();
  loadGuests();
  console.log('sanity check');
  $doAddGuest.click(postGuest);
  $('#makeSale').click(incrementTicket);
});

function postGuest() {
  console.log('add guest');
  var params = {
    first_name: $('#guestFirstName').val(),
    last_name: $('#guestLastName').val(),
    school: $('#guestSchool').val(),
    event_id: eventId,
    student_id: studentId,
  }
  $.ajax({
    type: 'POST',
    url: '/event/' + eventId + '/sales/' + studentId + '/addguest',
    data: params,
  }).done(function(data) {
    loadGuests();
    incrementTicket();
  });
}

function loadGuests() {
  $.ajax({
    type: 'GET',
    url: '/event/' + eventId + '/sales/' + studentId + '/getguests',
  }).done(function(data) {
    var guestString = '<br>';
    for (var i = 0; i < data.length; i++) {
      var dat = data[i];
      guestString += '<div>';
      guestString += '<p>' + dat.first_name + ' ' + dat.last_name + '</p>';
      guestString += '<p>From: ' + dat.school + '</p></div>';
    }
    $('#guestsSection').html(guestString);
  });
}

function incrementTicket() { // Increments ticket at student.id
  var params = {
    student_id: studentId,
    event_id: eventId,
  }
  $.ajax({
    type: 'POST',
    url: '/event/' + eventId + '/sales/' + studentId,
    data: params,
  }).done(function() {
    loadCount();
  });
}

function loadCount() {
  console.log('here');
  $.ajax({
    type: 'GET',
    url: '/event/' + eventId + '/sales/' + studentId + '/ticket_count',
  }).done(function(data) {
    $('#ticket_count').html(data)
  })
}
