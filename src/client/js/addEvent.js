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
