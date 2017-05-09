const update = React.addons.update;

const Meetings = React.createClass({
  getInitialState() {
    return { showNewMeeting: false, loadingDraft: true, meetings: [] };
  },
  componentDidMount() {
    this.loadMeetings();
    if(this.props.draftMeetingId) this.loadDraftMeeting();
    EventSystem.subscribe('meetings:update', this.loadMeetings);
  },
  componentDidUpdate(prevProps, prevState) {
    const { showNewMeeting } = this.state;
    if(prevState.showNewMeeting && !showNewMeeting) {
      $('.new-meeting').velocity('transition.slideUpOut', { duration: 250 });
    }
  },
  loadMeetings() {
    if(this.isMounted()) {
      $.ajax({
        url: `/users/${this.props.userId}/meetings`,
        success: meetings => {
          EventSystem.publish('action_items:update');
          this.setState({ meetings });
        }
      });
    }
  },
  loadDraftMeeting() {
    $.ajax({
      url: `/users/${this.props.userId}/meetings/${this.props.draftMeetingId}`,
      success: draftMeeting => {
        this.setState({ draftMeeting, showNewMeeting: true, loadingDraft: false });
      }
    });
  },
  handleNewMeeting(e) {
    e.preventDefault();
    this.setState({ showNewMeeting: true, activeMeetingId: 'showNewMeeting' });
  },
  render() {
    const { showNewMeeting, meetings, activeMeetingId, draftMeeting, loadingDraft } = this.state;
    const { adminId, editable, meetingTime, draftMeetingId } = this.props;

    return (
      <div id='meetings'>
        {
          !adminId &&
            <div className='row'>
              <div className='card blue darken-1 no-margin'>
                <div className='card-content white-text center-align'>
                  <small style={{fontWeight: 300, fontSize: 13, display: 'block' }} >Meeting Time</small>
                  <h6>{ meetingTime || 'Anytime - Be Ready' }</h6>
                </div>
              </div>
            </div>
        }
        {
          adminId && !showNewMeeting && editable &&
            <a href='#' onClick={this.handleNewMeeting} className='hide-on-small-only'>
              <div className='row'>
                <div className='card blue darken-1 no-margin hoverable'>
                  <div className='card-content white-text center-align'>
                    <h6>START MEETING</h6>
                  </div>
                </div>
              </div>
            </a>
        }
        {
          showNewMeeting &&
            <Meetings.MeetingForm {...this.props} parent={this} meeting={draftMeeting || {action_items: []}} showNewMeeting={showNewMeeting} newMeeting />
        }
        {
          meetings.map(meeting => <Meetings.Meeting activeMeetingId={activeMeetingId} {...this.props} parent={this} key={meeting.id} meeting={meeting} />)
        }
        {
          meetings.length == 0 &&
            <div className='card'>
              <div className='card-content'>
                <h5 className='center-align'>You currently have no meeting notes.</h5>
              </div>
            </div>
        }
      </div>
    );
  }
});

Meetings.Meeting = React.createClass({
  getInitialState() {
    return { editing: false }
  },
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.activeMeetingId == prevProps.meeting.id && this.props.activeMeetingId != this.props.meeting.id) {
      this.setState({ editing: false });
    }

    if(prevState.editing != this.state.editing && !this.state.editing) {
      this.props.parent.loadMeetings();
    }
  },
  toggleEdit(e) {
    e && e.preventDefault();
    this.props.parent.setState({ activeMeetingId: this.props.meeting.id, showNewMeeting: false });
    this.setState({ editing: !this.state.editing });
  },
  render(){
    const { editing } = this.state;
    const { meeting, parent, activeMeetingId } = this.props;
    return(
      <div>
        {
          editing && activeMeetingId == meeting.id
          ? <Meetings.MeetingForm {...this.props} toggleEdit={this.toggleEdit} />
          : <Meetings.MeetingShow {...this.props} toggleEdit={this.toggleEdit} />
        }
      </div>
    );
  }
});

Meetings.MeetingShow = React.createClass({
  componentDidMount() {
    $(ReactDOM.findDOMNode(this)).velocity('transition.expandIn');
  },
  deleteMeeting(e) {
    e.preventDefault();
    const { userId, meeting, parent } = this.props;

    if(!confirm('Are you sure you would like to delete this meeting?')){
      return false;
    }

    $.ajax({
      url: `/users/${userId}/meetings/${meeting.id}`,
      type: 'DELETE',
      success: () => {
        Materialize.toast('Meeting successfully deleted!', 3500, 'teal');
        parent.loadMeetings();
      },
      error: () => {
        Materialize.toast('Failed to delete meeting', 3500, 'red darken-4');
      }
    });
  },
  toggleCheck(e) {
    const { userId, meeting, parent } = this.props;
    $.ajax({
      url: `/users/${userId}/action_items/${e.currentTarget.dataset.id}`,
      type: 'PATCH',
      data: { action_item: { completed: e.currentTarget.checked } },
      success: () => {
        parent.loadMeetings();
      },
      error: () => {
        if(this.props.editable) {
          Materialize.toast('Something went wrong, try reloading the page.', 3500, 'red darken-4');
        } else {
          Materialize.toast('You have viewing privilege only.', 3500, 'red darken-1');
        }
      }
    });
  },
  render() {
    const { created_at, action_items, notes } = this.props.meeting;
    const { editable } = this.props;
    return(
      <div className='row'>
        <div className='card'>
          <div className='card-date'>
            {moment(created_at).format('MMMM D YYYY')}
            {editable && <a href='#' className='right white-text' onClick={this.deleteMeeting}><i className='fa fa-times'></i></a>}
            {editable && <a href='#' className='right white-text hide-on-small-only' onClick={this.props.toggleEdit} ><i className='fa fa-edit'></i></a>}
          </div>
          <div className='card-content action-items'>

            <div className='row meeting-notes'>
              <div dangerouslySetInnerHTML={{ __html: notes }} />
            </div>

            {
              action_items.length > 0 &&
              <div>
                <div className='row title'>
                  <div className='col s4'>ACTION ITEMS</div>
                  <div className='col s6 push-s2'>DUE</div>
                </div>

                {action_items.map(actionItem => {
                  return(
                    <div className='row body' key={actionItem.id}>
                      <div className='col s9 m10'>
                        <input type='checkbox' className='blue-check filled-in' data-id={actionItem.id} id={`meeting-check-${actionItem.id}`} onChange={this.toggleCheck} checked={actionItem.completed && 'checked'}/>
                        <label htmlFor={`meeting-check-${actionItem.id}`}><span className='blue-text text-lighten-2'>{actionItem.user_id && 'Advisor task: ' }</span>{actionItem.description}</label>
                      </div>
                      <div className='col s3 m2 capitalize'>{ actionItem.due_date ? moment(actionItem.due_date).add(1, 'days').fromNow() : '∞' }</div>
                    </div>
                  )
                })}
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
});

Meetings.MeetingForm = React.createClass({
  getInitialState() {
    return { meeting: this.props.meeting, draft: this.props.newMeeting };
  },
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.showNewMeeting != this.props.showNewMeeting) {
      if(this.props.showNewMeeting) {
        window.initTiny(`#meeting-notes-${this.props.meeting.id}`);
        tinymce.editors.length > 0 && tinymce.editors[0].on('change', () => this.handleChange());
        $(this.refs.container).velocity('transition.expandIn', { complete: el => $(el).css('transform', 'initial') });
      } else {
        tinymce.remove();
      }
    }
  },
  componentDidMount() {
    tinymce.remove();
    $(this.refs.container).velocity('transition.expandIn', { delay: 350, complete: e => $(e).css('transform', 'initial') });
    window.initTiny(`#meeting-notes-${this.props.meeting.id}`);
    tinymce.editors.length > 0 && tinymce.editors[0].on('change', () => this.handleChange());
  },
  componentWillUnmount() {
    tinymce.remove();
  },
  addActionItem(e) {
    e.preventDefault();

    this.saveMeeting(meeting => {
      this.setState({ meeting });
    }, {
      meeting: {
        id: this.state.meeting.id,
        draft: this.state.draft,
        action_items_attributes: { '0': { description: '' } }
      }
    });
  },
  closeMeeting(e) {
    e && e.preventDefault();
    const { parent, newMeeting, userId } = this.props;
    if(newMeeting) {
      if(this.state.meeting.id) {
        $.ajax({
          url: `/users/${userId}/meetings/${this.state.meeting.id}`,
          type: 'DELETE',
          error: () => {
            Materialize.toast('Failed to delete meeting', 3500, 'red darken-4');
          }
        });
      }
      this.refs.form.reset();
      parent.setState({ showNewMeeting: false, draftMeeting: null });
    } else {
      this.props.toggleEdit();
    }
  },
  handleChange() {
    clearTimeout(this.changeTimeoutId);
    this.changeTimeoutId = setTimeout(() => {
      if(tinymce.editors.length === 0) return;

      const { userId, newMeeting, parent } = this.props;
      const { meeting } = this.state;
      tinymce.editors[0].save();

      this.saveMeeting(meeting => {
        if(newMeeting) parent.setState({ draftMeeting: meeting });
        this.setState({ meeting: update(this.state.meeting, { id: { $set: meeting.id } }) });
      });

    }, 2000)
  },
  finishMeeting(e) {
    e.preventDefault();
    this.setState({ draft: false }, () => {
      tinymce.editors[0].save();

      this.saveMeeting(() => {
        this.refs.form.reset();
        Materialize.toast('Meeting successfully saved!', 3500, 'teal');
        this.setState({ meeting: {action_items: []} });
        this.closeMeeting();
        this.props.parent.loadMeetings();
      });
    })
  },
  saveMeeting(success, data) {
    let url, type, contentType, processData;

    if(this.state.meeting.id) {
      url = `/users/${this.props.userId}/meetings/${this.state.meeting.id}`;
      type = 'PATCH';
    } else {
      url = `/users/${this.props.userId}/meetings`;
      type = 'POST';
    }

    if(data) {
      contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
      processData = true;
    } else {
      contentType = false;
      processData = false;
      data = new FormData(this.refs.form)
    }

    $.ajax({
      url,
      type,
      contentType,
      processData,
      data,
      success: meeting => success(meeting),
      error: () => Materialize.toast('Failed to save meeting.', 3500, 'red darken-4')
    });
  },
  render() {
    const { draft, meeting } = this.state;
    const { created_at, notes, action_items, id } = meeting;
    const { userId, adminId, newMeeting } = this.props;
    return(
      <div ref='container' className='row meeting-form'>
        <div className='card'>
          <div className='card-date blue darken-1 white-text'>
            {!newMeeting ? moment(created_at).format('MMMM D YYYY') : 'New Meeting'}
            <a className='right white-text' href='#' onClick={this.closeMeeting}><i className='fa fa-times'></i></a>
          </div>
          <div className='card-content'>
            <form ref='form'>
              <input type='hidden' value={draft ? '1' : '0'} name='meeting[draft]' />
              <div className='row'>
                <h6 className='bold grey-text text-darken-2'>Notes</h6>
              </div>

              <div className='row'>
                <textarea name='meeting[notes]' id={`meeting-notes-${meeting.id}`} onChange={this.handleChange} defaultValue={notes}></textarea>
              </div>

              {
                action_items.length > 0 &&
                  <div>
                    <div className='row'>
                      <h6 className='bold grey-text text-darken-2'>Action Items</h6>
                    </div>

                    <div className='row action-items'>
                      <ul className='collection with-header'>
                        <li className='collection-header grey lighten-3'>
                          <div className='row no-margin grey-text text-darken-2'>
                            <div className='col s9'>Description</div>
                            <div className='col s3'>Due Date</div>
                          </div>
                        </li>
                        {
                          action_items.map((actionItem, i) => {
                            return <Meetings.ActionItem {...this.props} {...actionItem} meeting={meeting} index={i} key={`action-item-${actionItem.id}`} parent={this} />
                          })
                        }
                      </ul>
                    </div>
                  </div>
              }

              <div className='row'>
                <button name='button' type='button' style={{marginRight: 10}} className='btn waves-effect waves-light blue darken-1' onClick={this.addActionItem}>
                  Add Action Item
                </button>
                {
                  newMeeting &&
                    <a href='#' onClick={this.finishMeeting} className='btn waves-effect waves-light'>
                      Meeting Finished
                    </a>
                }
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

Meetings.ActionItem = React.createClass({
  getInitialState() {
    return { adminAssigned: !!this.props.user_id };
  },
  componentDidMount() {
    $(ReactDOM.findDOMNode(this)).find('.datepicker').pickadate({
      onSet: () => this.props.parent.handleChange()
    });
    $(ReactDOM.findDOMNode(this)).find('.tooltipped').tooltip();
    $(ReactDOM.findDOMNode(this)).velocity('transition.fadeIn', { complete: (e) => $(e).css('transform', 'initial') });
  },
  toggleAssignedAdmin(e) {
    e.preventDefault();
    this.setState({ adminAssigned: !this.state.adminAssigned }, () => {
      this.props.parent.handleChange();
    });
  },
  handleDelete(e) {
    e.preventDefault();
    $.ajax({
      url: `/users/${this.props.userId}/meetings/${this.props.meeting.id}`,
      type: 'PATCH',
      data: { meeting: { action_items_attributes: { '0': { id: this.props.id, _destroy: '1' } } } },
      success: meeting => this.props.parent.setState({ meeting }),
      error: () => {
        Materialize.toast('Failed to delete action item', 3500, 'red darken-4');
      }
    });
  },
  render() {
    const { id, description, due_date, completed, user_id, index, adminId, newActionItem, parent } = this.props;
    const { adminAssigned } = this.state;
    return(
      <li className='collection-item'>
        <input type='hidden' value={id} name={`meeting[action_items_attributes][${index}][id]`} />
        <div className='row'>
          {adminId && <i data-position='top' data-delay='50' data-tooltip={adminAssigned ? 'Unassign advisor' : 'Assign advisor' } className={`fa fa-user advisor-btn tooltipped ${adminAssigned ? 'blue-text' : 'grey-text text-darken-2'}`} onClick={this.toggleAssignedAdmin}></i>}
          <a className='action-item close grey-text text-darken-2' onClick={this.handleDelete}>×</a>
          <input type='hidden' value={adminAssigned ? (adminId || user_id) : ''} name={`meeting[action_items_attributes][${index}][user_id]`} />
          <div className='input-field col s9'>
            <input type='text' onChange={parent.handleChange} name={`meeting[action_items_attributes][${index}][description]`} placeholder='Description' defaultValue={description} />
          </div>
          <div className='input-field col s3'>
            <input type='text' className='datepicker' name={`meeting[action_items_attributes][${index}][due_date]`} placeholder='Due Date' defaultValue={due_date ? moment(due_date).format('D MMMM, YYYY') : ''} />
          </div>
        </div>
      </li>
    );
  }
});
