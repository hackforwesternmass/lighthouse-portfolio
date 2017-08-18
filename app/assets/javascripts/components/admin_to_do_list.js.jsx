const AdminToDoList = React.createClass({
  getInitialState() {
    return { completeActionItems: [], incompleteActionItems: [] };
  },
  componentDidMount() {
    this.loadActionItems();
  },
  loadActionItems() {
    $.ajax({
      url: `/users/${this.props.userId}/action_items`,
      success: json => {
        this.setState({ completeActionItems: json.complete, incompleteActionItems: json.incomplete });
      }
    });
  },
  handleClear(e) {
    e.preventDefault();
    $.ajax({
      url: `/users/${this.props.userId}/action_items/${e.target.dataset.id}`,
      type: 'PATCH',
      data: { action_item: { archive: true } },
      success: () => {
        this.loadActionItems();
      },
      error: () => {
        Materialize.toast('Something went wrong, try reloading the page.', 3500, 'red darken-3');
      }
    });
  },
  toggleComplete(e) {
    e.preventDefault();
    $.ajax({
      url: `/users/${this.props.userId}/action_items/${e.target.dataset.id}`,
      type: 'PATCH',
      data: { action_item: { completed: e.target.dataset.value } },
      success: () => {
        this.loadActionItems();
      },
      error: () => {
        Materialize.toast('Something went wrong, try reloading the page.', 3500, 'red darken-3');
      }
    });
  },
  render() {
    const { completeActionItems, incompleteActionItems } = this.state;
    return(
      <div>
        <div className='card'>
          <div className='card-header'>To do list</div>
          { incompleteActionItems.length == 0 && <div className='empty-action-items'>You currently have no task to complete.</div>}
          {
            incompleteActionItems.map(actionItem => {
              return (
                <div key={actionItem.id} className='card-action-item row no-margin' >
                  <div className='weekday'>
                    {actionItem.due_date ? `Due ${moment(actionItem.due_date).add(1, 'days').fromNow()}` : ''}
                    <a className='complete' href='#' data-id={actionItem.id} data-value={true} onClick={this.toggleComplete}>Complete</a>
                  </div>
                  <div className='action-item'>
                    <div className='name'>{actionItem.owner_name}</div>
                    <div className='desc'>{actionItem.description}</div>
                  </div>
                </div>
              )
            })
          }
        </div>
        { completeActionItems.length > 0 &&
          <div className='card'>
            <div className='card-header'>Completed</div>
            {
              completeActionItems.map(actionItem => {
                return (
                  <div key={actionItem.id} className='card-action-item row no-margin' >
                    <div className='weekday'>
                      <i className='fa fa-check'></i>
                      <a className='complete' href='#' data-id={actionItem.id} data-value={false} onClick={this.toggleComplete}>undo</a>
                      <a className='complete' href='#' data-id={actionItem.id} onClick={this.handleClear}>clear</a>
                    </div>
                    <div className='action-item'>
                      <div className='name'>{actionItem.owner_name}</div>
                      <div className='desc'>{actionItem.description}</div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        }
      </div>
    );
  }
});
