var GoalItem = React.createClass({
  getInitialState: function() {
    return { show_checklist: false };
  },
  toggleComplete: function(e){
    e.preventDefault();
    $.ajax({
      url: "/goals/" + this.props.goal.id ,
      dataType: "JSON",
      type: "PATCH",
      data: { goal: { is_completed: !this.props.goal.is_completed } },
      success: function() {
        if(!this.props.goal.is_completed){
          Materialize.toast("Goal complete!!!", 3500, "teal");
        }
        this.props.updateGoals();
      }.bind(this),
      error: function() {
        console.log("ERROR - SETTING GOAL COMPLETE");
      }
    });
  },
  delete: function(e){
    e.preventDefault();

    if(!confirm("Are you sure you would like to remove this goal?")){
      return false;
    }

    $.ajax({
      url: "/goals/" + this.props.goal.id ,
      dataType: "JSON",
      type: "DELETE",
      success: function() {
        this.props.updateGoals();
      }.bind(this),
      error: function() {
        console.log("ERROR - DELETING GOAL");
      }
    });
  },
  calculateProgress: function(){
    var counter = 0;
    $.each(this.props.goal.action_items, function(i, action_item){
      if(action_item.completed){
        counter += 1;
      }
    });

    var progress = 0;

    if(this.props.goal.action_items.length > 0){
      progress = (counter/this.props.goal.action_items.length * 100).toFixed(0);
    }

    return progress;
  },
  progress: function(){
    var progress = this.calculateProgress();
    if(this.props.goal.action_items.length > 0){
      return <div style={{padding: "0 0.75rem"}}>
              <div className="row">
                <div className="grey-text">
                  PROGRESS
                </div>
              </div>
              <div className="row">
                <div className="progress-bar">
                  <div className="completed-progress-bar" style={{ width: progress + "%" }} ></div>
                  <div className="progress-bar-text">{progress}% Complete</div>
                </div>
              </div>
             </div>;
    }
  },
  toggleShowActionItems: function(){
    this.setState({ show_checklist: !this.state.show_checklist });
  },
  checklist: function(){
    var actionItemNodes = this.props.goal.action_items.map(function(action_item, i){
      return <GoalItem.ActionItem {...this.props} action_item={action_item} key={i} reactKey={i}/>;
    }.bind(this));

    if(this.state.show_checklist){
      return <div style={{padding: "0 0.75rem"}}>
              <div className="row">
                <div className="grey-text add-checklist" onClick={this.toggleShowActionItems}>
                  CHECKLIST
                </div>
              </div>
                <form>
                  {actionItemNodes}
                </form>
             </div>;
    }else if(!this.state.show_checklist && this.props.goal.action_items.length > 0){
      return <a onClick={this.toggleShowActionItems} className="add-checklist" style={{padding: "0 0.75rem"}}>Show Checklist...</a>;
    }
  },
  render: function(){
    return (

      <div className="row">
        <div className="col s12">
          <div className="card">
            <div className="card-content">
            <div className="goal-title">
              {this.props.goal.title}
            </div>
            <div className="row grey-text no-margin">
              <div className="col s6">DATE SET</div>
              <div className="col s6 right-align">DEADLINE</div>
            </div>
            <div className="row">
              <div className="col s6">{moment(this.props.goal.created_at).format("MMMM D YYYY")}</div>
              <div className="col s6 right right-align">{ this.props.goal.due_date ? moment(this.props.goal.due_date).format("MMMM D YYYY") : "∞" }</div>
            </div>

            {this.progress()}

            {this.checklist()}
            <a href="#" className="delete" onClick={this.delete} >Remove...</a>

            </div>
            <a href="#" className={this.props.goal.is_completed ? "complete-btn" : "incomplete-btn"} onClick={this.toggleComplete}>{this.props.goal.is_completed ? "Completed" : "Finished?" }</a>
          </div>
        </div>
      </div>

    )
  }
});

GoalItem.ActionItem = React.createClass({
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
        this.props.updateGoals();
      }.bind(this),
      error: function(data) {
        // TODO
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
