const ApplicationSettings = React.createClass({
  getInitialState() {
    return { applicationSettings: {} }
  },
  componentDidMount() {
    this.loadApplicationSettings();
  },
  loadApplicationSettings() {
    $.ajax({
      url: '/application_settings',
      success: applicationSettings => {
        this.setState({ applicationSettings }, () => {
          Materialize.updateTextFields();
        });
      },
      error: () => {
        Materialize.toast('An error has occured loading application settings.', 3500, 'red darken-3');
      }
    });
  },
  save() {
    $.ajax({
      url: '/application_settings',
      type: 'PATCH',
      contentType: false,
      processData: false,
      data: new FormData(this.refs.form),
      success: applicationSettings => {
        this.setState({ applicationSettings });
      },
      error: () => {
        Materialize.toast('An error has occured loading application settings.', 3500, 'red darken-3');
      }
    });
  },
  render() {
    const { applicationSettings } = this.state;

    return(
      <div>

        <form ref='form' className='one-page' encType='multipart/form-data'>

          <h4 className='col-padding' style={{paddingBottom: 15}}>Feedback</h4>

          <div className='row'>
            <div className='col s12'>
              <label style={{fontSize: 15, paddingBottom: 10, display: 'block'}} className='thin grey-text'>Hide Feedback Page</label>
              <div className='switch'>
                <label>
                  No
                  <input type='hidden' value='0' name='application_settings[hide_feedback]' />
                  <input type='checkbox' onChange={this.save} value='1' checked={applicationSettings.hide_feedback} name='application_settings[hide_feedback]' />
                  <span className='lever'></span>
                  Yes
                </label>
              </div>
            </div>
          </div>

          <h4 className='col-padding' style={{paddingBottom: 15}}>Login</h4>

          <div className='row'>
            <div className='file-field col s12 m7'>
              <div className='btn'>
                <span>Image</span>
                <input type='file' onChange={this.save} name='application_settings[home_background_image]' id='application_settings_image' />
              </div>
              <div className='file-path-wrapper'>
                <input className='file-path' type='text' placeholder='Upload home page backgroung image' value={applicationSettings.home_background_image_file_name} />
              </div>
            </div>
          </div>

          <h4 className='col-padding' style={{paddingBottom: 15, paddingTop: 15}}>Calendar</h4>

          <div className='row'>
            <div className='col s12'>
              <label style={{fontSize: 15, paddingBottom: 10, display: 'block'}} className='thin grey-text'>Hide Calendar Page</label>
              <div className='switch'>
                <label>
                  No
                  <input type='hidden' value='0' name='application_settings[hide_calendar]' />
                  <input type='checkbox' onChange={this.save} value='1' checked={applicationSettings.hide_calendar} name='application_settings[hide_calendar]' />
                  <span className='lever'></span>
                  Yes
                </label>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col s12'>
              <label style={{fontSize: 15, paddingBottom: 10, display: 'block'}} className='thin grey-text'>Hide Week View</label>
              <div className='switch'>
                <label>
                  No
                  <input type='hidden' value='0' name='application_settings[hide_week_view]' />
                  <input type='checkbox' onChange={this.save} value='1' checked={applicationSettings.hide_week_view} name='application_settings[hide_week_view]' />
                  <span className='lever'></span>
                  Yes
                </label>
              </div>
            </div>
          </div>


          <div className='row'>
            <div className='input-field col s12 m7'>
              <input type='text' id='calendar_id' value={applicationSettings.calendar_id} name='application_settings[calendar_id]'/>
              <label htmlFor='calendar_id'>Calendar Id</label>
            </div>
          </div>

          <div className='row'>
            <div className='input-field col s12 m7'>
              <input type='text' id='calendar_url' value={applicationSettings.calendar_url} name='application_settings[calendar_url]'/>
              <label htmlFor='calendar_url'>Calendar Url</label>
            </div>
          </div>
        </form>

        <h4 className='col-padding' style={{paddingBottom: 15, paddingTop: 15}}>Class Periods</h4>

        <ClassPeriods />

      </div>
    )
  }
});
