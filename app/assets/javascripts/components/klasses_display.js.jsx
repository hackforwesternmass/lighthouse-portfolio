const KlassesDisplay = React.createClass({
  getInitialState() {
    return { klasses: [] };
  },
  componentDidMount() {
    $('.modal').modal();
    $.ajax({
      url: `/users/${this.props.userId}/classes`,
      data: { current: true },
      success: klasses => {
        this.setState({ klasses, loading: false });
      },
      error: () => {
        Materialize.toast('An error has occured loading enrolled classes.', 3500, 'red darken-3');
      }
    });
  },
  openModal(klass) {
    this.setState(klass);
    $('#klass-modal').modal('open');
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
            <h4 className='align-center'><strong>{this.state.name}</strong></h4>
            <h6 style={{fontWeight: 400}} className='grey-text text-darken-1' >
              {this.state.instructor}
              {this.state.instructor_email && <small><br/><a href={'mailto:' + this.state.instructor_email}>{this.state.instructor_email}</a></small>}<br/>
              <small>{`${this.state.weekday} ${this.state.time}`}</small><br/>
              <small>{this.state.location}</small>
            </h6>
            <br/>
            {this.state.description && <div dangerouslySetInnerHTML={{ __html: this.state.description.replace(/\n\r?/g, '<br>') }} />}
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
