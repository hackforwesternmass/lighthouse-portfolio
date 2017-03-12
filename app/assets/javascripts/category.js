$(document).on('page:change', function() {

  if($('.resource-form').length > 0) {
    $.ajax({
      url: "/users/" + document.body.dataset.userId + "/resources",
      dataType: "json",
      success: function(data) {
        parsedData = $.unique(Object.keys(data.resources).concat(Object.keys(data.general_resources)));
        autocompleteData = {}
        parsedData.forEach(function(resource) {
          autocompleteData[resource] = null;
        })

        $('.category-autocomplete').autocomplete({
          data: autocompleteData,
          limit: 10
        });
      }
    });
  }

})
