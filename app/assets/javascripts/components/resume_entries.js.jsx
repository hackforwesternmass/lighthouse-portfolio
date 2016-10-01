const LinkedStateMixin = React.addons.LinkedStateMixin;

const ResumeEntries = React.createClass({
  getInitialState(){
    return { resumeEntries: [], newResumeEntry: false };
  },
  componentDidMount(){
    this.loadResumeEntries();
  },
  loadResumeEntries(){
    $.getJSON(`/users/${this.props.user_id}/resume_entries`, resumeEntries => {
      this.setState({ resumeEntries, newResumeEntry: false });
    });
  },
  save(){
    this.loadResumeEntries();
  },
  close(e){
    e && e.preventDefault();
    this.setState({ newResumeEntry: false });
  },
  addnewResumeEntry(e){
    e.preventDefault();
    this.setState({ newResumeEntry: true });
  },
  render(){
    return(
      <div className='thin-container'>
        {
          this.state.resumeEntries.map((resumeEntry, i) => {
            return <ResumeEntries.ResumeEntry {...this.props} resumeEntry={resumeEntry} key={resumeEntry.id} save={this.save} />
          })
        }
        {
          this.state.newResumeEntry
          ? <ResumeEntries.ResumeEntryForm {...this.props} resumeEntry={{}} save={this.save} close={this.close} newResumeEntry={this.state.newResumeEntry}/>
          : <a href='#' onClick={this.addnewResumeEntry} className='btn'>Add Resume Entry</a>
        }
      </div>
    );
  }
});

ResumeEntries.ResumeEntry = React.createClass({
  getInitialState(){
    return { editing: false };
  },
  toggleEdit(e){
    e && e.preventDefault();
    this.setState({ editing: !this.state.editing });
  },
  render(){
    return(
      <div>
        {
          this.state.editing
          ? <ResumeEntries.ResumeEntryForm {...this.props} toggleEdit={this.toggleEdit} />
          : <ResumeEntries.ResumeEntryShow {...this.props} toggleEdit={this.toggleEdit} />
        }
      </div>
    );
  }

});

ResumeEntries.ResumeEntryShow = React.createClass({
  delete(e){
    e.preventDefault();

    if(!confirm('Are you sure you would like to remove this resume entry?')){
      return false;
    }

    $.ajax({
      url: `/users/${this.props.user_id}/resume_entries${this.props.resumeEntry.id}`,
      dataType: 'JSON',
      type: 'DELETE',
      success: () => {
        Materialize.toast('Resume entry successfully deleted!', 3500, 'teal');
        this.props.save();
      },
      error: () => {
        Materialize.toast('Failed to delete resume entry', 3500, 'red darken-4');
      }
    });
  },
  render(){
    const { title, subtitle, date, description } = this.props.resumeEntry;
    return(
      <div className='entry'>
        <div className='title'>
          {title}
          <span className='secondary-content'>
            <a href='#' onClick={this.props.toggleEdit}><i className='fa fa-pencil-square-o'></i></a>
            {' '}<a href='#' rel='nofollow' onClick={this.delete} ><i className='fa fa-trash'></i></a>
          </span>
        </div>

        <div className='sub-title'>
          {subtitle && <div> {subtitle} </div>}
          {date}
        </div>

        <div className='description' dangerouslySetInnerHTML={{__html: description}}></div>
      </div>
    );
  }
});

ResumeEntries.ResumeEntryForm = React.createClass({
  getInitialState(){
    return {
             sendingForm: false,
             success: false,
             error: false
           };
  },
  componentDidMount(){
    tinymce.remove();
    initTiny();
  },
  closeForm(){
    if(this.props.newResumeEntry){
      this.props.close();
    }else{
      this.props.toggleEdit();
    }
  },
  submitForm(e){
    e.preventDefault();
    tinymce.get('resume_entry_description').save();

    let url, type;

    if(this.props.newResumeEntry){
        url = `/users/${this.props.user_id}/resume_entries`;
        type = 'POST';
    } else {
        url = `/users/${this.props.user_id}/resume_entries/${this.props.resumeEntry.id}`;
        type = 'PATCH';
    }

    this.setState({ sendingForm: true });
    $.ajax({
      url: url,
      dataType: 'JSON',
      type: type,
      cache: false,
      contentType: false,
      processData: false,
      data: new FormData(e.currentTarget),
      success: data => {
        Materialize.toast('Resume entry successfully saved!', 3500, 'teal');
        this.setState({ sendingForm: false, error: false });
        this.props.save();
        this.closeForm();
      },
      error: error => {
        Materialize.toast('Failed to update resume entry', 3500, 'red darken-4');
        if(error.status === 422){
          this.setState({ sendingForm: false, error: true, success: false, errorMessages: error.responseJSON });
        }else{
          this.setState({ sendingForm: false, error: true, success: false });
        }
      }
    });
  },
  render(){
    const { title, date, subtitle, description } = this.props.resumeEntry;
    const { success, error, errorMessages, sendingForm } = this.state;
    return(
      <form acceptCharset='UTF-8' onSubmit={this.submitForm}>
        <input name='utf8' type='hidden' value='✓'/>
        <input type='hidden' name='authenticity_token' value={this.props.authenticityToken} />

        <div className='row'>
          <div className='input-field col s12'>
            <label htmlFor='resume_entry_title' className='active'>Title</label>
            <input defaultValue={title} type='text' name='resume_entry[title]' id='resume_entry_title' placeholder='Web Developer'/>
            {error && errorMessages.title && <div className='error-message'> {errorMessages.title} </div>}
          </div>
        </div>

        <div className='row'>
          <div className='input-field col s12 m6'>
            <label htmlFor='resume_entry_subtitle' className='active'>Organization</label>
            <input defaultValue={subtitle} type='text' name='resume_entry[subtitle]' id='resume_entry_subtitle' placeholder='BiteSite'/>
            {error && errorMessages.subtitle && <div className='error-message'> {errorMessages.subtitle} </div>}
          </div>

          <div className='input-field col s12 m6'>
            <label htmlFor='resume_entry_date' className='active'>Date</label>
            <input defaultValue={date} type='text' name='resume_entry[date]' id='resume_entry_date' placeholder='September 2015 - Present'/>
            {(error && errorMessages.date) && <div className='error-message'> {errorMessages.date} </div>}
          </div>
        </div>

        <div className='row'>
          <div className='input-field col s12'>
            <textarea defaultValue={description} className='tinymce' name='resume_entry[description]' id='resume_entry_description' placeholder='Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'/>
            {(error && errorMessages.description) && <div className='error-message'> {errorMessages.description} </div>}
          </div>
        </div>

        <div className='row'>
          <div className='input-field col s12'>
            <button name='commit' type='submit' className='btn'>{sendingForm ? <i className='fa fa-spinner fa-spin' style={{paddingRight: 0}} ></i> : 'Save' }</button>
            {' '}<button className='red darken-3 btn' onClick={this.closeForm} name='button' type='button' >Close</button>
            {success && <span className='success'>Resume updated!</span>}
            {error && <span className='error'>Resume failed to update!</span>}
          </div>
        </div>
      </form>
    );
  }
});
