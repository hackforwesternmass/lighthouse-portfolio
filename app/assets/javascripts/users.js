
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

	$("div.project").hover(function(){
			$($(this).children()[0]).fadeIn(100);
		},function(){
			$($(this).children()[0]).fadeOut(100);
		});

	$("div.remove-project").click(function(){
		var _this = $(this);
		var _grandparent = $(_this.parent()).parent();
		_grandparent.remove();
	});

	$("div.add-project").click(function(){
		$("div.modal-wrapper").fadeIn(200);
		$("section#project-modal").delay(200).show('drop', {direction: 'up'}, 500);
	});

	$("div.add-goal").click(function(){
		$("div.modal-wrapper").fadeIn(200);
		$("section#project-modal").delay(200).show('drop', {direction: 'up'}, 500);
	});

	$("div.modal-wrapper").click(function(){
		$("div.modal-wrapper").fadeOut(200);
		$("section#project-modal").fadeOut(200);
	});

	$("input#project_photo").change(function(){
		$("span.project-file-name").text(this.files[0].name);
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
