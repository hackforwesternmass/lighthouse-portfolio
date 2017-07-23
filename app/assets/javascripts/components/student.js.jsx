const Students = React.createClass({
  getInitialState() {
    return {
      students: [],
      currentStudentParents: [],
      currentStudentId: '',
      currentStudentMeetingTime: '',
      viewArchived: false
    };
  },
  componentDidMount() {
    this.loadStudents();
    $('.tooltipped').tooltip({ position: 'left', delay: 10 });
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
    this.loadStudents({ q: e.target.value });
  },
  changeMeetingTime(e){
    this.setState({ currentStudentMeetingTime: e.target.value });
  },
  meetingTimeSubmit(e){
    e.preventDefault();
    const { currentStudentId, currentStudentMeetingTime } = this.state;
    $.ajax({
      url: `/users/${currentStudentId}`,
      type: 'PATCH',
      data: { user: { meeting_time: currentStudentMeetingTime } },
      success: () => {
        $('#meeting-time-modal').modal('close');
        this.loadStudents(); // Re-renders students index
      },
      error: () => {
        Materialize.toast('Failed to update meeting time.', 3500, 'red darken-3');
      }
    });
  },
  toggleViewArchived(e) {
    e.preventDefault();
    this.setState({ viewArchived: !this.state.viewArchived }, () => {
      $('.tooltipped').tooltip({ position: 'left', delay: 10 });
    });
  },
  render() {
    const { students, currentStudentMeetingTime, currentStudentId, currentStudentParents, viewArchived } = this.state;
    return(
      <section id='students' className='section-container'>
        <div className='row grey-text text-darken-2'>
          <div className='input-field col s12 m9 l6'>
            <i className='material-icons prefix'>search</i>
            <input id='student-search' className='search' type='text' onChange={this.searchText}/>
            <label htmlFor='student-search'>Search</label>
          </div>

          <div className='input-field col s12 m3 l6'>
            <a href='#' style={{marginLeft: 10}} onClick={this.toggleViewArchived} data-position='left' data-tooltip={viewArchived ? 'Hide Archived Students' : 'View Archived Students'}  className='right grey darken-1 tooltipped btn-floating waves-effect waves-light'>
              <i className='material-icons'>{viewArchived ? 'visibility_off' : 'visibility'}</i>
            </a>
            <a href='/users/new?role=student' data-position='left' data-tooltip='Register New Student'  className='right tooltipped btn-floating waves-effect waves-light'>
              <i className='material-icons'>add</i>
            </a>
          </div>
        </div>
        <div className='collection'>
          {students.map(student => <Students.Show parent={this} student={student} viewArchived={viewArchived} key={`student-${student.id}`} />)}
        </div>
        <div id='meeting-time-modal' className='modal small'>
          <div className='modal-content'>
            <h4>Set Meeting Time</h4>
            <form onSubmit={this.meetingTimeSubmit}>
              <div className='row'>
                <div className='input-field col s12'>
                  <input type='text' value={currentStudentMeetingTime} onChange={this.changeMeetingTime} name='user[meeting_time]' placeholder='ex. 1:30PM Friday' id='user_meeting_time'/>
                  <label htmlFor='user_meeting_time' className='active'>Meeting time</label>
                </div>
              </div>
            </form>
            <a href='#' onClick={this.meetingTimeSubmit} style={{ width: '100%' }} className='btn modal-action waves-effect'>Set</a>
          </div>
        </div>
        <div id='parent-modal' className='modal small'>
          <div className='modal-content'>
            <h4 className='center-align'>Parents</h4>
            {
              currentStudentParents.length > 0
                ? <ul className='collection'>
                  {
                    currentStudentParents.map(parent => {
                      return <a className='collection-item' key={parent.id} href={`/users/${parent.id}/edit`}>{parent.full_name}</a>;
                    })
                  }
                </ul>
                : <h5 className='center-align grey-text'>No parents added yet.</h5>
            }
            <br/>
            <div className='row'>
              <a className='modal-action btn btn-flat waves-effect' style={{ width: '100%' }} href={`/parents?student_id=${currentStudentId}`}>Add/Remove Existing Parent</a>
            </div>
            <div className='row'>
              <a className='modal-action modal-close btn waves-effect' style={{ width: '100%' }} href={`/users/new?role=parent&student_id=${currentStudentId}`}>Add Parent</a>
            </div>
          </div>
        </div>
      </section>
    )
  }
});

Students.Show = React.createClass({
  componentDidMount() {
    $('.dropdown-button').dropdown({
      constrainWidth: false,
    });
  },
  componentDidUpdate() {
    $('.dropdown-button').dropdown({
      constrainWidth: false,
    });
  },
  openMeetingTimeModal(e) {
    e.preventDefault();
    const { student, parent } = this.props;
    parent.setState({ currentStudentMeetingTime: student.meeting_time, currentStudentId: student.id }, () => {
      $('#meeting-time-modal').modal('open', {});
    });
  },
  openParentsModal(e) {
    e.preventDefault();
    const { student, parent } = this.props;
    parent.setState({ currentStudentParents: student.parents, currentStudentId: student.id }, () => {
      $('#parent-modal').modal('open', {});
    });
  },
  toggleArchiveStudent(e) {
    e.preventDefault();

    if (!this.props.student.archive && !confirm('Classes that student is currently enrolled in will be moved to student\'s past classes list.')) {
      return false;
    }

    $.ajax({
      url: `/users/${this.props.student.id}`,
      type: 'PATCH',
      data: { user: { archive: !this.props.student.archive } },
      success: () => {
        this.props.parent.loadStudents(); // Re-renders students index
      },
      error: () => {
        Materialize.toast('Something went wrong, try reloading the page.', 3500, 'red darken-3');
      }
    });
  },
  render() {
    const { student, viewArchived } = this.props;
    if(!viewArchived && student.archive) {
      return false
    }

    if(viewArchived && !student.archive) {
      return false
    }

    return(
      <div className='collection-item avatar'>
        <a href={`/access_student?student_id=${student.id}`}>
          <img src={student.thumb_avatar_url} alt={`${student.full_name} avatar`} className='circle' />
        </a>
        <div className='row'>
          <div className='col s12 m4'>
            <a className='title' href={`/access_student?student_id=${student.id}`}>{student.full_name}</a>
            {
              student.meeting_time &&
              <p className='hide-on-med-and-up'>{student.meeting_time}</p>
            }
          </div>
          {
            !student.archive &&
            <div className='col s12 m4'><a className='subtitle hide-on-small-only' href={`/users/${student.id}/classes`}>Classes ({student.enrolls.filter(enroll => !enroll.completed).length})</a></div>
          }
          {
            !student.archive &&
            <div className='col s12 m4'><a className='subtitle hide-on-small-only' href='#' onClick={this.openMeetingTimeModal}>{student.meeting_time}</a></div>
          }
        </div>

        <a href='#' data-activates={`dropdown-${student.id}`} className='dropdown-button secondary-content'><i className='material-icons'>more_vert</i></a>
        <ul id={`dropdown-${student.id}`} className='dropdown-content'>
          <li><a href={`/users/${student.id}/edit`}>Edit Account</a></li>
          {
            !student.archive &&
            <li><a href='#' onClick={this.openMeetingTimeModal}>Set Meeting Time</a></li>
          }
          {
            !student.archive &&
            <li><a href={`/users/${student.id}/classes`}>Manage Classes</a></li>
          }
          {
            !student.archive &&
            <li><a href='#' onClick={this.openParentsModal}>Manage Parents</a></li>
          }
          <li className='divider'></li>
          <li><a href='#' onClick={this.toggleArchiveStudent}>{student.archive ? 'Unarchive' : 'Archive'}</a></li>
        </ul>
      </div>
    )
  }
})
