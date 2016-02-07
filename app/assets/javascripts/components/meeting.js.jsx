var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Meeting = React.createClass({
  getInitialState: function() {
    return { newMeeting : false, meetings: [] };
  },
  componentDidMount: function() {
    var url = "/meetings";
    $.get(url, function(data){
      var meetings = $.map(data, function(obj){
        return { action_items: obj.meeting.action_items, created_at: obj.meeting.created_at, id: obj.meeting.id, notes: obj.meeting.notes, editing: false };
      });
      this.setState({ meetings : meetings });
    }.bind(this));
  },
  handleClickNewMeeting: function(e) {
    e.preventDefault();
    this.setState({  newMeeting : true });
  },
  closeAllMeetings: function(index){

    $.each(this.state.meetings, function(i,v){
      if(index !== i){
        v.editing = false;
      }else{
        v.editing = true;
      }
    });

    if(!isNaN(index)){
      this.setState({ meetings: this.state.meetings, newMeeting: false });
    }else{
      this.setState({ meetings: this.state.meetings });
    }
  },
  closeNewMeeting: function() {
    this.setState({ newMeeting : false });
  },
  updateMeetings: function(){
    var url = "/meetings";
    $.get(url, function(data){
      var meetings = $.map(data, function(obj){
        return { action_items: obj.meeting.action_items, created_at: obj.meeting.created_at, id: obj.meeting.id, notes: obj.meeting.notes, editing: false };
      });

      this.setState({ meetings : meetings });
    }.bind(this));
    this.closeNewMeeting();
  },
  render: function(){

    var newMeeting;

    if (this.state.newMeeting) {

      newMeeting = <NewMeeting {...this.props} closeNewMeeting={this.closeNewMeeting} updateMeetings={this.updateMeetings} closeAllMeetings={this.closeAllMeetings} />

    }else{

      newMeeting = <a href="#" onClick={this.handleClickNewMeeting} className="hide-on-small-only">
                      <div className="row">
                        <div className="col s12">
                          <div className="card blue darken-1 no-margin hoverable">
                            <div className="card-content white-text center-align">
                              <h6>START MEETING</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>

    }

    var meetingItemNodes = this.state.meetings.map(function(meeting, i){
      return (
        <MeetingItem {...this.props} meeting={meeting} key={i} reactKey={i} updateMeetings={this.updateMeetings} closeNewMeeting={this.closeNewMeeting} closeAllMeetings={this.closeAllMeetings}/>
      );
    }.bind(this));

    return (
      <div>
        {newMeeting}
        <ReactCSSTransitionGroup transitionName="fade-in" transitionEnterTimeout={350} transitionLeaveTimeout={350}>
          {meetingItemNodes}
        </ReactCSSTransitionGroup>
      </div>
    );

  }

});


