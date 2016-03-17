var $status;
// These will be set in swig.
var $doAddGuest = $('#doAddGuest');
var guestNumber;
var ticketNumber;


$(function() {
  loadTickets();
  console.log('sanity check');
  $doAddGuest.click(postGuest);
  $('#makeSale').click(incrementTicket);
  // $('#modalButton').on('shown', function() {
  //   $(this).find('#guestFirstName').focus();
  // });
});

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
    loadGuests();
    incrementTicket();
  });
}

function loadGuests() {
  $.ajax({
    type: 'GET',
    url: '/event/' + eventId + '/sales/' + studentId + '/getguests',
  }).done(function(data) {
    guestNumber = data.length;
    disableAddTicket(data);
    var guestString = '';
    for (var i = 0; i < data.length; i++) {
      var dat = data[i];
      guestString += "<div class='guest'>";
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
    ticketNumber = data.length;
    loadGuests();
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

function disableAddTicket() {
  // Data is ticket array
  if (ticketNumber >= (guestNumber + 1)) {
    $('#makeSale').addClass('disabled');
  }
}
