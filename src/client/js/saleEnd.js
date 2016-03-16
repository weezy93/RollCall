var $status;
// These will be set in swig.
var $doAddGuest = $('#doAddGuest');

$(function() {
  loadTickets();
  loadGuests();
  console.log('sanity check');
  $doAddGuest.click(postGuest);
  $('#makeSale').click(incrementTicket);
  // $('#modalButton').on('click', function() {
  //   $('#guestFirstName').focus();
  // });
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
    console.log(data);
    var guestString = '<br>';
    for (var i = 0; i < data.length; i++) {
      var dat = data[i];
      guestString += '<div>';
      guestString += '<p>' + dat.first_name + ' ' + dat.last_name + '</p>';
      guestString += '<p>From: ' + dat.school + '</p></div><hr>';
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
    loadTickets();
  });
}

function loadTickets() {
  $('#head').html('<tr>'
   + '<th>Ticket Number</th>'
   + '<th>Sold Date</th>'
   + '</tr>');

  $.ajax({
    type: 'GET',
    url: '/event/' + eventId + '/sales/' + studentId + '/ticket_count',
  }).done(function(data) {
    $('#ticket_count').html(data.length)
    $('#body').html('');
    data.forEach(function(obj) {
      $('#body').append('<tr><td>'
      + obj.id + '</td>'
      + '<td>' + new Date(obj.sold_timestamp).toLocaleString() + '</td>'
      + '</tr>');
    });
  })
}
