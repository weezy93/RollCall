var guest_id;
var $modal = $('#guest_modal');

$(function() {
  getStudents();
});

function getStudents() {
  var url = '/event/' + eventId + '/getstudents?limit=10';
  var $searchStudents = $('#searchStudents');
  if ($searchStudents.val() != '') {
    url += '&matcher=' + $searchStudents.val();
  }
  $.ajax({
    type: 'GET',
    url: url,
  }).done(function(data) {
    $students = $('#students');
    $students.html('<tr>'
      + '<th>Student ID</th>'
      + '<th>First Name</th>'
      + '<th>Middle Name</th>'
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
      var row =
      '<tr>'
      + '<td>' + stripNulls(dat.student_id) + '</td>'
      + '<td>' + stripNulls(dat.first_name) + '</td>'
      + '<td>' + stripNulls(dat.middle_name) + '</td>'
      + '<td>' + stripNulls(dat.last_name) + '</td>'
      + '<td>' + stripNulls(dat.grade) + '</td>'
      + '<td>' + stripNulls(dat.ticket_number) + '</td>'
      + '<td>' + formatDate(dat.sold_timestamp) + '</td>'
      + '<td>' + formatDate(dat.redeemed_on) + '</td>';
      if (dat.guest_id) {
        row += '<td onclick="editGuest(' + dat.guest_id + ')" class="clickable">' +
          stripNulls(dat.guest_first_name) + '</td>'
        + '<td onclick="editGuest(' + dat.guest_id + ')" class="clickable">' +
          stripNulls(dat.guest_last_name) + '</td>'
      } else {
        row += '<td>' + stripNulls(dat.guest_first_name) + '</td>'
        + '<td>' + stripNulls(dat.guest_last_name) + '</td>'
      }
      row += '<td><button type="button" class="btn btn-danger btn-sm"' +
        'onclick="confirmDelete(' + dat.id + ',' + dat.ticket_number +
        ')">X</button></td>';
      row += '</tr>';
      $students.append(row);
    }
  });
}

function formatDate(dateString) {
  if (dateString === null) {
    return '';
  }
  var date = new Date(dateString);
  return date.toLocaleString();
}

function stripNulls(string) {
  if (string === null || string == undefined) {
    return '';
  }
  return string;
}
function editGuest(id) {
  guest_id = id;
  var url = '/event/' + eventId + '/guest/' + id;
  $.ajax({
    url: url,
    type: 'GET'
  }).done(function(data) {
    $('#guest_first').val(data[0].first_name);
    $('#guest_last').val(data[0].last_name);
  });
  $modal.on('click', '.update', function(e){
    $modal.modal('loading');
    e.preventDefault();

    var params = {
      first_name: $('#guest_first').val(),
      last_name: $('#guest_last').val()
    };

    var url = '/event/' + eventId + '/guest/' + id + '/edit';
    $.ajax({
      url: url,
      type: 'POST',
      data: params
    }).done(function(data) {
      getStudents();
      setTimeout(function() {
        $('#close').click();
      }, 100);
    });
  });
}

function confirmDelete(studentId, ticketId) {
  var input = confirm('Are you sure you want to delete ticket #' + ticketId
    + '?')
  if (input) {
    var url = '/event/deleteTicket/' + studentId + '/' + ticketId;
    $.ajax({
      type: 'DELETE',
      url: url,
    })
    .done(function(data) {
      getStudents();
      if (data.error) {
        console.log(data.error);
      }
    });
  }
}

function previewPicture(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function(event) {
      $('#previewImage')
          .attr('src', event.target.result)
          .width('100%');
    };
    reader.readAsDataURL(input.files[0]);
  }
}


$(document).on('click', 'td.clickable', function() {
  // Create the backdrop and wait for next modal to be triggered
  $('body').modalmanager('loading');
  setTimeout(function() {
    $modal.modal();
  }, 1000);
});
