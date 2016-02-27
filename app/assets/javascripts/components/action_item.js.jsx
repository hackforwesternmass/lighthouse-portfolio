var ActionItem = React.createClass({

  getInitialState: function() {
    return { description : this.props.action_item.description,
             due_date: this.props.action_item.due_date,
             completed: this.props.action_item.completed,
             id: this.props.action_item.id
           };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({ description : nextProps.action_item.description,
                    due_date: nextProps.action_item.due_date,
                    completed: nextProps.action_item.completed,
                    id: nextProps.action_item.id
                   });
  },
  setComplete: function(){
    $.ajax({
      url: "/action_items/" + this.state.id ,
      dataType: "JSON",
      type: "PATCH",
      data: { action_item: { completed: true } },
      success: function(data) {
        this.setState({ completed: true });
      }.bind(this),
      error: function(data) {
        console.log(data);
      }
    });
  },
  setIncomplete: function(){
    $.ajax({
      url: "/action_items/" + this.state.id ,
      dataType: "JSON",
      type: "PATCH",
      data: { action_item: { completed: false } },
      success: function(data) {
        this.setState({ completed: false });
      }.bind(this),
      error: function(data) {
        console.log(data);
      }
    });
  },
  toggleCheck: function(){
    $.ajax({
      url: "/action_items/" + this.state.id ,
      dataType: "JSON",
      type: "PATCH",
      data: { action_item: { completed: !this.state.completed } },
      success: function(data) {
        this.setState({ completed: !this.state.completed });
      }.bind(this),
      error: function(data) {
        console.log(data);
      }
    });
  },
  render: function(){

    return (
      <div className="row body">
        <div className="col s9 m10">
          <input type="checkbox" className="blue-check" id={"check-" + this.state.id} onChange={this.toggleCheck} checked={this.state.completed ? "checked" : false }/>
          <label htmlFor={"check-" + this.state.id}>{this.state.description}</label>
        </div>
        <div className="col s3 m2 capitalize">{ this.state.due_date ? moment(this.state.due_date).fromNow() : "∞" }</div>
      </div>
    );

  }

});