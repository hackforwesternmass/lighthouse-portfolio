var week_start, week_end;

$(document).on('click', '.week-navigation .last-week', function(){
  resetCalendar();
  week_start = moment(week_start).subtract(7, 'days').format("YYYY-MM-DDT00:00:00Z");
  loadUpcomingWeekEvents(week_start);
});

$(document).on('click', '.week-navigation .next-week', function(){
  resetCalendar();
  week_start = moment(week_start).add(7, 'days').format("YYYY-MM-DDT00:00:00Z");
  loadUpcomingWeekEvents(week_start);
});


$(document).on('page:change', function(){

  if($("#week-calendar").length > 0) {

    if( isWeekend() ){
      week_start = moment().endOf('week').add(2, 'days').format("YYYY-MM-DDT00:00:00Z");
    }else{
      week_start = moment().startOf('week').add(1, 'days').format("YYYY-MM-DDT00:00:00Z");
    }

    loadUpcomingWeekEvents(week_start);
  }

});

function loadUpcomingWeekEvents(week_start){

  var calendar_id = document.querySelector('#calendar-id').dataset.calendarId;
  week_end = moment(week_start).add(5, 'days').format("YYYY-MM-DDT00:00:00Z");
  var calendar_url = "https://www.googleapis.com/calendar/v3/calendars/"+calendar_id 
                    +"/events?orderBy=startTime&singleEvents=true&timeMin="+week_start
                    +"&timeMax="+week_end+"&key=AIzaSyB-xMDC9mt9b1nj_df2pjVgHOlkIZzIxWs";

  setWeekdays();

  $.getJSON( calendar_url, function(events) {
    $(".calendar-spinner").css('visibility', 'hidden');

    var day, period, event, input, period_class;

    for(var i = 0; i < events.items.length; i++){
      event = events.items[i];

      if(event.start.date){
        continue;
      }

      day = moment(event.start.dateTime).day();
      period = getPeriod(event);
      if(!period){ continue; }
      period_class = ".p" + period + " .w" + day;

      input = formatEvent(event);
      html = HandlebarsTemplates['calendars/week_item'](input);
      $(period_class).append(html); 

    }

    doubleDecker();

  }).fail(function(){
    $("#week-calendar").html("<h5 class='center-align'>Failed to load data using the following calendar id: <br><b>" + calendar_id +  "</b><h5>")
    $("#agenda-calendar").html("<h5 class='center-align'>Failed to load data using the following calendar id: <br><b>" + calendar_id +  "</b><h5>")
  });


}

function doubleDecker(){

  var doubles = $(".week-item").siblings(".week-item");

  doubles.each(function(){
    $(this).addClass("col s6");
  });

}

function getPeriod(event){

  var event_time = moment(event.start.dateTime).format("1991-12-14THH:mm");
      day_start  = "1991-12-14T06:00",
      p1_over    = "1991-12-14T10:59",
      p2_over    = "1991-12-14T12:29",
      p3_over    = "1991-12-14T13:29",
      p4_over    = "1991-12-14T14:29",
      day_over   = "1991-12-14T18:00";

  switch (true) {
    case moment(event_time).isBetween(day_start, p1_over):
      return 1;
    case moment(event_time).isBetween(p1_over, p2_over):
      return 2;
    case moment(event_time).isBetween(p2_over, p3_over):
      return 3;
    case moment(event_time).isBetween(p3_over, p4_over):
      return 4;
    case moment(event_time).isBetween(p4_over, day_over):
      return 5;
    default:
      return false;
  }

}

function resetCalendar(){
  $(".calendar-spinner").css('visibility', 'visible');
  $(".weekdays").remove();
  $(".week-item").remove();
}

function isWeekend(){
  return moment().day() === (6 || 7);
}

function setWeekdays(){
  var days = [],
  weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  next_day = moment(week_start),
  html;

  for (var i = 0; i < 5; i++) {
    days.push({ weekday: weekdays[i], date: next_day.format("MMMM D") });
    next_day = moment(next_day).add(1, 'days');
  };

  html = HandlebarsTemplates['calendars/weekdays'](days);
  $("#week-calendar").prepend(html);
}
