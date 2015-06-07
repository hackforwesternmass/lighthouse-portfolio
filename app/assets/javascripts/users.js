
$(document).on('page:change', function(){ 

	$("input#user_avatar").change(function(){
    readURL(this);
  });

	$("a.student-edit").click(function(e){
		e.preventDefault();
		$(this).fadeOut(200);
		$("form.edit_user").fadeIn(200);
		$("div#show_user").fadeOut(200);	
	});

	$("button.cancel-edit").click(function(e){
		e.preventDefault();
		$("a.student-edit").fadeIn(200);
		$("form.edit_user").fadeOut(200);
		$("div#show_user").fadeIn(200);
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
