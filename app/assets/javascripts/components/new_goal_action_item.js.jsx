var NewGoalActionItem = React.createClass({
  getInitialState: function() {
    return { description: this.props.action_item.description, due_date: this.props.action_item.due_date, id: this.props.action_item.id }
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({ description: nextProps.action_item.description, due_date: nextProps.action_item.due_date, id: nextProps.action_item.id });
  },
  changeDescription: function(e){
    this.props.addActionItem(this.props.reactKey, { description: e.target.value, due_date: this.state.due_date });
  },
  removeActionItem: function(){
    this.props.removeActionItem(this.props.reactKey);
  },
  render: function(){
    return(
      <div className="row new-goal">
        <div className="input-field col s12 m6">
          <input type="hidden" value={this.state.id} name={"goal[action_items_attributes][" + this.props.reactKey + "][id]"} id={"goal_action_items_attributes_" + this.props.reactKey + "_id"} />
          <input type='text'
                 name={"goal[action_items_attributes][" + this.props.reactKey + "][description]"}
                 id={"goal_action_items_attributes_" + this.props.reactKey + "_description"}
                 value={this.state.description}
                 onChange={this.changeDescription}
                 placeholder="Add an item..."
                 />
          <a className="close-goal" onClick={this.removeActionItem} ><i className="fa fa-times"/></a>
        </div>
      </div>
    );
  }

});