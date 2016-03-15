var $status;
// These will be set in swig.

$(function() {
  loadCount();
  loadGuests();
  console.log('sanity check');
  $status = $('<div id="status">').appendTo('body');
  $('#addGuest').click(popUpAddGuest);
  $('#makeSale').click(incrementTicket);
});



function popUpAddGuest() {
  $status.slideDown();
  var guestForm =
  '<label for="first_name" required autofocus>First Name</label>' +
  '<input type="text" id="guestFirstName" value="" placeholder="First">' +
  '<label for="last_name">Last Name</label>' +
  '<input type="text" id="guestLastName" value="" placeholder="Last">' +
  '<label for="guestSchool">Guest\'s School</label>' +
  '<input type="text" id="guestSchool" value="" placeholder="School">' +
  '<button id="doAddGuest">Add Guest</button>';
  $status.html(guestForm);
  var $doAddGuest = $('#doAddGuest');
  $doAddGuest.click(postGuest);
}

function postGuest() {
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
    if (data.success) {
      loadGuests();
      incrementTicket();
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
    url: '/event/' + eventId + '/sales/' + studentId + '/getguests',
  }).done(function(data) {
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
  console.log('here!');
  $.ajax({
    type: 'GET',
    url: '/event/' + eventId + '/sales/' + studentId + '/ticket_count',
  }).done(function(data) {
    $('#ticket_count').html(data)
  })
}
