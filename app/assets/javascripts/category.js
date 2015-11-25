$(document).on('click', '.category-autocomplete .autocomplete-dropdown li', function(){
	$input = $(this).closest(".category-autocomplete").find("input");
	$input.trigger('change');
	setCategory($input, $(this).text(), true);
});

$(document).on('page:change', function(){

	$(".category-autocomplete").each(function(){
		$(this).append("<ul class='autocomplete-dropdown'>");
	});

	$(".category-autocomplete input").on("keyup focus", function(e){
		var $input = $(this);

	  if([9,13,27,38,40].indexOf(e.which) !== -1){
	  	return false;
	  }

	  $.ajax({
		  url: window.location.pathname.slice(0,18),
		  dataType: "json",
		  data: { q: $input.val() }
		})
		.done( function(data) {
			populateCategoryDropdown(data, $input);
		});

	});

	$(".category-autocomplete input").on("keydown", function(e){

		var $input = $(this);
		var $dropdown = $input.siblings(".autocomplete-dropdown");
		var $selected = $dropdown.find('li.selected');

		// TAB
		if(e.which === 9){
			closeAutoComplete();
			($selected.length === 0) ? setCategory($input, null) 
															 : setCategory($input, $selected.text());
    }

    // ENTER
    if(e.which === 13){
    	e.preventDefault();
			closeAutoComplete();
			($selected.length === 0) ? setCategory($input, null) 
															 : setCategory($input, $selected.text());
    }

    // ESC
 		if(e.which === 27){
			closeAutoComplete();
    } 

    // ARROW DOWN
 		if(e.which === 40){
 			if($selected.length === 0){
 				$($dropdown.children()[0]).toggleClass("selected");
 				return false;
 			}
 			$selected.next().toggleClass("selected");
 			$selected.toggleClass("selected");

    } 

    // ARROW UP
 		if(e.which === 38){
 			$selected.prev().toggleClass("selected");
 			$selected.toggleClass("selected");
    } 

	});

});

function populateCategoryDropdown(data, $input){
	var html = HandlebarsTemplates['resources/category'](data);
	$dropdown = $input.siblings(".autocomplete-dropdown");
  $dropdown.html(html);
  openAutoComplete($input, $dropdown);
}

function setCategory($input, value){
	input_value = (value ? value : $input.val());
	$input.val(input_value);
}

function openAutoComplete($input, $dropdown){
	$dropdown.slideDown(200);
  $(document).on("click", function(){
  	if( $input.is(":focus") ){ return false; }
  	closeAutoComplete();
  });
}

function closeAutoComplete() {
	$(".autocomplete-dropdown").slideUp(200);
	$(".autocomplete-dropdown").html("");
}

