var update = React.addons.update;

var Students = React.createClass({
  getInitialState() {
    return { students: [] };
  },
  componentDidMount() {
    this.loadStudents();
  },
  loadStudents(data = {}) {
    $.ajax({
      url: '/users',
      data,
      success: students => {
        this.setState({ students });
      }
    });
  },
  searchText(e) {
    this.search({ q: e.target.value });
  },
  render() {
    const { students } = this.state;
    return(
      <section id='students' className='section-container'>
        <div className='row grey-text text-darken-2'>
          <div className='input-field col s12 m9'>
            <i className='fa fa-search prefix'></i>
            <input id='student-search' className='search' type='text' onChange={this.searchText}/>
            <label htmlFor='student-search'>Search</label>
          </div>

          <div className='input-field col s12 m3'>
            <a className='btn' href='/users/new?role=student' style={{fontSize: 10}}>
              <i className='fa fa-plus no-padding' style={{fontSize: 10}}></i>Register New
            </a>
          </div>
        </div>
        <Students.Index {...this.props} students={students} loadStudents={this.loadStudents} />
      </section>
    )
  }
});

Students.Index = React.createClass({
  getInitialState(){
    return {}
  },
  openModal(selector, state){
    this.setState(state);
    $(selector).modal('open');
  },
  componentDidMount(){
    $('.modal').modal();
  },
  changeMeetingTime(e){
    this.setState({ meeting_time: e.target.value });
  },
  meetingTimeSubmit(e){
    e.preventDefault();
    const { id, meeting_time } = this.state;
    $.ajax({
      url: `/users/${id}`,
      type: 'PATCH',
      data: { user: { meeting_time } },
      success: () => {
        $('#meeting-time-modal').modal('close');
        this.props.loadStudents(); // Re-renders students index
      },
      error: () => {
        Materialize.toast('Failed to update meeting time.', 3500, 'red darken-3');
      }
    });
  },
  render(){
    const { id, meeting_time, klassIds, parents } = this.state;
    return <div>
             <table className='bordered z-depth-1'>
               <thead className='grey darken-4 white-text'>
                 <tr className='grey darken-4 white-text'>
                   <th className='student-name'>NAME</th>
                   <th>ACCOUNT</th>
                   <th>CLASSES</th>
                   <th>PARENTS</th>
                   <th>WEEKLY MEETING TIME</th>
                 </tr>
               </thead>
                <tbody>
                  {
                    this.props.students.map(student => {
                      return < Students.Show {...this.props} key={student.id} student={student} openModal={this.openModal} />;
                    })
                  }
                </tbody>
              </table>
              <div id='meeting-time-modal' className='modal' style={{ maxWidth: 400 }}>
                <div className='modal-content'>
                  <h4>Set Meeting Time</h4>
                  <form onSubmit={this.meetingTimeSubmit}>
                      <div className='row'>
                        <div className='input-field col s12'>
                          <input type='text' value={meeting_time || ''} onChange={this.changeMeetingTime} name='user[meeting_time]' placeholder='ex. 1:30PM Friday' id='user_meeting_time'/>
                          <label htmlFor='user_meeting_time' className='active'>Meeting time</label>
                        </div>
                      </div>
                  </form>
                  <a href='#' onClick={this.meetingTimeSubmit} style={{ width: '100%' }} className='btn modal-action modal-close waves-effect'>Set</a>
                </div>
              </div>
              <div id='parent-modal' className='modal' style={{ maxWidth: 400 }}>
                <div className='modal-content'>
                  <h4 className='center-align'>Parents</h4>
                  {
                    parents && parents.length > 0
                    ? <ul className='collection'>
                        {
                          parents.map(parent => {
                            return <a className='collection-item' key={parent.id} href={`/users/${parent.id}/edit`}>{parent.full_name}</a>;
                          })
                        }
                      </ul>
                    : <h5 className='center-align grey-text'>No parents added yet.</h5>
                  }
                  <br/>
                  <div className='row'>
                    <a className='modal-action btn btn-flat waves-effect' style={{ width: '100%' }} href={`/parents?student_id=${id}`}>Add/Remove Existing Parent</a>
                  </div>
                  <div className='row'>
                    <a className='modal-action modal-close btn waves-effect' style={{ width: '100%' }} href={`/users/new?role=parent&student_id=${id}`}>Add Parent</a>
                  </div>
                </div>
              </div>
            </div>;
  }
});

Students.Show = React.createClass({
  triggerMeetingModal(e) {
    e.preventDefault();
    const { id, meeting_time } = this.props.student;
    this.props.openModal('#meeting-time-modal', { id, meeting_time });
  },
  triggerParentModal(e) {
    e.preventDefault();
    const { id, parents } = this.props.student;
    this.props.openModal('#parent-modal', { id, parents });
  },
  render() {
    const { id, full_name, meeting_time } = this.props.student;
    return(
      <tr key={id}>
        <td className='student-name name'><a href={`/access_student?student_id=${id}`}>{full_name}</a></td>
        <td><a href={`/users/${id}/edit`}><i className='fa fa-pencil'></i></a></td>
        <td><a href={`/users/${id}/classes`}><i className='fa fa-university'></i></a></td>
        <td><a href='#'><i className='fa fa-users modal-trigger' onClick={this.triggerParentModal}></i></a></td>
        <td><a href='#' className='modal-trigger' onClick={this.triggerMeetingModal}><i className='fa fa-calendar-o'></i>{meeting_time}</a></td>
      </tr>
    )
  }
});
