var KlassesDisplay = React.createClass({
  getInitialState: function() {
    return { klasses: [], name: "", description: "", instructor: "" };
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
    return   <div className="courses hide-on-small-only">
              <div className="header">
                Courses
              </div>
              <ul>
                {this.klasses()}
              </ul>

              <div id="course-modal" className="modal">
                <div className="modal-content">
                  <h4 className="align-center">{this.state.name}</h4>
                  <h6>{this.state.instructor}</h6>
                  <br/>
                  <div>{this.state.description}</div>
                </div>
              </div>

            </div>
  }
});

KlassesDisplay.Show = React.createClass({
  triggerMeetingModal: function(e){
    e.preventDefault();
    this.props.openModal("#course-modal", { name: this.props.klass.name, 
                                            description: this.props.klass.description,
                                            instructor: this.props.klass.instructor });
  },
  render: function(){
    return <li onClick={this.triggerMeetingModal}>{this.props.klass.name}</li>
  }
});