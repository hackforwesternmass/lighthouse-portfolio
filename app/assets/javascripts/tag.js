$(document).on('page:change', function(){

	var tags = [];

	$(".chip-tag").each(function(){
		tags.push($(this).text().trim());
	});

	$(".tagger input.tag").on("keydown", function(e){

		var $input = $(this);

		// TAB
		if(e.which === 9){
			if($input.val() !== ""){
				setTag($input, tags);
			 }
    }

    // ENTER
    if(e.which === 13){
    	e.preventDefault();
    	console.log("hit?");
			if($input.val() !== ""){
				setTag($input, tags);
			}
    }

	});

  $(document).on('click.chip', '.tag-container .chip i.fa', function () {
  	removeChip.apply(this);
  });

});


function removeChip(){
	var $chip = $(this).parent();
	var html = HandlebarsTemplates['tags/remove_tag']({index: $chip.data("index")});
  $chip.prepend(html);	
  $chip.hide();
}

function setTag($input, tags){
	var html = HandlebarsTemplates['tags/tag']({name: $input.val(), index: tags.length});
  $input.siblings(".tag-container").append(html);	
  tags.push($input.val());
 	$input.val("");
}
