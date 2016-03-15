
$(function() {
  getStudents();
});
function getStudents() {
  var url = '/event/' + eventId + '/getstudents';
  var $searchStudents = $('#searchStudents');
  if ($searchStudents.val() != '') {
    url += '?matcher=' + $searchStudents.val();
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
      + '<td>' + formatDate(dat.redeemed_on) + '</td>'
      + '<td onclick="editGuest()" class="clickable">' + stripNulls(dat.guest_first_name) + '</td>'
      + '<td onclick="editGuest()" class="clickable">' + stripNulls(dat.guest_last_name) + '</td>'
      + '</tr>';
      $students.append(row);
    }
  })
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
function editGuest() {
  console.log('modal!');
  $('body').append(
  '<div class="modal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header">',
  +      '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&close;</button>',
  +      '<h4 class="modal-title">Edit Guest</h4>',
  +    '</div>',
  +   '<div class="modal-body">',
  +   '</div>',
  +   '<div class="modal-footer">',
  +     '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>',
  +     '<button type="button" class="btn btn-primary">Save changes</button>',
  +   '</div></div></div></div>');
}
