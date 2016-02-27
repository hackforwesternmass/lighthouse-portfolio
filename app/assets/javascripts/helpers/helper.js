Handlebars.registerHelper('same-tag', function(input, data, options) {
  return new Handlebars.SafeString( "<li>"+ input +"<span>Create<span></li>" );
});

Handlebars.registerHelper('highlight-input', function(input, options) {
  return new Handlebars.SafeString(
      '<li>'
      + options.fn(this).replace(input, "<b class='black-text'>" + input + "</b>")
      + '</li>');
});
