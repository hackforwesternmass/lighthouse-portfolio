var NewActionItem = React.createClass({

  getInitialState: function() {
    return { description: this.props.action_item.description, due_date: this.props.action_item.due_date, id: this.props.action_item.id }
  },
  componentDidMount: function() {
    $(ReactDOM.findDOMNode(this)).find('.datepicker').pickadate();
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({ description: nextProps.action_item.description, due_date: nextProps.action_item.due_date, id: nextProps.action_item.id });
  },
  componentDidEnter: function(e) {
    $(ReactDOM.findDOMNode(this)).velocity("slideDown", { duration: 500, easing: "easeOutQuad" });
  },
  changeDescription: function(e){
    this.props.addActionItem(this.props.reactKey, { description: e.target.value, due_date: this.state.due_date, id: this.state.id });
  },
  changeDueDate: function(e){
    this.props.addActionItem(this.props.reactKey, { description: this.state.description, due_date: $("input.datepicker")[ this.props.reactKey ].value, id: this.state.id });
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

    console.log(this.state);

    return (

      <li key={this.props.reactKey} className='collection-item'>
        <input type="hidden" value={this.state.id} name={"meeting[action_items_attributes][" + this.props.reactKey + "][id]"} id={"meeting_action_items_attributes_" + this.props.reactKey + "_id"} />
        <a style={ { right: '0', position: 'absolute' } } className="right close grey-text text-darken-2" onClick={this.handleClickClose} ><i className="fa fa-times"></i></a>
        <div className="row no-margin">
          <div className="col s1 right-align no-padding">
            <h4 className="blue-text text-darken-1">{this.props.reactKey + 1}</h4>
          </div>
          <div className="input-field col s8">
            <input type="text" 
                    name={"meeting[action_items_attributes][" + this.props.reactKey + "][description]"} 
                    id={"meeting_action_items_attributes_" + this.props.reactKey + "_description"}
                    placeholder="Description"
                    className="action_item"
                    value={this.state.description}
                    onChange={this.changeDescription}
                    />

          </div>
          <div className="input-field col s3 no-padding" onBlur={this.changeDueDate}>
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