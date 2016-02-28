$(document).on('page:change', function(){

  $('.button-collapse').sideNav();
  $('select').material_select();
  $('.modal-trigger').leanModal();

  if($('#notice').length){
    Materialize.toast($('#notice').data("notice"), 3500, "teal");
  }

  if($('#alert').length){
    Materialize.toast($('#alert').data("alert"), 3500, "red darken-4");
  }

  $(".ellipsis-link").click(function(e){
    e.preventDefault();
    $(".dropdown").show(200, function(){
      $(document).on("click", function(){
        $(".dropdown").hide(200);
        $(document).off("click");
      });
    });
  });

});


function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.readAsDataURL(input.files[0]);

    reader.onload = function (e) {
      $('img.edit-avatar').attr('src', e.target.result);

    }
  }
}
