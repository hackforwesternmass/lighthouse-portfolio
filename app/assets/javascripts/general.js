$(document).on('click', '.attachment-list a', function(e) {
  e.stopPropagation();
});

$(document).on('click', 'tr[data-href]', function() {
  Turbolinks.visit($(this).data('href'));
});

$(document).on('page:change', function() {

  var studentName = document.body.dataset.studentName;

  if (studentName) {
    $('nav .nav-wrapper').prepend("<span class='breadcrumb'> " + studentName + "</span>")
  }

  $('.lean-overlay').remove();

  if ($('#login').length) {
    $('label.active').css({paddingBottom: '5px'})
  }
  $('.collapsible').collapsible();
  $('.button-collapse').sideNav();
  $('select').material_select();
  $('.modal-trigger').modal();
  $('.datepicker').pickadate();

  if ($('#notice').length) {
    Materialize.toast($('#notice').data("notice"), 3500, "teal");
  }

  if ($('#alert').length) {
    Materialize.toast($('#alert').data("alert"), 3500, "red darken-3");
  }

  if ($("#calendar_calendar_id").val() == "") {
    $("#calendar_show").attr("disabled", true);
  }

  $("#calendar_calendar_id").bind("propertychange change click keyup input paste", function() {
    if ($("#calendar_calendar_id").val() == "") {
      $("#calendar_show").attr("disabled", true);
    } else {
      $("#calendar_show").attr("disabled", false);
    }
  });

  $(".ellipsis-link").click(function(e) {
    e.preventDefault();
    $(".dropdown").show(200, function() {
      $(document).on("click", function() {
        $(".dropdown").hide(200);
        $(document).off("click");
      });
    });
  });

});

$(document).ready(function() {
  $.ajaxSetup({
    cache: false,
    dataType: 'JSON',
    error: function() {
      Materialize.toast('An error has occurred, try reloading the page.', 3500, 'red darken-3');
    }
   });
});

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.readAsDataURL(input.files[0]);

    reader.onload = function(e) {
      $('img.edit-avatar').attr('src', e.target.result);

    }
  }
}
