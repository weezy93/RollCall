$(function() {
  getStudents();
  $(document).keydown(processKeys)
});
var keyMap = {};
var searchTimeout;
function getStudents(time) {
  clearTimeout(searchTimeout);
  var $searchStudents = $('#searchStudents');
  if ($searchStudents.val() != '') {
    $('#inputContainer').removeClass('centered');
    $('#inputContainer').removeClass('large');
    keyMap = {};
    searchTimeout = setTimeout(function() {
      var url = '/event/' + eventId + '/getstudents?matcher=' +
        $searchStudents.val();
      $.ajax({
        type: 'GET',
        url: url,
      }).done(function(data) {
        if ($searchStudents.val() != '') {
          $students = $('#students');
          $students.html('<tr class="short">'
            + '<th></th>'
            + '<th>Student ID</th>'
            + '<th>First Name</th>'
            + '<th>Last Name</th>'
            + '<th>Grade</th>'
            + '<th>Ticket #</th>'
            + '<th>Sold Time</th>'
            + '<th> Redeemed Time </th>'
            + '<th> Guest First Name </th>'
            + '<th>Guest Last Name</th>'
            + '<th></th>'
            + '</tr>');
          for (var i = 0; i < data.length; i++) {
            var dat = data[i];
            keyMap[i + 1] = dat.ticket_number;
            var row =
            '<tr onclick="redeem(' + dat.ticket_number + ')" class="clickable">'
            + '<td><i class="icon-large icon-keyboard-wired"></i>#' + (i + 1) + '</td>'
            + '<td>' + stripNulls(dat.student_id) + '</td>'
            + '<td>' + stripNulls(dat.first_name) + '</td>'
            + '<td>' + stripNulls(dat.last_name) + '</td>'
            + '<td>' + stripNulls(dat.grade) + '</td>'
            + '<td>' + stripNulls(dat.ticket_number) + '</td>'
            + '<td>' + formatDate(dat.sold_timestamp) + '</td>'
            + '<td>' + formatDate(dat.redeemed_on) + '</td>'
            + '<td>' + stripNulls(dat.guest_first_name) + '</td>'
            + '<td>' + stripNulls(dat.guest_last_name) + '</td>'
            + '</tr>';
            $students.append(row);
          }
        }
      });
    }, time);
  } else {
    clearTimeout(searchTimeout);
    $('#inputContainer').addClass('centered');
    $('#inputContainer').addClass('large');
    $('#students').html('');
  }
}
function formatDate(dateString) {
  if (dateString === null) {
    return '';
  }
  var date = new Date(dateString);
  var returner = date.toLocaleString().split(', ');
  return returner[1] + '<br>' + returner[0];
}

function stripNulls(string) {
  if (string === null || string == undefined) {
    return '';
  }
  return string;
}

function processKeys(event) {
  var $searchStudents = $('#searchStudents');
  if (!$searchStudents.is(':focus')) {
    if (event.keyCode == 13) {
      $searchStudents.val('');
      $searchStudents.focus();
    }
    var key = String.fromCharCode(event.keyCode);
    if (keyMap[key]) {
      redeem(keyMap[key]);
    }
  } else {
    if (event.keyCode == 13) {
      $searchStudents.blur();
    }
  }
}
function redeem(ticketNumber) {
  var url = '/event/' + eventId + '/redeem/' + ticketNumber;
  $.ajax({
    method: 'PUT',
    url: url,
  })
  .done(function(data) {
    if (data.success) {
      getStudents(0);
    }
  })
}
