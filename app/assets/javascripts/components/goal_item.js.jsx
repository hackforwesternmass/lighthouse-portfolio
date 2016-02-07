var GoalItem = React.createClass({
  getInitialState: function() {
    var action_items = $.map(this.props.goal.action_items, function(v, i){
      return v.action_item;
    });

    return { title: this.props.goal.title,
             action_items: action_items,
             editing: this.props.goal.editing,
             created_at: this.props.goal.created_at,
             due_date: this.props.goal.due_date,
             show_checklist: false };
  },
  componentWillReceiveProps: function(nextProps) {

    var action_items = $.map(nextProps.goal.action_items, function(v, i){
      return v.action_item;
    });

    this.setState({ title: nextProps.goal.title, 
                    action_items: action_items,
                    editing: nextProps.goal.editing,
                    created_at: nextProps.goal.created_at,
                    due_date: nextProps.goal.due_date });
  },
  calculateProgress: function(){
    var counter = 0;
    $.each(this.state.action_items, function(i, action_item){
      if(action_item.completed){
        counter += 1;
      }
    });

    var progress = 0;

    if(this.state.action_items.length > 0){
      progress = (counter/this.state.action_items.length * 100).toFixed(0);
    }

    return progress;
  },
  progress: function(){
    var progress = this.calculateProgress();
    if(this.state.action_items.length > 0){
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

    var actionItemNodes = this.state.action_items.map(function(action_item, i){
      return <GoalActionItem {...this.props} action_item={action_item} key={i} reactKey={i}/>;
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
    }else if(!this.state.show_checklist && this.state.action_items.length > 0){
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
              {this.state.title}
            </div>
            <div className="row grey-text no-margin">
              <div className="col s6">DATE SET</div>
              <div className="col s6 right-align">DEADLINE</div>
            </div>
            <div className="row">
              <div className="col s6">{moment(this.state.created_at).format("MMMM D YYYY")}</div>
              <div className="col s6 right right-align">{ this.state.due_date ? moment(this.state.due_date).format("MMMM D YYYY") : "∞" }</div>
            </div> 

            {this.progress()}

            {this.checklist()}

            </div>
          </div>
        </div>
      </div>

    )
  }
});