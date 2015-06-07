$(document).on('page:change', function(){ 

	$("input#user_avatar").change(function(){
    readURL(this);
  });

	$("a.student-edit").click(function(e){
		e.preventDefault();
		$("section#student-edit-profile").show("slide", { direction: "right" }, 1000);
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
