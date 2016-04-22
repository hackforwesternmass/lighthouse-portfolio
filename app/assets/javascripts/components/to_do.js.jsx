var ToDo = React.createClass({
  getInitialState: function() {
    return { actionItems: [] };
  },
  componentDidMount: function() {
    $.getJSON("/action_items", function(data){
      this.setState({ actionItems: data.all })
    }.bind(this));
  },
  updateActionItems: function() {
    $.getJSON("/action_items", function(data){
      this.setState({ actionItems: data.all })
    }.bind(this));
  },
  actionItems: function(){
    var actionItemNodes = this.state.actionItems.map(function(actionItem){
      return <ToDo.ActionItem key={actionItem.id} actionItem={actionItem} updateActionItems={this.updateActionItems} />;
    }.bind(this));
    return actionItemNodes;
  },
  render: function(){
    return  <div id="to-do" className="row">
              <div className="col s12">

              <div className="row">
                <div className="card blue darken-1 no-margin">
                  <div className="card-content white-text center-align">
                    <small style={{fontWeight: 300, fontSize: 13 }} >Meeting Time</small><br/>
                    <h6>{this.props.meetingTime}</h6>
                  </div>
                </div>
              </div>

                <div className="card">
                  <div className="card-content">
                    {this.actionItems()}
                  </div>
                </div>
              </div>

            </div>
  }
});


ToDo.ActionItem = React.createClass({
  toggleComplete: function(){
    $.ajax({
      url: "/action_items/" + this.props.actionItem.id,
      dataType: "JSON",
      type: "PATCH",
      data: { action_item: { completed: !this.props.actionItem.completed } },
      success: function() {
        this.props.updateActionItems();
      }.bind(this),
      error: function() {
        console.log("ERROR - UPDATING ACTION ITEM");
      }
    });
  },
  delete: function(e) {
    e.preventDefault();
    $.ajax({
      url: "/action_items/" + this.props.actionItem.id,
      dataType: "JSON",
      type: "DELETE",
      success: function() {
        this.props.updateActionItems();
      }.bind(this)
    });
  },
  render: function(){
      return  <div className="item">
                <div className="text">
                  <input type="checkbox" className="blue-check" id={"check-" + this.props.actionItem.id} onChange={this.toggleComplete} checked={this.props.actionItem.completed ? "checked" : false }/>
                  <label htmlFor={"check-" + this.props.actionItem.id}>{this.props.actionItem.description}</label>
                </div>
                <div className="secondary-icons">
                  <i className="fa fa-times-circle" onClick={this.delete}/>
                </div>
              </div>;
  }
});

