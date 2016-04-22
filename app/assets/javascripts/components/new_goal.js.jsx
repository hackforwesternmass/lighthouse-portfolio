var NewGoal = React.createClass({
  getInitialState: function() {
    return { action_items: [{description: "", due_date: ""}], show_checklist: false, checklist_created: false  };
  },
  componentDidMount: function(){
    $(ReactDOM.findDOMNode(this)).find('.datepicker').pickadate();
  },
  closeNewGoal: function(){
    this.props.toggleNewGoal();
  },
  addNewActionItem: function(e) {
    e.preventDefault();
    this.setState({ action_items: React.addons.update(this.state.action_items, {$push: [{description: "", due_date: ""}] }) });
  },
  addActionItem: function(index, item) {
    this.setState({ action_items: React.addons.update(this.state.action_items, {$splice: [[index, 1, item]]}) });
  },
  removeActionItem: function(index){
    this.setState({ action_items: React.addons.update(this.state.action_items, {$splice: [[index, 1]]}) });
  },
  handleSubmit: function(e){
    e.preventDefault();

    if(e.target.querySelector("#goal_title").value == ""){
      Materialize.toast("Goal title is required.", 3500, "red darken-4");
      return false;
    }

    var form = new FormData(e.currentTarget);

    $.ajax({
      url: "/goals" ,
      dataType: "JSON",
      type: "POST",
      data: form,
      processData: false,
      contentType: false,
      success: function(data) {
        this.props.updateGoals();
      }.bind(this),
      error: function(data) {
        console.log(data);
      }
    });
  },
  toggleChecklist: function(){
    this.setState({ show_checklist: !this.state.checklist_created, checklist_created: !this.state.checklist_created, action_items: [{description: "", due_date: ""}] });
  },
  addChecklist: function(){
    if(!this.state.checklist_created){
      return <a onClick={this.toggleChecklist} className="add-checklist">Add Checklist...</a>;
    }

  },
  checklist: function(){
    var actionItemNodes = this.state.action_items.map(function(action_item, i){
      return (
        <NewGoal.ActionItem  {...this.props} key={i} reactKey={i} action_item={action_item} removeActionItem={this.removeActionItem} addNewActionItem={this.addNewActionItem} addActionItem={this.addActionItem} />
      );
    }.bind(this));

    if(this.state.show_checklist){
      return  <div>
                <div className="row">
                  <h6 className="bold grey-text text-darken-2 col s12 m6" style={{paddingLeft: "0.75rem"}}>
                  Checklist
                  <a onClick={this.toggleChecklist} className="add-checklist right">Delete list...</a>
                  </h6>
                </div>
                  {actionItemNodes}
                <div className="row" style={{paddingLeft: "0.75rem"}}>
                  <button name="button"
                          type="button"
                          className="btn waves-effect waves-light blue darken-1"
                          onClick={this.addNewActionItem}>
                          Add
                  </button>
                </div>
              </div>;
    }
  },
  render: function(){

    return (
    
      <div className="row new-meeting"> 
        <div className="col s12">
          <div className="card">
            <div className="card-date grey darken-3 white-text">
              New Goal
              <a className="right white-text" onClick={this.closeNewGoal}>
                <i className="fa fa-times"></i>
              </a>
            </div>
            <div className="card-content">
              <form  onSubmit={this.handleSubmit} >
                <input name="utf8" type="hidden" value="✓" />
                <input type="hidden" name="authenticity_token" value={this.props.authenticityToken} />
                <input type="hidden" value={this.props.userId} name="goal[user_id]" id="goal_user_id" />
                <div className="row">
                  <div className="input-field col s12 m8">
                    <input type='text'
                           name="goal[title]"
                           id="goal_title"
                           />
                    <label htmlFor="goal_title">Title</label>
                  </div>
                  <div className="input-field col s12 m4">
                    <input type='text'
                           className='datepicker'
                           name="goal[due_date]"
                           id="goal_due_date"
                           />
                    <label htmlFor="goal_due_date">Due Date</label>
                  </div>
                </div>
                {this.checklist()}
                <div className="row">
                  <div className="col s12">
                    {this.addChecklist()}
                    <button name="button"
                            type="submit"
                            className="btn waves-effect waves-light right">
                            Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    );

  }
});

NewGoal.ActionItem = React.createClass({
  changeDescription: function(e){
    this.props.addActionItem(this.props.reactKey, { description: e.target.value, due_date: this.props.action_item.due_date });
  },
  componentDidMount: function() {
    $(ReactDOM.findDOMNode(this)).find("#goal_action_items_attributes_" + this.props.reactKey + "_description").focus();
  },
  removeActionItem: function(){
    this.props.removeActionItem(this.props.reactKey);
  },
  tabbed: function(e){
    if(e.which === 9){
      if( $("#goal_action_items_attributes_" + (this.props.reactKey + 1) + "_description").length > 0 ){
        $(ReactDOM.findDOMNode(this)).find("#goal_action_items_attributes_" + (this.props.reactKey + 1) + "_description").focus();
      }else{
        this.props.addNewActionItem(e);
      }
    }
  },
  render: function(){
    return(
      <div className="row new-goal">
        <div className="input-field col s12 m6">
          <input type="hidden" value={this.props.action_item.id} name={"goal[action_items_attributes][" + this.props.reactKey + "][id]"} id={"goal_action_items_attributes_" + this.props.reactKey + "_id"} />
          <input type='text'
                 name={"goal[action_items_attributes][" + this.props.reactKey + "][description]"}
                 id={"goal_action_items_attributes_" + this.props.reactKey + "_description"}
                 value={this.props.action_item.description}
                 onChange={this.changeDescription}
                 onKeyDown={this.tabbed}
                 placeholder="Add an item..."
                 />
          <a className="close-goal" onClick={this.removeActionItem} ><i className="fa fa-times"/></a>
        </div>
      </div>
    );
  }

});
