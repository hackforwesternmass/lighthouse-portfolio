var LinkedStateMixin = React.addons.LinkedStateMixin;

var ResumeEntries = React.createClass({
  getInitialState: function(){
    return { resumeEntries: [], newResumeEntry: false };
  },
  componentDidMount: function(){
    $.getJSON( "/resume_entries", function(resumeEntries){
      this.setState({ resumeEntries: resumeEntries });
    }.bind(this));
  },
  save: function(){
    $.getJSON( "/resume_entries", function(resumeEntries){
      this.setState({ resumeEntries: resumeEntries, newResumeEntry: false });
    }.bind(this));
  },
  close: function(e){
    e.preventDefault();
    this.setState({ newResumeEntry: false });
  },
  addnewResumeEntry: function(e){
    e.preventDefault();
    this.setState({ newResumeEntry: true });
  },
  render: function(){

    var resumeEntryNodes = this.state.resumeEntries.map(function(resumeEntry){
      return <ResumeEntries.ResumeEntry {...this.props} resumeEntry={resumeEntry} key={resumeEntry.id} save={this.save} />
    }.bind(this));

    return  <div>
              {resumeEntryNodes}
              {!this.state.newResumeEntry ? <a href="#" onClick={this.addnewResumeEntry} className="btn" style={{backgroundColor: this.props.profile_color}}>Add Resume Entry</a> : null}
              {this.state.newResumeEntry ? <ResumeEntries.ResumeEntryForm {...this.props} resumeEntry={{}} save={this.save} close={this.close} newResumeEntry={this.state.newResumeEntry}/> : null}
            </div>;

  }

});

ResumeEntries.ResumeEntry = React.createClass({
  getInitialState: function(){
    return { resumeEntry: this.props.resumeEntry, editing: false };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({ resumeEntry: nextProps.resumeEntry });
  },
  toggleEdit: function(e){
    e.preventDefault();
    this.setState({ editing: !this.state.editing });
  },
  render: function(){

    var mainContent;

    if(this.state.editing){
      mainContent = <ResumeEntries.ResumeEntryForm {...this.props} resumeEntry={this.state.resumeEntry} toggleEdit={this.toggleEdit} save={this.props.save}/>
    }else{
      mainContent = <ResumeEntries.ResumeEntryShow {...this.props} resumeEntry={this.state.resumeEntry} toggleEdit={this.toggleEdit} />
    }

    return <div>{mainContent}</div>;
  }

});

ResumeEntries.ResumeEntryShow = React.createClass({
  getInitialState: function(){
    return { resumeEntry: this.props.resumeEntry};
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({ resumeEntry: nextProps.resumeEntry});
  },
  delete: function(e){
    e.preventDefault();
    $.ajax({
      url: "/resume_entries/" + this.props.resumeEntry.id ,
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

    var e = this.state.resumeEntry;

    return <div className="entry">
              <div className="title">
                {this.state.resumeEntry.title}
                <span className="secondary-content">
                  <a href="#" onClick={this.props.toggleEdit}><i className="fa fa-pencil-square-o" style={{color: this.props.profile_color}}></i></a>
                  {' '}<a href="#" rel="nofollow" onClick={this.delete} ><i className="fa fa-trash" style={{color: this.props.profile_color}}></i></a>
                </span>
              </div>

              <div className="sub-title">
                {this.state.resumeEntry.subtitle ? <div> {this.state.resumeEntry.subtitle} </div> : null}
                {this.state.resumeEntry.date} 
              </div>

              <div className="description">
                {this.state.resumeEntry.description}
              </div>
            </div>;
  }
});

ResumeEntries.ResumeEntryForm = React.createClass({
  mixins: [LinkedStateMixin],
  getInitialState: function(){
    return { id: this.props.resumeEntry.id,
             title: this.props.resumeEntry.title,
             subtitle: this.props.resumeEntry.subtitle,
             description: this.props.resumeEntry.description,
             date: this.props.resumeEntry.date,
             resumeEntry: this.props.resumeEntry,
             sendingForm: false,
             success: false,
             error: false };
  },
  closeForm: function(e){
    if(this.props.newResumeEntry){
      this.props.close(e);
    }else{
      this.props.toggleEdit(e);
    }
  },
  submitForm: function(e){
    e.preventDefault();

    var errorMessages = {};

    if(!this.state.title) errorMessages.title = "Title is required."
    if(!this.state.description) errorMessages.description = "Description is required."
    if(!this.state.date) errorMessages.date = "Date is required."

    if(Object.keys(errorMessages).length > 0){
      this.setState({error: true, success: false, errorMessages: errorMessages }); 
      return false;     
    }

    var url, type;

    if(this.props.newResumeEntry){
        url = "/resume_entries";
        type = "POST";
    } else {
        url = "/resume_entries/"+ this.state.id ;
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

    return <form acceptCharset="UTF-8" onSubmit={this.submitForm}>
              <input name="utf8" type="hidden" value="✓"/>
              <input type="hidden" name="authenticity_token" value={this.props.authenticityToken} />

              <div className="row">
                <div className="input-field col s12">
                  <label htmlFor="resume_entry_title" className="active">Title</label>
                  <input valueLink={this.linkState('title')} type="text" name="resume_entry[title]" id="resume_entry_title" placeholder="Web Developer"/>
                  {(this.state.error && this.state.errorMessages.title) ? <div className="error-message"> {this.state.errorMessages.title} </div> : null}
                </div>
              </div>

              <div className="row">
                <div className="input-field col s12">
                  <label htmlFor="resume_entry_subtitle" className="active">Subtitle</label>
                  <input valueLink={this.linkState('subtitle')} type="text" name="resume_entry[subtitle]" id="resume_entry_subtitle" placeholder="BiteSite"/>
                  {(this.state.error && this.state.errorMessages.subtitle) ? <div className="error-message"> {this.state.errorMessages.subtitle} </div> : null}
                </div>
              </div>

              <div className="row">
                <div className="input-field col s12">
                  <label htmlFor="resume_entry_date" className="active">Date</label>
                  <input valueLink={this.linkState('date')} type="text" name="resume_entry[date]" id="resume_entry_date" placeholder="September 2015 - Present"/>
                  {(this.state.error && this.state.errorMessages.date) ? <div className="error-message"> {this.state.errorMessages.date} </div> : null}
                </div>
              </div>

              <div className="row">
                <div className="input-field col s12">
                  <label htmlFor="resume_entry_description" className="active">Description</label>
                  <textarea valueLink={this.linkState('description')} className="materialize-textarea" name="resume_entry[description]" id="resume_entry_description" placeholder="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."/>
                  {(this.state.error && this.state.errorMessages.description) ? <div className="error-message"> {this.state.errorMessages.description} </div> : null}
                </div>
              </div>

              <div className="row">
                <div className="input-field col s12">
                  <button name="commit" type="submit" className="btn" style={{backgroundColor: this.props.profile_color}}>{this.state.sendingForm ? <i className="fa fa-spinner fa-spin"></i> : "Save" }</button>
                  {' '}<button className="red darken-1 btn" onClick={this.closeForm} name="button" type="button" >Close</button>
                  {this.state.success ? <span className="success">Resume updated!</span> : null}
                  {this.state.error ? <span className="error">Resume failed to update!</span> : null}
                </div>
              </div>

            </form>
  }
});


