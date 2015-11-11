$(function(){
  $('.button-collapse').sideNav({});
});

function maxTextArea(identifier, limit){
    $(identifier).keypress(function(e) {
        if (e.which < 0x20) {
            return;
        }
        if (this.value.length == limit) {
            e.preventDefault();
        } else if (this.value.length > limit) {
            this.value = this.value.substring(0, limit);
        }
    });
}

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.readAsDataURL(input.files[0]);

    reader.onload = function (e) {
      $('img.edit-avatar').attr('src', e.target.result);

    }
  }
}