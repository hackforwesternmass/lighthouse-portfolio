$(document).on('click', '.tagger .autocomplete-dropdown li', function(){
  $input = $(this).closest(".tagger").find("input");
  var textContent = $(this).text().replace(/Create/g, "").trim();
  setTag($input, textContent);
});

var tags = [];

$(document).on('page:change', function(){

  tags = [];

  $(".chip-tag").each(function(){
    tags.push($(this).text().trim());
  });

  $(".tagger input").on("keyup focus", function(e){

    var $input = $(this);

    if([9,13,27,38,40].indexOf(e.which) !== -1){
      return false;
    }

    $.ajax({
      url: "/projects/tags",
      dataType: "JSON",
      data: { q: $input.val() }
    })
    .done( function(data) {
      data = removeTagDuplicates(data, $input);
      populateDropdown(data, $input);
    });

  });
  

  $(".tagger input.tag").on("keydown blur", function(e){

    var $input = $(this),
        $dropdown = $input.siblings(".autocomplete-dropdown"),
        $selected = $dropdown.find('li.selected');

    // TAB
    if(e.which === 9){
      if($input.val() !== ""){
        setTag($input, $input.val());
       }
    }

    // ENTER
    if(e.which === 13){
      e.preventDefault();
      closeAutoComplete();
      if($input.val() !== ""){
        setTag($input, $input.val());
      }else{
        setTag($input, $selected.text().replace(/Create/g, ""));
      }
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

  $(document).on('click.chip', '.tag-container .chip i.fa', function () {
    removeChip.apply(this);
  });

});

function removeTagDuplicates(data, $input){
  var $originalInput = $input.closest(".tagger").find("input.tag");
  var value_array = $originalInput.val().split(",");
  $.each( value_array, function(i, name){
    $.each(data, function(){
      if(this.name === name){
        data.splice(data.indexOf(this),1);
      }
    });
  });
  return data;
}

function openAutoComplete($dropdown){
  $dropdown.slideDown(200);
  $(document).on("click", function(){
    closeAutoComplete();
  });
}

function closeAutoComplete() {
  $(".autocomplete-dropdown").slideUp(200);
  $(".autocomplete-dropdown").html("");
}

function populateDropdown(data, $input){
  var html = HandlebarsTemplates['tags/autocomplete']({ data: data, input: $input.val() });
  $dropdown = $input.siblings(".autocomplete-dropdown");
  $dropdown.html(html);
  openAutoComplete($dropdown);
}

function removeChip(){
  var $chip = $(this).parent();
  var html = HandlebarsTemplates['tags/remove_tag']({index: $chip.data("index")});
  $chip.prepend(html);  
  $chip.hide();
}

function setTag($input, val){
  var html = HandlebarsTemplates['tags/tag']({name: val, index: tags.length});
  $input.siblings(".tag-container").append(html); 
  tags.push($input.val());
  $input.val("");
}
