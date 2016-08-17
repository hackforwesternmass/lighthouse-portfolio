$(document).on("click", ".attachment-list a", function(e){
  e.stopPropagation();
});

$(document).on("click", 'tr[data-href]',function() {
  Turbolinks.visit($(this).data('href'));
});

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


  $('.button-collapse').sideNav();
  $('select').material_select();
  $('.modal-trigger').leanModal();
  $('.datepicker').pickadate();

  if($('#notice').length){
    Materialize.toast($('#notice').data("notice"), 3500, "teal");
  }

  if($('#alert').length){
    Materialize.toast($('#alert').data("alert"), 3500, "red darken-4");
  }

  if( $("#calendar_calendar_id").val() == "" ){
    $("#calendar_show").attr("disabled", true);
  }

  $("#calendar_calendar_id").bind( "propertychange change click keyup input paste" ,function(){
    if( $("#calendar_calendar_id").val() == "" ){
      $("#calendar_show").attr("disabled", true);
    }else{
      $("#calendar_show").attr("disabled", false);
    }
  });

  $(".ellipsis-link").click(function(e){
    e.preventDefault();
    $(".dropdown").show(200, function(){
      $(document).on("click", function(){
        $(".dropdown").hide(200);
        $(document).off("click");
      });
    });
  });

});

$(document).ready(function() {
  $.ajaxSetup({ cache: false });
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
