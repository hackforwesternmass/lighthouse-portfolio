const ToDo = React.createClass({
  getInitialState() {
    return { actionItems: [], loading: true }
  },
  componentDidMount() {
    this.loadActionItems()
    EventSystem.subscribe('action_items_updated', this.loadActionItems)
  },
  loadActionItems() {
    if(this.isMounted()){
      $.getJSON(`/users/${this.props.userId}/action_items`,
        data => this.setState({ actionItems: data.all, loading: false })
      )
    }
    EventSystem.publish('meetings.updated')
  },
  render() {
    const { actionItems, loading } = this.state;
    return(
      <div id='to-do'>
        <div className='row'>
          <div className='card blue darken-1 no-margin'>
            <div className='card-content white-text center-align'>
              <small style={{fontWeight: 300, fontSize: 13, display: 'block' }} >Meeting Time</small>
              <h6>{this.props.meetingTime ? this.props.meetingTime : 'Anytime - Be Ready'}</h6>
            </div>
          </div>
        </div>

        <div className='card'>
          <div className='card-content'>
            { loading && <div className='center-align'><i className='fa fa-spinner fa-pulse fa-3x fa-fw no-padding'></i></div> }
            { !loading && actionItems.length === 0 && <h4 className='center-align'>You currently have no action items to complete.</h4> }
            {
              this.state.actionItems.map(actionItem => {
                return <ToDo.ActionItem {...this.props} key={actionItem.id} actionItem={actionItem} parent={this} />
              })
            }
          </div>
        </div>
      </div>
    );
  }
});


ToDo.ActionItem = React.createClass({
  toggleComplete() {
    const { actionItem, userId } = this.props;
    $.ajax({
      url: `/users/${this.props.userId}/action_items/${actionItem.id}`,
      dataType: 'JSON',
      type: 'PATCH',
      data: { action_item: { completed: !actionItem.completed } },
      success: () => {
        this.props.parent.loadActionItems();
      },
      error: function() {
        Materialize.toast('Something went wrong, try reloading the page.', 3500, 'red darken-4');
      }
    });
  },
  archive(e) {
    e.preventDefault();
    const { actionItem } = this.props;
    $.ajax({
      url: `/users/${this.props.userId}/action_items/${actionItem.id}`,
      dataType: 'JSON',
      type: 'PATCH',
      data: { action_item: { archive: true } },
      success: () => {
        this.props.parent.loadActionItems();
      },
      error: function() {
        Materialize.toast('Something went wrong, try reloading the page.', 3500, 'red darken-4');
      }
    });
  },
  render() {
    const { id, completed, description, due_date } = this.props.actionItem;
    return(
      <div className='item'>
        <div className='text'>
          <input type='checkbox' className='blue-check' id={`check-${id}`} onChange={this.toggleComplete} checked={completed && 'checked'}/>
          <label htmlFor={`check-${id}`}>
            {due_date && <span className='blue-text text-darken-1' >Due {moment(due_date).fromNow()}: </span>}
            {description}
          </label>
        </div>
        <div className='secondary-icons'>
          <i className='fa fa-times' onClick={this.archive}/>
        </div>
      </div>
    );
  }
});
