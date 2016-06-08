var KlassesDisplay = React.createClass({
  getInitialState: function() {
    return { klasses: [] };
  },
  componentDidMount: function() {
    $.getJSON("/class/user_index", function(data){
      this.setState({ klasses: data });
    }.bind(this));
  },
  openModal: function(modal, state){
    this.setState(state);
    $(modal).openModal();
  },
  klasses: function(){
    var klassNodes = this.state.klasses.map(function(klass){
      return <KlassesDisplay.Show klass={klass} key={klass.id} openModal={this.openModal}/>;
    }.bind(this));
    return klassNodes;
  },
  render: function() {
    return   <div className="klasses hide-on-small-only">
      <div className="header">
        Classes
      </div>
      <ul>
        {this.klasses()}
      </ul>

      <div id="klasse-modal" className="modal">
        <div className="modal-content">
          <h4 className="align-center">{this.state.name}</h4>
          <h6>
            {this.state.instructor}
            {this.state.instructor_email ? <small><br/><a href={"mailto:" + this.state.instructor_email}>{this.state.instructor_email}</a></small> : null}<br/>
          <small>{this.state.weekday + " " + this.state.time}</small><br/>
          <small>{this.state.location}</small>
        </h6>
        <br/>
        <div>{this.state.description}</div>
        {this.state.google_drive_url ? <div><br/><a href={this.state.google_drive_url}><i className="fa fa-folder-open"></i>Google Drive</a></div> : null}
      </div>
    </div>

  </div>
}
});

KlassesDisplay.Show = React.createClass({
  triggerMeetingModal: function(e){
    e.preventDefault();
    this.props.openModal("#klasse-modal", { name: this.props.klass.name,
    description: this.props.klass.description,
    location: this.props.klass.location,
    time: this.props.klass.time,
    weekday: this.props.klass.weekday,
    instructor: this.props.klass.instructor,
    instructor_email: this.props.klass.instructor_email,
    google_drive_url: this.props.klass.google_drive_url });
  },
  render: function(){
    return <li onClick={this.triggerMeetingModal}>{this.props.klass.name}</li>
  }
});
