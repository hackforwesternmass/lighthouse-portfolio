Handlebars.registerHelper('same-tag', function(input, data, options) {
  return new Handlebars.SafeString( "<li>"+ input +"<span>Create category<span></li>" );
});