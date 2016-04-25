var LinkedStateMixin = React.addons.LinkedStateMixin;

var ClassPeriods = React.createClass({
  getInitialState: function(){
    return { classPeriodEntries: [], newClassPeriodEntry: false };
  },
  componentDidMount: function(){
    $.getJSON( "/class_periods", function(classPeriodEntries){
      this.setState({ classPeriodEntries: classPeriodEntries });
    }.bind(this));
  },
  save: function(){
    $.getJSON( "/class_periods", function(classPeriodEntries){
      this.setState({ classPeriodEntries: classPeriodEntries, newClassPeriodEntry: false });
    }.bind(this));
  },
  close: function(e){
    e.preventDefault();
    this.setState({ newClassPeriodEntry: false });
  },
  addNewClassPeriodEntry: function(e){
    e.preventDefault();
    this.setState({ newClassPeriodEntry: true });
  },
  render: function(){

    var classPeriodEntryNodes = this.state.classPeriodEntries.map(function(classPeriodEntry){
      return <ClassPeriods.ClassPeriodEntry {...this.props} classPeriodEntry={classPeriodEntry} key={classPeriodEntry.id} save={this.save} />
    }.bind(this));

    return  <div>
              {classPeriodEntryNodes}
              <br/>
              {!this.state.newClassPeriodEntry ? <a href="#" onClick={this.addNewClassPeriodEntry} className="teal btn" style={{marginLeft: "0.75rem"}}>Add Period</a> : null}
              {this.state.newClassPeriodEntry ? <ClassPeriods.ClassPeriodEntryForm {...this.props} classPeriodEntry={{}} save={this.save} close={this.close} newClassPeriodEntry={this.state.newClassPeriodEntry}/> : null}
            </div>;

  }

});

ClassPeriods.ClassPeriodEntry = React.createClass({
  getInitialState: function(){
    return { classPeriodEntry: this.props.classPeriodEntry, editing: false };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({ classPeriodEntry: nextProps.classPeriodEntry });
  },
  toggleEdit: function(e){
    e.preventDefault();
    this.setState({ editing: !this.state.editing });
  },
  render: function(){

    var mainContent;

    if(this.state.editing){
      mainContent = <ClassPeriods.ClassPeriodEntryForm {...this.props} classPeriodEntry={this.state.classPeriodEntry} toggleEdit={this.toggleEdit} save={this.props.save}/>
    }else{
      mainContent = <ClassPeriods.ClassPeriodEntryShow {...this.props} classPeriodEntry={this.state.classPeriodEntry} toggleEdit={this.toggleEdit} />
    }

    return <div>{mainContent}</div>;
  }

});

ClassPeriods.ClassPeriodEntryShow = React.createClass({
  getInitialState: function(){
    return { classPeriodEntry: this.props.classPeriodEntry};
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({ classPeriodEntry: nextProps.classPeriodEntry});
  },
  delete: function(e){
    e.preventDefault();
    $.ajax({
      url: "/class_periods/" + this.props.classPeriodEntry.id ,
      dataType: "JSON",
      type: "DELETE",
      success: function() {
        this.props.save();
      }.bind(this),
      error: function(data) {
        if(data.status === 406){
          // TODO
        }else{
          // TODO
        }
      }.bind(this)
    });
  },
  render: function(){

    var e = this.state.classPeriodEntry;

    return <div className="entry" style={{padding: "0 0.75rem", maxWidth: 500}}>
              <div className="title">
                {this.state.classPeriodEntry.start_time} - {this.state.classPeriodEntry.end_time}
                <span className="secondary-content">
                  <a href="#" onClick={this.props.toggleEdit}><i className="fa fa-pencil-square-o teal-text"></i></a>
                  {' '}<a href="#" rel="nofollow" onClick={this.delete} ><i className="fa fa-trash teal-text"></i></a>
                </span>
              </div>
            </div>;
  }
});

ClassPeriods.ClassPeriodEntryForm = React.createClass({
  mixins: [LinkedStateMixin],
  getInitialState: function(){
    return { id: this.props.classPeriodEntry.id,
             startTime: this.props.classPeriodEntry.start_time,
             endTime: this.props.classPeriodEntry.end_time,
             classPeriodEntry: this.props.classPeriodEntry,
             sendingForm: false,
             success: false,
             error: false };
  },
  closeForm: function(e){
    if(this.props.newClassPeriodEntry){
      this.props.close(e);
    }else{
      this.props.toggleEdit(e);
    }
  },
  submitForm: function(e){
    e.preventDefault();

    var errorMessages = {};

    if(!this.state.startTime) errorMessages.startTime = "Start time is required."
    if(!this.state.endTime) errorMessages.endTime = "End time is required."

    if(Object.keys(errorMessages).length > 0){
      this.setState({error: true, success: false, errorMessages: errorMessages }); 
      return false;     
    }

    var url, type;

    if(this.props.newClassPeriodEntry){
        url = "/class_periods";
        type = "POST";
    } else {
        url = "/class_periods/"+ this.state.id ;
        type = "PATCH";
    }

    this.setState({ sendingForm: true });
    $.ajax({
      url: url,
      dataType: "JSON",
      type: type,
      cache: false,
      contentType: false,
      processData: false,
      data: new FormData(e.currentTarget),
      success: function(data) {
        this.setState({ success: true, sendingForm: false, error: false });
        this.props.save(data);
        this.closeForm(e);
      }.bind(this),
      error: function(data) {
        if(data.status === 406){
          this.setState({ sendingForm: false, error: true, success: false, errorMessages: data.responseJSON });
        }else{
          this.setState({ sendingForm: false, error: true, success: false });
          //TODO
        }
      }.bind(this)
    });
  },
  render: function(){

    return <form acceptCharset="UTF-8" onSubmit={this.submitForm} style={{ maxWidth: 500 }}>
              <input name="utf8" type="hidden" value="✓"/>
              <input type="hidden" name="authenticity_token" value={this.props.authenticityToken} />

              <div className="row">
                <div className="input-field col s12 m6">
                  <label htmlFor="class_period_start_time" className="active">Start Time</label>
                  <input valueLink={this.linkState('startTime')} type="text" name="class_period[start_time]" id="class_period_start_time" placeholder="11:30"/>
                  {(this.state.error && this.state.errorMessages.startTime) ? <div className="error-message"> {this.state.errorMessages.startTime} </div> : null}
                </div>

                <div className="input-field col s12 m6">
                  <label htmlFor="class_period_end_time" className="active">End Time</label>
                  <input valueLink={this.linkState('endTime')} type="text" name="class_period[end_time]" id="class_period_end_time" placeholder="12:59"/>
                  {(this.state.error && this.state.errorMessages.endTime) ? <div className="error-message"> {this.state.errorMessages.endTime} </div> : null}
                </div>
              </div>

              <div className="row">
                <div className="input-field col s12">
                  <button name="commit" type="submit" className="teal btn">{this.state.sendingForm ? <i className="fa fa-spinner fa-spin"></i> : "Save" }</button>
                  {' '}<button className="red darken-1 btn" onClick={this.closeForm} name="button" type="button" >Close</button>
                  {this.state.success ? <span className="success">Period updated!</span> : null}
                  {this.state.error ? <span className="error">Period failed to update!</span> : null}
                </div>
              </div>

            </form>
  }
});


