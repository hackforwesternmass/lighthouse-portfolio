const KlassesDisplay = React.createClass({
  getInitialState() {
    return { klasses: [] };
  },
  componentDidMount() {
    $.getJSON('/class/user_index', klasses => {
      this.setState({ klasses });
    });
  },
  openModal(state) {
    this.setState(state);
    $('#klass-modal').openModal();
  },
  render() {
    return(
      <div className='klasses hide-on-small-only'>
        <div className='header'>
          Classes
        </div>
        <ul>
          {
            this.state.klasses.map(klass => {
              return <KlassesDisplay.Show klass={klass} key={klass.id} openModal={this.openModal}/>;
            })
          }
        </ul>

        <div id='klass-modal' className='modal'>
          <div className='modal-content'>
            <h4 className='align-center'>{this.state.name}</h4>
            <h6>
              {this.state.instructor}
              {this.state.instructor_email && <small><br/><a href={'mailto:' + this.state.instructor_email}>{this.state.instructor_email}</a></small>}<br/>
              <small>{`${this.state.weekday} ${this.state.time}`}</small><br/>
              <small>{this.state.location}</small>
            </h6>
            <br/>
            <div>{this.state.description}</div>
            {this.state.google_drive_url && <div><br/><a href={this.state.google_drive_url}><i className='fa fa-folder-open'></i>Google Drive</a></div>}
          </div>
        </div>
      </div>
    );
  }
});

KlassesDisplay.Show = React.createClass({
  triggerMeetingModal(e) {
    e.preventDefault();
    this.props.openModal(this.props.klass);
  },
  render() {
    return <li onClick={this.triggerMeetingModal}>{this.props.klass.name}</li>
  }
});
