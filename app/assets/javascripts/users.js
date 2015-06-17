
$(document).on('page:change', function(){ 

	$("input#user_avatar").change(function(){
    	readURL(this);
  	});

	$("input#goal_due_date").pickadate();
	// maxTextArea();

	$('input[type="date"], input[type="datetime"], input[type="datetime-local"], input[type="month"], input[type="time"], input[type="week"]').each(function() {
    var el = this, type = $(el).attr('type');
    if ($(el).val() == '') $(el).attr('type', 'text');
    $(el).focus(function() {
        $(el).attr('type', type);
        el.click();
    });
    $(el).blur(function() {
        if ($(el).val() == '') $(el).attr('type', 'text');
    });
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
		$("section#goal-modal").delay(200).show('drop', {direction: 'up'}, 500);
	});

	$("a.add.course").click(function(){
		$("div.modal-wrapper").fadeIn(200);
		$("section#course-modal").delay(200).show('drop', {direction: 'up'}, 500);
	});

	$("a.add.activity").click(function(){
		$("div.modal-wrapper").fadeIn(200);
		$("section#activity-modal").delay(200).show('drop', {direction: 'up'}, 500);
	});

	$("div.modal-wrapper").click(function(){
		$("div.modal-wrapper").fadeOut(200);
		$("section#project-modal, section#goal-modal, section#course-modal, section#activity-modal").fadeOut(200);
	});

	$("input#project_photo, input#course_photo").change(function(){
		$("span.modal-file-name").text(this.files[0].name);
	});

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
