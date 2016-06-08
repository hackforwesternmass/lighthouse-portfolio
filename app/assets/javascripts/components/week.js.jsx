var Week = React.createClass({
  getInitialState: function() {
    return { classPeriods: [], events: [], weekStartDate: "", loading: true, hasEvents: false };
  },
  componentDidMount: function(){
    var weekStartDate, weekEndDate;

    if( moment().day() === (6 || 7) ){
      weekStartDate = moment().endOf('week').add(2, 'days').format("YYYY-MM-DDT00:00:00Z");
    }else{
      weekStartDate = moment().startOf('week').add(1, 'days').format("YYYY-MM-DDT00:00:00Z");
    }

    $.getJSON( "/class_periods", function(classPeriods){
      this.setState({ classPeriods: classPeriods });
    }.bind(this));

    this.setCalendar(weekStartDate);
  },
  setCalendar: function(weekStartDate){
    var weekEndDate = moment(weekStartDate).add(5, 'days').format("YYYY-MM-DDT00:00:00Z");
    var calendarUrl = "https://www.googleapis.com/calendar/v3/calendars/"+ this.props.calendarId
                    +"/events?orderBy=startTime&singleEvents=true&timeMin="+ weekStartDate
                    +"&timeMax="+ weekEndDate +"&key=AIzaSyB-xMDC9mt9b1nj_df2pjVgHOlkIZzIxWs";

    $.getJSON( calendarUrl, function(events) {
      this.setState({ weekStartDate: weekStartDate, events: this.parseEvents(events.items), loading: false, hasEvents: events.length > 0  });
    }.bind(this));
  },
  previousWeek: function(){
    this.setState({ loading: true });
    var weekStartDate = moment(this.state.weekStartDate).subtract(7, 'days').format("YYYY-MM-DDT00:00:00Z");
    this.setCalendar(weekStartDate);
  },
  nextWeek: function(){
    this.setState({ loading: true });
    var weekStartDate = moment(this.state.weekStartDate).add(7, 'days').format("YYYY-MM-DDT00:00:00Z");
    this.setCalendar(weekStartDate);
  },
  weekdayHeader: function(){
    if(this.state.weekStartDate === "") return;
    var weekdayNodes = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(function(weekday, i){
      return <div className="col m-fifth" key={i}>
                <h5 className="weekday truncate">{weekday}<br/>{moment(this.state.weekStartDate).add(i, 'days').format("MMMM D")}</h5>
              </div>;
    }.bind(this));
    return weekdayNodes;
  },
  parseEvents: function(events){
    var parsedEvents = Array.apply(null, Array(5 * this.state.classPeriods.length)).map(function() { return [] });
    var startTime, endTime, weekday, timePeriod;

    events.forEach(function(event){

      timePeriod = NaN;

      if(event.start.dateTime){
        startTime = moment(event.start.dateTime).format("h:mm");
        endTime = moment(event.end.dateTime).format("h:mm");
      }

      weekday = moment(event.start.dateTime).day() - 1;

      this.state.classPeriods.forEach(function(period, i){
        if(moment(moment(event.start.dateTime).add(5, 'minutes').format("1991-12-14THH:mm")).isBetween("1991-12-14T" + period.start_time, "1991-12-14T" + period.end_time)){
          timePeriod = i;
        }
      }.bind(this));

      parsedEvents[ (5 * timePeriod) + weekday ].push({ title: event.summary, startTime: startTime, endTime: endTime });

    }.bind(this));

    return parsedEvents;
  },
  weekItems: function(){
    var weekItemNodes = this.state.events.map(function(event, i){
      var weekItemNodeEntries;

      if(event.length === 0){
        weekItemNodeEntries = <div className="col m-fifth" key={i}>
                                <div className="week-item">
                                  <h6 className="purple-text bold truncate"></h6>
                                  <div className="time truncate"></div>
                                </div>
                              </div>;
      }else if(event.length === 1){
        weekItemNodeEntries = <div className="col m-fifth" key={i}>
                                <div className="week-item">
                                  <h6 className="purple-text bold truncate" title={event[0].title}>{event[0].title}</h6>
                                  <div className="time truncate">{ event[0].startTime !== "" ? <span>{event[0].startTime} - {event[0].endTime}</span> : null}</div>
                                </div>
                              </div>;
      }else if(event.length === 2){
        weekItemNodeEntries = <div className="col m-fifth" key={i}>
                                <div className="multiple-week-item col s6">
                                  <h6 className="purple-text bold truncate" title={event[0].title}>{event[0].title}</h6>
                                  <div className="time truncate">{ event[0].startTime !== "" ? <span>{event[0].startTime} - {event[0].endTime}</span> : null}</div>
                                </div>
                                <div className="multiple-week-item col s6">
                                  <h6 className="purple-text bold truncate" title={event[1].title}>{event[1].title}</h6>
                                  <div className="time truncate">{ event[1].startTime !== "" ? <span>{event[1].startTime} - {event[1].endTime}</span> : null}</div>
                                </div>
                              </div>;
      }else if(event.length === 3){
        weekItemNodeEntries = <div className="col m-fifth" key={i}>
                                <div className="multiple-week-item col s4">
                                  <h6 className="purple-text bold truncate" title={event[0].title}>{event[0].title}</h6>
                                  <div className="time truncate">{ event[0].startTime !== "" ? <span>{event[0].startTime} - {event[0].endTime}</span> : null}</div>
                                </div>
                                <div className="multiple-week-item col s4">
                                  <h6 className="purple-text bold truncate" title={event[1].title}>{event[1].title}</h6>
                                  <div className="time truncate">{ event[1].startTime !== "" ? <span>{event[1].startTime} - {event[1].endTime}</span> : null}</div>
                                </div>
                                <div className="multiple-week-item col s4">
                                  <h6 className="purple-text bold truncate" title={event[2].title}>{event[2].title}</h6>
                                  <div className="time truncate">{ event[2].startTime !== "" ? <span>{event[2].startTime} - {event[2].endTime}</span> : null}</div>
                                </div>
                              </div>;
      }else if(event.length > 3){
        weekItemNodeEntries = <div className="col m-fifth" key={i}>
                                <div className="week-item col s3">
                                  <h6 className="purple-text bold truncate" title={event[0].title}>{event[0].title}</h6>
                                  <div className="time truncate">{ event[0].startTime !== "" ? <span>{event[0].startTime} - {event[0].endTime}</span> : null}</div>
                                </div>
                                <div className="week-item col s3">
                                  <h6 className="purple-text bold truncate" title={event[1].title}>{event[1].title}</h6>
                                  <div className="time truncate">{ event[1].startTime !== "" ? <span>{event[1].startTime} - {event[1].endTime}</span> : null}</div>
                                </div>
                                <div className="week-item col s3">
                                  <h6 className="purple-text bold truncate" title={event[2].title}>{event[2].title}</h6>
                                  <div className="time truncate">{ event[2].startTime !== "" ? <span>{event[2].startTime} - {event[2].endTime}</span> : null}</div>
                                </div>
                                <div className="week-item col s3">
                                  <h6 className="purple-text bold truncate" title={event[3].title}>{event[3].title}</h6>
                                  <div className="time truncate">{ event[3].startTime !== "" ? <span>{event[3].startTime} - {event[3].endTime}</span> : null}</div>
                                </div>
                              </div>;
      }
      return  weekItemNodeEntries;
    }.bind(this));
    return weekItemNodes;
  },
  weekView: function(){
    return <div>
      <div className="row weekdays">
        {this.weekdayHeader()}
      </div>
      <div className="week">
        <div className="row">
          {this.weekItems()}
        </div>
      </div>
      <div className="week-navigation clear row">
        <div className="last-week col s5" onClick={this.previousWeek}><i className="fa fa-chevron-left"></i> <span>Last week</span></div>
        <div className="col s2 center-align calendar-spinner">{this.state.loading ? <i className="fa fa-spinner fa-spin"></i> : "·"}</div>
        <div className="next-week col s5 right-align" onClick={this.nextWeek}><span>Next week</span><i className="fa fa-chevron-right"></i></div>
      </div>
    </div>
  },
  render: function(){
    return  <div>
              {!this.state.hasEvents ? this.weekView() : <h2 className="center-align">There's nothing on your calendar</h2> }
            </div>
  }
});
