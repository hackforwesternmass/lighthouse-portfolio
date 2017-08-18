const ClassPeriods = React.createClass({
  getInitialState(){
    return { classPeriodEntries: [], newClassPeriodEntry: false };
  },
  componentDidMount(){
    this.loadClassPeriods();
  },
  loadClassPeriods(){
    $.ajax({
      url: '/class_periods',
      success: classPeriodEntries => {
        this.setState({ classPeriodEntries, newClassPeriodEntry: false });
      }
    });
  },
  close(e){
    e && e.preventDefault();
    this.setState({ newClassPeriodEntry: false });
  },
  addNewClassPeriodEntry(e){
    e.preventDefault();
    this.setState({ newClassPeriodEntry: true });
  },
  render(){
    return(
      <div className='row'>
        {
          this.state.classPeriodEntries.map(classPeriodEntry => {
            return <ClassPeriods.ClassPeriodEntry {...this.props} classPeriodEntry={classPeriodEntry} key={classPeriodEntry.id} loadClassPeriods={this.loadClassPeriods} />
          })
        }
        <br/>
        {!this.state.newClassPeriodEntry && <a href='#' onClick={this.addNewClassPeriodEntry} className='btn' style={{marginLeft: '0.75rem'}}>Add Period</a>}
        {this.state.newClassPeriodEntry && <ClassPeriods.ClassPeriodEntryForm {...this.props} classPeriodEntry={{}} loadClassPeriods={this.loadClassPeriods} close={this.close} newClassPeriodEntry={this.state.newClassPeriodEntry}/>}
      </div>
    );
  }
});

ClassPeriods.ClassPeriodEntry = React.createClass({
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
            ? <ClassPeriods.ClassPeriodEntryForm {...this.props} toggleEdit={this.toggleEdit} />
          : <ClassPeriods.ClassPeriodEntryShow {...this.props} toggleEdit={this.toggleEdit} />
        }
      </div>
    );
  }
});

ClassPeriods.ClassPeriodEntryShow = React.createClass({
  delete(e){
    e.preventDefault();
    $.ajax({
      url: `/class_periods/${this.props.classPeriodEntry.id}`,
      type: 'DELETE',
      success: () => {
        this.props.loadClassPeriods();
      },
      error: () => {
        Materialize.toast('Failed to delete resume entry', 3500, 'red darken-3');
      }
    });
  },
  render(){
    const { start_time, end_time } = this.props.classPeriodEntry;
    return(
      <div className='entry' style={{padding: '0 0.75rem', fontSize: 16, maxWidth: 500}}>
        <div>
          {start_time} - {end_time}
          <span className='secondary-content'>
            <a href='#' onClick={this.props.toggleEdit}><i className='fa fa-pencil-square-o'></i></a>
            {' '}<a href='#' rel='nofollow' onClick={this.delete} ><i className='fa fa-trash'></i></a>
          </span>
        </div>
      </div>
    );
  }
});

ClassPeriods.ClassPeriodEntryForm = React.createClass({
  getInitialState(){
    return {
             sendingForm: false,
             success: false,
             error: false
           };
  },
  closeForm(e){
    e && e.preventDefault();
    if(this.props.newClassPeriodEntry){
      this.props.close();
    }else{
      this.props.toggleEdit();
    }
  },
  submitForm(e){
    e.preventDefault();

    let url, type;

    if(this.props.newClassPeriodEntry){
        url = '/class_periods';
        type = 'POST';
    } else {
        url =   `/class_periods/${this.state.id}`;
        type = 'PATCH';
    }

    this.setState({ sendingForm: true });
    $.ajax({
      url,
      type,
      contentType: false,
      processData: false,
      data: new FormData(e.currentTarget),
      success: () => {
        this.setState({ sendingForm: false, error: false });
        this.props.loadClassPeriods();
        this.closeForm();
      },
      error: (data) => {
        Materialize.toast('Failed to update class period', 3500, 'red darken-3');
        if(data.status === 422){
          this.setState({sendingForm: false, error: true, errorMessages: data.responseJSON });
        }else{
          this.setState({sendingForm: false, error: true });
        }
      }
    });
  },
  render() {
    const { start_time, end_time } = this.props.classPeriodEntry;
    return(
      <form acceptCharset='UTF-8' onSubmit={this.submitForm} style={{ maxWidth: 500 }}>
        <input name='utf8' type='hidden' value='✓'/>

        <div className='row'>
          <div className='input-field col s12 m6'>
            <label htmlFor='class_period_start_time' className='active'>Start Time</label>
            <input defaultValue={start_time} type='text' name='class_period[start_time]' id='class_period_start_time' placeholder='11:30'/>
            {this.state.error && this.state.errorMessages.startTime && <div className='error-message'> {this.state.errorMessages.startTime} </div>}
          </div>

          <div className='input-field col s12 m6'>
            <label htmlFor='class_period_end_time' className='active'>End Time</label>
            <input defaultValue={end_time} type='text' name='class_period[end_time]' id='class_period_end_time' placeholder='12:59'/>
            {this.state.error && this.state.errorMessages.endTime && <div className='error-message'> {this.state.errorMessages.endTime} </div>}
          </div>
        </div>

        <div className='row'>
          <div className='input-field col s12'>
            <button name='commit' type='submit' className='btn'>{this.state.sendingForm ? <i className='fa fa-spinner fa-spin'></i> : 'Save' }</button>
            {' '}<button className='red darken-1 btn' onClick={this.closeForm} name='button' type='button' >Close</button>
            {this.state.error && <span className='error'>Period failed to update!</span>}
          </div>
        </div>

      </form>
    );
  }
});
