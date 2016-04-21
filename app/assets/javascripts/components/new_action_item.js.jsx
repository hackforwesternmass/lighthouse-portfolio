var NewActionItem = React.createClass({
  getInitialState: function() {
    return { description: this.props.action_item.description,
             due_date: this.props.action_item.due_date,
             id: this.props.action_item.id,
             admin: this.props.action_item.user_id }
  },
  componentDidMount: function() {
    $(ReactDOM.findDOMNode(this)).find('.datepicker').pickadate();
    $(ReactDOM.findDOMNode(this)).find('.tooltipped').tooltip();
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({ description: nextProps.action_item.description, due_date: nextProps.action_item.due_date, id: nextProps.action_item.id });
  },
  componentDidEnter: function(e) {
    $(ReactDOM.findDOMNode(this)).velocity("slideDown", { duration: 500, easing: "easeOutQuad" });
  },
  changeDescription: function(e) {
    this.props.addActionItem(this.props.reactKey, { description: e.target.value, due_date: this.state.due_date, id: this.state.id });
  },
  changeDueDate: function(e) {
    this.props.addActionItem(this.props.reactKey, { description: this.state.description, due_date: $("input.datepicker")[ this.props.reactKey ].value, id: this.state.id });
  },
  toggleAdmin: function() {
    this.setState({ admin: !this.state.admin });
  },
  handleClickClose: function(e) {
    e.preventDefault();

    if(this.state.id){
      $.ajax({
        url: "/action_items/" + this.state.id,
        dataType: "JSON",
        type: "DELETE",
        success: function(data) {
          this.props.removeActionItem(this.props.reactKey);
        }.bind(this)
      });
    }else{
      this.props.removeActionItem(this.props.reactKey);
    }

  },
  render: function(){

    return (

      <li key={this.props.reactKey} className='collection-item'>
        <input type="hidden" value={this.state.id} name={"meeting[action_items_attributes][" + this.props.reactKey + "][id]"} id={"meeting_action_items_attributes_" + this.props.reactKey + "_id"} />
        <div className="row">
          {<i style={ { fontSize: 16, right: 20, top: 5, position: 'absolute' } } data-position="top" data-delay="50" data-tooltip={this.state.admin ? "Unassign teacher" : "Assign to teacher" } className={ this.state.admin ? "fa fa-user blue-text tooltipped" : "fa fa-user grey-text text-darken-2 tooltipped"} onClick={this.toggleAdmin}></i>}
          <a style={ { fontSize: 25, right: 10, top: 2, position: 'absolute' } } className="close grey-text text-darken-2" onClick={this.handleClickClose} >×</a>
          <input type="hidden" value={this.state.admin ? this.props.admin_id : "" } name={"meeting[action_items_attributes][" + this.props.reactKey + "][user_id]"} id={"meeting_action_items_attributes_" + this.props.reactKey + "_user_id"} />

          <div className="input-field col s9">
            <input type="text" 
                    name={"meeting[action_items_attributes][" + this.props.reactKey + "][description]"} 
                    id={"meeting_action_items_attributes_" + this.props.reactKey + "_description"}
                    placeholder="Description"
                    className="action_item"
                    value={this.state.description}
                    onChange={this.changeDescription}
                    />

          </div>
          <div className="input-field col s3" onBlur={this.changeDueDate}>
             <input type='text' 
                    className='datepicker'
                    name={"meeting[action_items_attributes]" + this.props.reactKey + "[due_date]"} 
                    id={"meeting_action_items_attributes_" + this.props.reactKey + "_due_date"}
                    placeholder="Due Date"
                    value={ this.state.due_date ? moment(this.state.due_date).format("D MMMM, YYYY") : "" }
                    onChange={this.changeDueDate}
                    />
          </div>
        </div>
      </li>


    );
  }

});

          // {this.props.admin_id ? <i style={ { fontSize: "12px", right: '20px', top: '5px', position: 'absolute' } } data-position="top" data-delay="50" data-tooltip={this.state.admin ? "Unassign teacher" : "Assign to teacher" } className={ this.state.admin ? "fa fa-user blue-text tooltipped" : "fa fa-user grey-text text-darken-2 tooltipped"} onClick={this.toggleAdmin}></i> : null}

