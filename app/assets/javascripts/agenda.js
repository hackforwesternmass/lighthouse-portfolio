var calendar_max_time;
var no_events = false;

$(document).on('page:change', function(){

  if($("#agenda-calendar").length > 0) {
    var calendar_min_time = moment().format("YYYY-MM-DDT00:00:00Z");
    loadUpcomingAgendaEvents(calendar_min_time, true);
  }

});

$(document).on('click', '.agenda-event', function(){
  var $description = $(this).find(".event-description");

  if($description.is(":visible")){
    $description.slideUp(300);
  }else{
    $description.slideDown(300);
  }

});

function loadUpcomingAgendaEvents(calendar_min_time, first_iteration){

  if(document.querySelector('#calendar-id') === null){
    return;
  }

  var calendar_id = document.querySelector('#calendar-id').dataset.calendarId;
  calendar_max_time = moment(calendar_min_time).add(30, 'days').format("YYYY-MM-DDT00:00:00Z");
  var calendar_url = "https://www.googleapis.com/calendar/v3/calendars/"+calendar_id 
                    +"/events?orderBy=startTime&singleEvents=true&timeMin="+calendar_min_time
                    +"&timeMax="+calendar_max_time+"&key=AIzaSyB-xMDC9mt9b1nj_df2pjVgHOlkIZzIxWs";

  $.getJSON( calendar_url, function(events) {

    if(events.items.length === 0){
      no_events = true;
    }

    if(events.items.length === 0  && first_iteration){
      $("#agenda-calendar").append("<h1>There's nothing on your calendar</h1>")
    }


    var current_event, prev_event, date_class, html, input;
    for(var i = 0; i < events.items.length; i++){
      current_event = events.items[i];
      prev_event = events.items[i-1];
      first_iteration = first_iteration && i === 0;

      if(current_event.start.date){
        multipleDays(current_event);
        continue;
      }

      date_class = moment(current_event.start.dateTime).format("YYYY-MM-DD");

      if(first_iteration){
        input = { date: moment(current_event.start.dateTime).format("dddd MMMM D YYYY"), date_class: date_class }
        html = HandlebarsTemplates['calendars/agenda_item'](input);
        $("#agenda-calendar").append(html);
      }

      if( first_iteration || (prev_event !== undefined && moment(current_event.start.dateTime).isSame(prev_event.start.dateTime, 'day')) ){
        html = HandlebarsTemplates['calendars/agenda_event']( formatEvent(current_event) );
        $(".agenda-item."+date_class).find(".agenda-events").append(html);
      }else{
        input = { date: moment(current_event.start.dateTime).format("dddd MMMM D YYYY"), date_class: date_class }
        html = HandlebarsTemplates['calendars/agenda_item'](input);
        $("#agenda-calendar").append(html); 

        html = HandlebarsTemplates['calendars/agenda_event']( formatEvent(current_event) );
        $(".agenda-item."+date_class).find(".agenda-events").append(html);
      }
    }

    $(window).scroll(function() {
      if( (($(window).scrollTop() + $(window).height()) > (getDocHeight() - 200)) && !no_events) {
        loadUpcomingAgendaEvents(calendar_max_time, false);
        $(window).off('scroll');

        setTimeout(function () {
          $(window).on('scroll');
        }, 2000);
      }
    });

  });


}

function multipleDays(current_event){

  var start_day = moment(current_event.start.date).format("MMMM D");
  var end_day = moment(current_event.end.date).format("MMMM D");
  var date = start_day +" - "+ end_day;
  var date_class = "multiple-" + current_event.start.date;
  input = { date: date, date_class: date_class };

  html = HandlebarsTemplates['calendars/agenda_item'](input);
  $("#agenda-calendar").append(html); 

  html = HandlebarsTemplates['calendars/agenda_event']( formatEvent(current_event) );
  $(".agenda-item."+date_class).find(".agenda-events").append(html);

}

function formatEvent(event){

  var description, start_time, end_time, attachments;

  if(event.description){
    description = event.description.replace(/\n\r?/g, '<br>');
  }

  if(event.start.dateTime){
    start_time = moment(event.start.dateTime).format("h:mm");
    end_time = moment(event.end.dateTime).format("h:mm");
  }

  if(event.attachments){
    attachments = event.attachments;
  }
  
  return { 
            start_time: start_time,
            end_time: end_time,
            title: event.summary,
            display_name: event.creator.displayName,
            description: description,
            attachments: attachments
          }
}

function getDocHeight() {
    var D = document;
    return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
    );
}


