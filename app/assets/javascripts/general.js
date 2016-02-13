$(document).on('page:change', function(){

  $('.button-collapse').sideNav();
  $('select').material_select();
  $('.modal-trigger').leanModal();

  if($('#notice').length){
    Materialize.toast($('#notice').data("notice"), 3500, "teal");
  }

  if($('#alert').length){
    Materialize.toast($('#alert').data("alert"), 3500, "red");
  }

  // $(".box a").hover(function(){

  //   $(this).find("i").velocity({ paddingRight: "20px" }, [ 1000, 80 ]);
  // }, function(){
  //   $(this).find("i").velocity({ paddingRight: "0px" }, [ 1000, 80 ]);
  // });

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
