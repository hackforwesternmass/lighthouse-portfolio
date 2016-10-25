$(document).on('page:change', function(){

	var fieldsCount,
      maxFieldsCount = 3,
      $addLink = $('a.add_nested_fields_link');

  function toggleAddLink() {
    $addLink.toggle(fieldsCount < maxFieldsCount);
  }

  $(document).on("fields_added.nested_form_fields", function() {
    fieldsCount += 1;
    toggleAddLink();
  });

  $(document).on("fields_removed.nested_form_fields", function() {
    fieldsCount -= 1;
    toggleAddLink();
  });

  fieldsCount = $('form .nested_fields').length;
  toggleAddLink();

	$("input#portfolio_avatar").change(function(){
  	readURL(this);
	});

});
