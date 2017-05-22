const KlassesDisplay = React.createClass({
  getInitialState() {
    return { currentKlasses: [], pastKlasses: [], loadingCurrentKlasses: true, loadingPastKlasses: true };
  },
  componentDidMount() {
    $('.modal').modal();

    $.ajax({
      url: `/users/${this.props.userId}/classes`,
      data: { current: true },
      success: currentKlasses => {
        this.setState({ currentKlasses, loadingCurrentKlasses: false });
      },
      error: () => {
        Materialize.toast('An error has occured loading enrolled classes.', 3500, 'red darken-3');
      }
    });

    $.ajax({
      url: `/users/${this.props.userId}/classes`,
      data: { past: true },
      success: pastKlasses => {
        this.setState({ pastKlasses, loadingPastKlasses: false });
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
      <div className='left'>
        <div className='klasses hide-on-small-only'>
          <div className='header'>
            Classes
          </div>
          <ul ref='currentKlasses'>
            {
              !this.state.loadingCurrentKlasses && this.state.currentKlasses.length === 0 &&
                <li>You are currently not enrolled in any classes</li>
            }
            {
              this.state.currentKlasses.map(klass => {
                return <KlassesDisplay.Show klass={klass} key={klass.id} openModal={this.openModal}/>
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
              {
                this.state.description &&
                  <div dangerouslySetInnerHTML={{ __html: this.state.description.replace(/\n\r?/g, '<br>') }} ></div>
              }
              {
                this.state.google_drive_url &&
                  <div style='padding-top: 20px;'>
                    <a href={this.state.google_drive_url}><i className='fa fa-folder-open'></i>Google Drive</a>
                  </div>
              }
            </div>
          </div>
        </div>
        <div className='klasses hide-on-small-only' style={{marginBottom: 30}}>
          {
            !this.state.loadingPastKlasses && this.state.pastKlasses.length > 0 &&
              <div className='header'>
                Past Classes
              </div>
          }

          {
            !this.state.loadingPastKlasses &&
              <ul ref='pastKlasses'>
                {
                  this.state.pastKlasses.map(klass => {
                    return <KlassesDisplay.Show klass={klass} key={klass.id} openModal={this.openModal}/>
                  })
                }
              </ul>
          }

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
              {
                this.state.description &&
                  <div dangerouslySetInnerHTML={{ __html: this.state.description.replace(/\n\r?/g, '<br>') }} ></div>
              }
              {
                this.state.google_drive_url &&
                  <div style='padding-top: 20px;'>
                    <a href={this.state.google_drive_url}><i className='fa fa-folder-open'></i>Google Drive</a>
                  </div>
              }
            </div>
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
    return <a href='#' onClick={this.triggerMeetingModal}><li>{this.props.klass.name}</li></a>
  }
});
