var AdminToDoList = React.createClass({

  getInitialState: function() {
    return { completeActionItems: [],
            incompleteActionItems: []};
  },
  componentDidMount: function() {
    $.getJSON("/action_items", function(data){
      this.setState({ completeActionItems: data.complete, incompleteActionItems: data.incomplete })
    }.bind(this));
  },
  handleClear: function(id) {
    $.ajax({
      url: "/action_items/" + id ,
      dataType: "JSON",
      type: "PATCH",
      data: { action_item: { archive: true } },
      success: function() {
        $.getJSON("/action_items", function(data){
          this.setState({ completeActionItems: data.complete, incompleteActionItems: data.incomplete })
        }.bind(this));
      }.bind(this),
      error: function(data) {
        console.log("ERROR - UPDATING ACTION ITEM");
      }
    });
  },
  toggleComplete: function(id, complete){
    $.ajax({
      url: "/action_items/" + id ,
      dataType: "JSON",
      type: "PATCH",
      data: { action_item: { completed: complete } },
      success: function() {
        $.getJSON("/action_items", function(data){
          this.setState({ completeActionItems: data.complete, incompleteActionItems: data.incomplete })
        }.bind(this));
      }.bind(this),
      error: function(data) {
        console.log("ERROR - UPDATING ACTION ITEM");
      }
    });
  },
  render: function(){
    return  <section className="things-to-do">
              <AdminToDoList.Incomplete actionItems={this.state.incompleteActionItems} complete={this.toggleComplete}/>
              <AdminToDoList.Complete actionItems={this.state.completeActionItems} complete={this.toggleComplete} clear={this.handleClear} />
            </section>
  }

});


AdminToDoList.Incomplete = React.createClass({
  setComplete: function(e){
    e.preventDefault();
    var id = e.target.dataset.id;
    this.props.complete(id, true);
  },
  actionItems: function(){
    var actionItemNodes = this.props.actionItems.map(function(actionItem){
      return (<div key={actionItem.id} className="card-action-item row no-margin" >
                <div className="weekday">
                  {moment(actionItem.due_date).fromNow()}
                  <a className="complete" href="#" data-id={actionItem.id} onClick={this.setComplete}>Complete</a>
                </div>
                <div className="action-item">
                  <div className="name">{actionItem.owner_name}</div>
                  <div className="desc">{actionItem.description}</div>
                </div>
              </div>)
    }.bind(this));
    return actionItemNodes;
  },
  render: function(){
    return  <div className="card">
              <div className="card-header">To do list</div>
              { this.props.actionItems.length > 0 ? null : <div className="empty-action-items">You currently have no task to complete.</div>}
              { this.actionItems() }
            </div>;
  }
});

AdminToDoList.Complete = React.createClass({
  setComplete: function(e){
    e.preventDefault();
    var id = e.target.dataset.id;
    this.props.complete(id, false);
  },
  handleClear: function(e){
    e.preventDefault();
    var id = e.target.dataset.id;
    this.props.clear(id);
  },
  actionItems: function(){
    var actionItemNodes = this.props.actionItems.map(function(actionItem){
      return (<div key={actionItem.id} className="card-action-item row no-margin" >
                <div className="weekday">
                  <i className="fa fa-check"></i>
                  <a className="complete" href="#" data-id={actionItem.id} onClick={this.setComplete}>undo</a>
                  <a className="complete" href="#" data-id={actionItem.id} onClick={this.handleClear}>clear</a>
                </div>
                <div className="action-item">
                  <div className="name">{actionItem.owner_name}</div>
                  <div className="desc">{actionItem.description}</div>
                </div>
              </div>)
    }.bind(this));
    return actionItemNodes;
  },
  render: function(){
    return  <div className="card">
              <div className="card-header">Completed</div>
              { this.props.actionItems.length > 0 ? null : <div className="empty-action-items">You currently have no task to complete.</div>}
              { this.actionItems() }
            </div>;
  }
});
