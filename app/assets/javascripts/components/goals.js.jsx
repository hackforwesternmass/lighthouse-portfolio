var Goals = React.createClass({
  getInitialState: function() {
    return { newGoal: false, goals: [] };
  },
  componentDidMount: function() {
    $.getJSON("/goals", function(goals){
      this.setState({ goals: goals });
    }.bind(this));
  },
  toggleNewGoal: function(){
    this.setState({ newGoal: !this.state.newGoal });
  },
  updateGoals: function(){
    $.getJSON("/goals", function(goals){
      this.setState({ goals: goals, newGoal: false });
    }.bind(this));
  },
  render: function(){
    var goalItemNodes = this.state.goals.map(function(goal, i){
      return (
        <GoalItem {...this.props} goal={goal} key={i} reactKey={i} goalIndex={i} updateGoals={this.updateGoals}/>
      );
    }.bind(this));

    return (
      <div>
        <Goals.NewGoal {...this.props} updateGoals={this.updateGoals} newGoal={this.state.newGoal}/>
        {goalItemNodes}
      </div>
    );
  }
});

Goals.NewGoal = React.createClass({
  getInitialState: function() {
    return { newGoal: false };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({ newGoal: nextProps.newGoal });
  },
  toggleNewGoal: function(){
    this.setState({ newGoal: !this.state.newGoal });
  },
  newGoal: function(){
    if( this.state.newGoal ){
      return <NewGoal {...this.props} toggleNewGoal={this.toggleNewGoal}/>
    }else{
      return <a onClick={this.toggleNewGoal} className="hide-on-small-only">
               <div className="row">
               <div className="col s12">
                 <div className="card grey darken-3 no-margin hoverable">
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
    return <div>{this.newGoal()}</div>
  }
});