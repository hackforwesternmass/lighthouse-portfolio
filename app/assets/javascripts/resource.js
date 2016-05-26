$(document).on('page:change', function(){

  var $category;

  $(".resource-category .modal-trigger").click(function(){

    var $edit_category_modal = $("#edit-category-modal"),
        $this = $(this);

    $category = $this;
    $edit_category_modal.find("input[type='hidden']").val($this.text());
    $edit_category_modal.find("input[type='text']").prop("placeholder", $this.text());
    $edit_category_modal.find("input[type='text']").change();

  });

  $("#edit-category-modal form input[type='submit']").click(function(e){
    if( $(this).closest("form").find("input[type='text']").value === "" ){
      e.preventDefault();
    }
  })


  $('#edit-category-modal form').on('ajax:success', function(e, data, status, xhr){
    $(this).find("input[type='text']").val("");
    $("#edit-category-modal").closeModal();
    $category.text(data.category);
  });

});
