$(document).on('page:change', function(){

  $(".project-content").fadeTo(250, 1);

  $("a.nav-right, a.nav-left").click(function(e){
    e.preventDefault();
    $(".project-content").fadeTo(250, 0.65);
    var link = $(this).attr("href");
    setTimeout(function() { Turbolinks.visit(link) }, 250);
  });

	$('.datepicker').pickadate();

});
