var update = React.addons.update;

var Students = React.createClass({
  getInitialState: function(){
    return { students: [], klasses: [] };
  },
  componentDidMount: function(){
    $.getJSON("/users", function(data){ this.setState({ students: data }); }.bind(this));
    $.getJSON("/class", function(data){ this.setState({ klasses: data }); }.bind(this));
  },
  search: function(params){
    $.getJSON("/users/search", params).done(function(data){ this.setState({students: data }); }.bind(this));
  },
  students: function(){

  },
  render: function(){
    return  <section id="students" className="section-container">
              <Students.Search search={this.search} />
              <Students.Index {...this.props} students={this.state.students} klasses={this.state.klasses} search={this.search}/>
            </section>;
  }
});

Students.Search = React.createClass({
  searchText: function(e){
    this.props.search({ q: e.target.value });
  },
  render: function(){
    return  <div className="row grey-text text-darken-2">
              <div className="input-field col s12 m9">
                <i className="fa fa-search prefix"></i>
                <input id="student-search" className="search" type="text" onChange={this.searchText}/>
                <label htmlFor="student-search" className="">Search</label>
              </div>

              <div className="input-field col s12 m3">
                <a className="btn" href="/users/new?role=student">
                  <i className="fa fa-plus no-padding"></i> Register New
                </a>
              </div>
            </div>;
  }
});

Students.Index = React.createClass({
  getInitialState: function(){
    return { id: "", meetingTime: "", klassIds: [] }
  },
  openModal: function(modal, state){
    this.setState(state);
    $(modal).openModal();
  },
  componentDidMount: function(){
    $('.modal-trigger').leanModal();
  },
  changeMeetingTime: function(e){
    this.setState({ meetingTime: e.target.value });
  },
  meetingTimeSubmit: function(e){
    e.preventDefault();
    $.ajax({
      url: "/users/" + this.state.id,
      dataType: "JSON",
      type: "PATCH",
      data: {user: { meeting_time: this.state.meetingTime} },
      success: function(data) {
        $("#meeting-time-modal").closeModal();
        this.props.search({}); // Re-renders students index
      }.bind(this),
      error: function(data) {
        Materialize.toast("Failed to update meeting time.", 3500, "red darken-4");
      }
    });
  },
  enrollSubmit: function(e){
    e.preventDefault();
    $.ajax({
      url: "/enrolls/bulk_create",
      dataType: "JSON",
      type: "POST",
      data: {user_id: this.state.id, klass_ids: this.state.klassIds },
      success: function(data) {
        $("#enroll-modal").closeModal();
        this.props.search({}); // Re-renders students index
      }.bind(this),
      error: function(data) {
        Materialize.toast("Failed to enroll student to class", 3500, "red darken-4");
      }
    });
  },
  addKlassId: function(e){
    var val = e.currentTarget.value;
    var index = this.state.klassIds.indexOf(val);
    if(index > -1){
      this.setState({ klassIds: update(this.state.klassIds, { $splice: [[index, 1]] }) });
    }else{
      this.setState({ klassIds: update(this.state.klassIds, { $push: [val] }) });
    }
  },
  students: function(){
    var studentNodes = this.props.students.map(function(student){
      return <Students.Show {...this.props}  key={student.id} student={student} openModal={this.openModal}/>;
    }.bind(this));
    return studentNodes;
  },
  klasses: function(){
    var klassNodes = this.props.klasses.map(function(klass){
      return  <div className="input-field col s12" key={klass.id}>
                <input type="checkbox" id={"check-" + klass.id} value={klass.id} onChange={this.addKlassId} checked={this.state.klassIds.indexOf(String(klass.id)) > -1 ? "checked" : null }/>
                <label htmlFor={"check-" + klass.id}>{klass.name}</label>
              </div>
    }.bind(this));
    return klassNodes;
  },
  render: function(){
    return  <div>
              <table className="bordered z-depth-1">
                <thead className="grey darken-4 white-text">
                  <tr className="grey darken-4 white-text">
                      <th className="student-name">NAME</th>
                      <th>ACCOUNT</th>
                      <th>ENROLL</th>
                      <th>MEETING TIME</th>
                    </tr>
                </thead>

                <tbody>
                  {this.students()}
                </tbody>
              </table>
              <div id="meeting-time-modal" className="modal" style={{ maxWidth: 500 }}>
                <div className="modal-content">
                  <h4>Set Meeting Time</h4>
                  <form className="edit_user_meeting" acceptCharset="UTF-8" onSubmit={this.meetingTimeSubmit}>
                      <div className="row">
                        <div className="input-field col s12">
                          <input type="text" value={this.state.meetingTime} onChange={this.changeMeetingTime} name="user[meeting_time]" placeholder="ex. 1:30PM Friday" id="user_meeting_time"/>
                          <label htmlFor="user_meeting_time" className="active">Meeting time</label>
                        </div>
                      </div>
                  </form>
                  <a href="#" onClick={this.meetingTimeSubmit} style={{ width: "100%" }} className="btn modal-action modal-close waves-effect">Set</a>
                </div>
              </div>
              <div id="enroll-modal" className="modal" style={{ maxWidth: 700 }}>
              <div className="modal-content">
                <h4>Enroll Class</h4>
                <form className="edit_user_meeting" acceptCharset="UTF-8" onSubmit={this.enrollSubmit}>
                    <input type="hidden" name="enroll[user_id]" value={this.state.id} />
                    <div className="row">
                      {this.klasses()}
                    </div>
                </form>
                <br/>
                <a href="#" onClick={this.enrollSubmit} style={{ width: "100%" }} className="btn modal-action modal-close waves-effect">Save</a>
              </div>
            </div>
            </div>;
  }
});

Students.Show = React.createClass({
  triggerMeetingModal: function(e){
    e.preventDefault();
    this.props.openModal("#meeting-time-modal", { id: this.props.student.id, meetingTime: this.props.student.meeting_time });
  },
  triggerEnrollModal: function(e){
    e.preventDefault();
    var klassIds = this.props.student.enrolls.map(function(enroll){
      return String(enroll.klass_id);
    });
    this.props.openModal("#enroll-modal", { id: this.props.student.id, klassIds: klassIds });
  },
  render: function(){
    return <tr key={this.props.student.id}>
              <td className="student-name name"><a href={"/access_student?student_id=" + this.props.student.id}>{this.props.student.first_name +" "+ this.props.student.last_name}</a></td>
              <td><a href={"/users/"+ this.props.student.id +"/edit?role=student"}><i className="fa fa-pencil"></i></a></td>
              <td><a href="#"><i className="fa fa-user modal-trigger" onClick={this.triggerEnrollModal}></i></a></td>
              <td><a href="#" className="modal-trigger" onClick={this.triggerMeetingModal}><i className="fa fa-calendar-o"></i> {this.props.student.meeting_time}</a></td>
            </tr>;
  }
});
