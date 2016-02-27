var GoalActionItem = React.createClass({

  getInitialState: function() {
    return { description : this.props.action_item.description,
             completed: this.props.action_item.completed,
             id: this.props.action_item.id,
             reactKey: this.props.reactKey
           };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({ description : nextProps.action_item.description,
                    completed: nextProps.action_item.completed,
                    id: nextProps.action_item.id,
                    reactKey: this.props.reactKey
                   });
  },
  toggleCheck: function(){
    $.ajax({
      url: "/action_items/" + this.state.id ,
      dataType: "JSON",
      type: "PATCH",
      data: { action_item: { completed: !this.state.completed } },
      success: function(data) {
        this.props.setActionItemComplete(this.state.reactKey, !this.state.completed, this.props.goalIndex);
      }.bind(this),
      error: function(data) {
        console.log(data);
      }
    });
  },
  render: function(){
    return <div style={{paddingLeft: "1.5rem", paddingBottom: "10px"}}>
              <input type="checkbox" className="blue-check" id={"check-" + this.state.id} onChange={this.toggleCheck} checked={this.state.completed ? "checked" : false }/>
              <label htmlFor={"check-" + this.state.id}>{this.state.description}</label>
            </div>;
  }

});