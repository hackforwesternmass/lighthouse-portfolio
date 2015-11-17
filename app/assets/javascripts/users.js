$(document).on('page:change', function(){

	console.log("hit");
	$("input#user_avatar").change(function(){
  	readURL(this);
	});

});

