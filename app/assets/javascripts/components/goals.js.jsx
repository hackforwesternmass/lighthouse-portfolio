var Goals = React.createClass({

  getInitialState: function() {
    return { newGoal: false, goals: [] };
  },
  componentDidMount: function() {
    $.get("/goals", function(data){
      var goals = $.map(data, function(obj){
        return { title: obj.goal.title,
                 action_items: obj.goal.action_items,
                 due_date: obj.goal.due_date,
                 id: obj.goal.id,
                 created_at: obj.goal.created_at,
                 editing: false };
      });
      this.setState({ goals: goals });
    }.bind(this));
  },
  toggleNewGoal: function(){
    this.setState({ newGoal: !this.state.newGoal });
  },
  setActionItemComplete: function(index, val, goal_index){
    this.setState({ goals: React.addons.update(this.state.goals, {[goal_index]: { action_items: { [index]: {action_item: { completed: {$set: val } } } } } })  });
  },
  updateGoals: function(){
    $.get("/goals", function(data){
      var goals = $.map(data, function(obj){
        return { title: obj.goal.title,
                 action_items: obj.goal.action_items,
                 due_date: obj.goal.due_date,
                 id: obj.goal.id,
                 created_at: obj.goal.created_at,
                 editing: false };
      });
      this.setState({ goals : goals });
      this.toggleNewGoal();
    }.bind(this));
  },
  newGoal: function(){
    if( this.state.newGoal ){
      return <NewGoal {...this.props} toggleNewGoal={this.toggleNewGoal} updateGoals={this.updateGoals}/>
    }else{
      return <a onClick={this.toggleNewGoal} className="hide-on-small-only">
               <div className="row">
               <div className="col s12">
                 <div className="card grey darken-1 no-margin hoverable">
                   <div className="card-content white-text center-align">
                     <h6><i className="fa fa-plus-circle"></i> ADD GOAL</h6>
                   </div>
                 </div>
              </div>
            </div>
           </a>; 
    }
  },
  render: function(){
    var goalItemNodes = this.state.goals.map(function(goal, i){
      return (
        <GoalItem {...this.props} goal={goal} key={i} reactKey={i} goalIndex={i} setActionItemComplete={this.setActionItemComplete}/>
      );
    }.bind(this));

    return (
      <div>
        {this.newGoal()}
        {goalItemNodes}
      </div>
    );
  }
});