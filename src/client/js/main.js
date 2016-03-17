// add scripts

$(document).on('ready', function() {
});

$("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("active");
});

$(document).on('click', '#delete', function(event) {
  event.preventDefault();
  var confirmation = confirm('Are you sure you want to delete this event?');

  if (confirmation) {
    var href = $('#delete').attr('href');
    $.ajax({
      url: href,
      type: 'PUT'
    }).success(function(result) {
      window.location.replace('/');
    }).error(function(err) {
      console.log('error: ', err);
    });
  }
});
