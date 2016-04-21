var MeetingItem = React.createClass({
  getInitialState: function() {
    return { action_items: this.props.meeting.action_items, 
             editing: this.props.meeting.editing,
             notes: this.props.meeting.notes, 
             created_at: this.props.meeting.created_at };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({ action_items: nextProps.meeting.action_items,
                    notes: nextProps.meeting.notes,
                    editing: nextProps.meeting.editing,
                    created_at: nextProps.meeting.created_at });
  },
  handleClickEdit: function(e){
    e.preventDefault();
    this.props.closeAllMeetings(this.props.reactKey);
  },
  handleClickDestroy: function(e){
    e.preventDefault();
    $.ajax({
      url: "/meetings/" + this.props.meeting.id,
      dataType: "JSON",
      type: "DELETE",
      success: function(data) {
        this.props.updateMeetings();
      }.bind(this)
    });
  },
  actionItems: function(){
    var actionItemNodes = this.state.action_items.map(function(action_item, i){
      return (
        <MeetingItem.ActionItem {...this.props} action_item={action_item} key={i} reactKey={i} />
      );
    }.bind(this));

    if(this.state.action_items.length > 0){
      return  ( <div className="action-items">
                  <div className="row title">
                    <div className="col s2 center-align">ACTION ITEMS</div>
                    <div className="col s6 push-s4">DUE</div>
                  </div>
                  {actionItemNodes}
                </div> );
    }
  },
  closeNewMeeting: function(){
    this.setState({ editing: false });
  },
  render: function(){

    var mainContent;

    if(!this.state.editing){
      mainContent = <div className="row">
                      <div className="col s12">
                        <div className="card">
                          <div className="card-date">
                            {moment(this.state.created_at).format("MMMM D YYYY")}
                            <a href="#" className="right white-text" onClick={this.handleClickDestroy} data-confirm="Are you sure that you want to delete the meetings notes?" rel="nofollow" ><i className="fa fa-times"></i></a>
                            <a href="#" className="right white-text hide-on-small-only" onClick={this.handleClickEdit} ><i className="fa fa-edit"></i></a>
                          </div>
                          <div className="card-content">

                            <div dangerouslySetInnerHTML={{ __html: this.state.notes }} />
                            {this.actionItems()}
                          </div>
                        </div>
                      </div>
                    </div>;
    }else{
      mainContent = <EditMeeting {...this.props} closeNewMeeting={this.closeNewMeeting} />;
    }

    return (

      <div>
        {mainContent}
      </div>

    );

  }
});

MeetingItem.ActionItem = React.createClass({

  getInitialState: function() {
    return { description : this.props.action_item.description,
             due_date: this.props.action_item.due_date,
             completed: this.props.action_item.completed,
             id: this.props.action_item.id,
             admin_id: this.props.action_item.user_id,
             reactKey: this.props.reactKey
           };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({ description : nextProps.action_item.description,
                    due_date: nextProps.action_item.due_date,
                    completed: nextProps.action_item.completed,
                    id: nextProps.action_item.id,
                    admin_id: nextProps.action_item.user_id,
                    reactKey: nextProps.reactKey
                   });
  },
  toggleCheck: function(){
    $.ajax({
      url: "/action_items/" + this.state.id ,
      dataType: "JSON",
      type: "PATCH",
      data: { action_item: { completed: !this.state.completed } },
      success: function(data) {
        this.props.updateMeetings();
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
          <label htmlFor={"check-" + this.state.id}><span className="blue-text text-lighten-2">{this.state.admin_id ? "Teacher task: " : ""}</span>{this.state.description}</label>
        </div>
        <div className="col s3 m2 capitalize">{ this.state.due_date ? moment(this.state.due_date).fromNow() : "∞" }</div>
      </div>
    );

  }

});