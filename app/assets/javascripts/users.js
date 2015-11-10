
$(document).on('page:change', function(){ 

	$("input#user_avatar").change(function(){
    	readURL(this);
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


	$("input#project_photo, input#course_photo").change(function(){
		$("span.modal-file-name").text(this.files[0].name);
	});

	$('#project_date_completed').pickadate();

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
