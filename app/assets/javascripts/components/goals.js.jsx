const update = React.addons.update;

const Goals = React.createClass({
  getInitialState() {
    return { newGoal: false, goals: [] };
  },
  componentDidMount() {
    this.loadGoals();
  },
  loadGoals() {
    $.ajax({
      url: `/users/${this.props.userId}/goals`,
      success: goals => {
        this.setState({ goals });
      }
    })
  },
  handleNewGoal(e) {
    e.preventDefault();
    this.setState({ newGoal: true });
  },
  render() {
    const { goals, newGoal } = this.state;
    const { editable, userArchived } = this.props;
    return (
      <div id='goals'>
        {
          !newGoal && editable &&
          <a href='#' onClick={this.handleNewGoal} className='hide-on-small-only'>
            <div className='row'>
              <div className='card grey darken-3 no-margin hoverable'>
                <div className='card-content white-text center-align'>
                  <h6>
                    <i className='fa fa-plus-circle'></i>
                    ADD GOAL
                  </h6>
                </div>
              </div>
            </div>
          </a>
        }
        {
          newGoal &&
          <Goals.GoalForm {...this.props} parent={this} goal={{ action_items: [] }} newGoal={newGoal}/>
        }
        {
          goals.map(goal => {
            return <Goals.Goal {...this.props} parent={this} key={goal.id} goal={goal}/>
          })
        }
        {
          goals.length == 0 &&
          <div className='card'>
            <div className='card-content'>
              <h5 className='center-align'>You currently have no goals.</h5>
            </div>
          </div>
        }
      </div>
    );
  }
});

Goals.Goal = React.createClass({
  getInitialState() {
    return {editing: false}
  },
  toggleEdit(e) {
    e && e.preventDefault();
    this.setState({
      editing: !this.state.editing
    });
  },
  render() {
    const {editing} = this.state;
    return (
      <div>
        {
          editing
            ? <Goals.GoalForm {...this.props} toggleEdit={this.toggleEdit}/>
            : <Goals.GoalShow {...this.props} toggleEdit={this.toggleEdit}/>
        }
      </div>
    );
  }
});

Goals.GoalShow = React.createClass({
  toggleCheck(e) {
    const { userId, meeting, parent } = this.props;
    $.ajax({
      url: `/users/${userId}/action_items/${e.currentTarget.dataset.id}`,
      type: 'PATCH',
      data: {
        action_item: {
          completed: e.currentTarget.checked
        }
      },
      success: () => {
        parent.loadGoals();
      },
      error: error => {
        if (this.props.editable) {
          Materialize.toast('Something went wrong, try reloading the page.', 3500, 'red darken-3');
        } else {
          Materialize.toast('You have viewing privilege only.', 3500, 'red darken-1');
        }
      }
    });
  },
  toggleComplete(e) {
    e.preventDefault();
    const { userId, goal, parent } = this.props;

    $.ajax({
      url: `/users/${userId}/goals/${goal.id}`,
      type: 'PATCH',
      data: {
        goal: {
          is_completed: !goal.is_completed
        }
      },
      success: () => {
        parent.loadGoals();
      },
      error: () => {
        if (this.props.editable) {
          Materialize.toast('Something went wrong, try reloading the page.', 3500, 'red darken-3');
        } else {
          Materialize.toast('You have viewing privilege only.', 3500, 'red darken-1');
        }
      }
    });
  },
  deleteGoal(e) {
    e.preventDefault();
    const {userId, goal, parent} = this.props;

    if (!confirm('Are you sure you would like to delete this goal?')) {
      return false;
    }

    $.ajax({
      url: `/users/${userId}/goals/${goal.id}`,
      type: 'DELETE',
      success: () => {
        Materialize.toast('Goal successfully deleted!', 3500, 'teal');
        parent.loadGoals();
      },
      error: () => {
        Materialize.toast('Failed to delete goal', 3500, 'red darken-3');
      }
    });
  },
  progress() {
    let counter = 0;
    const {action_items} = this.props.goal;

    action_items.forEach(actionItem => {
      if (actionItem.completed)
        counter += 1;
      }
    );

    return (counter / action_items.length * 100).toFixed(0);
  },
  render() {
    const {editable} = this.props;
    const {action_items, created_at, due_date, title, is_completed} = this.props.goal;

    return (
      <div className='card'>
        <div className='card-content'>

          {
            editable && <a href='#' className='right' onClick={this.deleteGoal}>
              <i className='fa fa-times'></i>
            </a>
          }
          {
            editable && <a href='#' className='right hide-on-small-only' onClick={this.props.toggleEdit}>
              <i className='fa fa-edit'></i>
            </a>
          }
          <div className='goal-title'>
            {title}
          </div>
          <div className='row grey-text no-margin'>
            <div className='col s6'>DATE SET</div>
            <div className='col s6 right-align'>DEADLINE</div>
          </div>
          <div className='row'>
            <div className='col s6'>{moment(created_at).format('MMMM D YYYY')}</div>
            <div className='col s6 right right-align'>
              {
                due_date
                  ? moment(due_date).format('MMMM D YYYY')
                  : '∞'
              }
            </div>
          </div>

          {
            action_items.length > 0 && <div>
              <div className='row'>
                <div className='grey-text col s12'>
                  PROGRESS
                </div>
              </div>
              <div className='row'>
                <div className='progress-bar col s12'>
                  <div className='completed-progress-bar' style={{
                    width: this.progress() + '%'
                  }}></div>
                  <div className='progress-bar-text'>{this.progress()}% Complete</div>
                </div>
              </div>

              <div className='row'>
                <div className='grey-text add-checklist'>
                  CHECKLIST
                </div>
              </div>

              <div className='row'>
                {action_items.map(actionItem => {
                  return (
                    <div className='col s12' key={actionItem.id}>
                      <input type='checkbox' disabled={this.props.userArchived} className='blue-check filled-in' id={`action-item-check-${actionItem.id}`} data-id={actionItem.id} onChange={this.toggleCheck} checked={actionItem.completed && 'checked'}/>
                      <label htmlFor={`action-item-check-${actionItem.id}`}>{actionItem.description}</label>
                    </div>
                  )
                })
                }
              </div>
            </div>
          }
        </div>
        <a href='#' className={is_completed ? 'complete-btn' : 'incomplete-btn'} onClick={this.toggleComplete}>
          {this.props.goal.is_completed ? 'Completed' : 'Finished?'}
        </a>
      </div>
    );
  }
});

Goals.GoalForm = React.createClass({
  getInitialState() {
    return { showChecklist: this.props.goal.action_items.length > 0, goal: this.props.goal };
  },
  componentDidMount() {
    if (this.props.newGoal) {
      this.setState({
        goal: update(this.state.goal, {
          action_items: {
            $push: [this.defaultActionItem()]
          }
        })
      });
    }
    Materialize.updateTextFields();
    $(ReactDOM.findDOMNode(this)).find('.datepicker').pickadate();
    $(ReactDOM.findDOMNode(this)).velocity('transition.expandIn', {
      complete: (el) => $(el).css('transform', 'initial')
    });
  },
  defaultActionItem() {
    return {id: Materialize.guid(), description: '', newActionItem: true};
  },
  addActionItem(e) {
    e.preventDefault();
    this.setState({
      goal: update(this.state.goal, {
        action_items: {
          $push: [this.defaultActionItem()]
        }
      })
    });
  },
  closeGoal(e) {
    e && e.preventDefault();
    const {parent, newGoal} = this.props;
    if (newGoal) {
      parent.setState({newGoal: false});
    } else {
      this.props.toggleEdit();
    }
  },
  handleSubmit(e) {
    e.preventDefault();

    const {newGoal, userId, goal, parent} = this.props;

    let url, type;

    if (newGoal) {
      url = `/users/${userId}/goals`;
      type = 'POST';
    } else {
      url = `/users/${userId}/goals/${goal.id}`;
      type = 'PATCH';
    }

    $.ajax({
      url,
      type,
      contentType: false,
      processData: false,
      data: new FormData(e.currentTarget),
      success: data => {
        Materialize.toast('Goal successfully saved!', 3500, 'teal');
        this.setState({sendingForm: false, error: false});
        this.closeGoal();
        parent.loadGoals();
      },
      error: error => {
        Materialize.toast('Failed to save goal.', 3500, 'red darken-3');
        if (error.status === 422) {
          this.setState({error: true, errorMessages: error.responseJSON});
        } else {
          this.setState({error: true});
        }
      }
    });
  },
  toggleChecklist(e) {
    e.preventDefault();
    this.setState({
      showChecklist: !this.state.showChecklist
    });
  },
  closeList(e) {
    e.preventDefault();
    this.setState({showChecklist: false});
  },
  render() {
    const {showChecklist} = this.state;
    const {action_items, title, due_date, created_at} = this.state.goal;
    return (
      <div className='card'>
        <div className='card-date grey darken-3 white-text'>
          {created_at
            ? moment(created_at).format('MMMM D YYYY')
            : 'New Goal'}
          <a className='right white-text' onClick={this.closeGoal}>
            <i className='fa fa-times'></i>
          </a>
        </div>
        <div className='card-content'>
          <form onSubmit={this.handleSubmit}>
            <input name='utf8' type='hidden' value='✓'/>
            <div className='row'>
              <div className='input-field col s12 m8'>
                <input type='text' name='goal[title]' id='goal_title' defaultValue={title}/>
                <label htmlFor='goal_title'>Title</label>
              </div>
              <div className='input-field col s12 m4'>
                <input
                  type='text'
                  className='datepicker'
                  name='goal[due_date]'
                  id='goal_due_date'
                  defaultValue={due_date ? moment(due_date).format('D MMMM, YYYY') : ''}
                />
                <label htmlFor='goal_due_date'>Due Date</label>
              </div>
            </div>
            <div className='row no-margin'>
              <div className='col s12'>
                {
                  !showChecklist &&
                  <a onClick={this.toggleChecklist} className='btn waves-effect waves-light grey darken-1'>
                    {
                      action_items.length > 0
                        ? 'Open Checklist'
                        : 'Add Checklist'
                    }
                  </a>
                }
                {
                  showChecklist &&
                  <div>
                    <div className='row'>
                      <h6 className='bold grey-text text-darken-2 col s12 m6'>
                        Checklist
                        <a onClick={this.closeList} className='add-checklist right'>Close list...</a>
                      </h6>
                    </div>
                    {
                      action_items.map((actionItem, i) => {
                        return <Goals.ActionItem {...this.props} {...actionItem} index={i} key={actionItem.id} parent={this}/>
                      })
                    }
                    <div className='row' style={{paddingLeft: '0.75rem'}}>
                      <button name='button' type='button' className='btn waves-effect waves-light grey darken-1' onClick={this.addActionItem}>
                        Add
                      </button>
                    </div>
                  </div>
                }
                <button name='button' type='submit' className='btn waves-effect waves-light right'>
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
});

Goals.ActionItem = React.createClass({
  getInitialState() {
    return {};
  },
  componentDidMount() {
    $(ReactDOM.findDOMNode(this)).velocity('transition.slideDownIn', {
      complete: (el) => $(el).css('transform', 'initial')
    });
  },
  handleRemove(e) {
    e.preventDefault();
    const {newActionItem, parent, index} = this.props;
    if (newActionItem) {
      parent.setState({
        goal: update(parent.state.goal, {
          action_items: {
            $splice: [
              [index, 1]
            ]
          }
        })
      });
    } else {
      this.setState({removed: true});
    }
  },
  render() {
    const {id, description, user_id, index, newActionItem} = this.props;
    const {removed} = this.state;
    return (
      <div className='row new-goal' style={removed
        ? {
          display: 'none'
        }
        : {}}>
        <div className='input-field col s12 m6'>
          {removed && <input type='hidden' value='1' name={`goal[action_items_attributes][${index}][_destroy]`}/>}
          {!newActionItem && <input type='hidden' value={id} name={`goal[action_items_attributes][${index}][id]`}/>}
          <input type='text' name={`goal[action_items_attributes][${index}][description]`} defaultValue={description} placeholder='Add an item...'/>
          <a className='close-goal' onClick={this.handleRemove}><i className='fa fa-times'/></a>
        </div>
      </div>
    );
  }
});
