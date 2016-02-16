var Resources = React.createClass({

  getInitialState: function() {
    return { generalResourceGrouping: {} ,resourceGrouping: {}, editing: false }
  },
  componentDidMount: function() {
    $.getJSON("/resources" , function(data){
      this.setState({ generalResourceGrouping: data.general_resources, 
        resourceGrouping: data.resources });
      salvattore.init();
    }.bind(this));
  },
  toggleEdit: function(e) {
    e.preventDefault();
    this.setState({ editing: !this.state.editing });
  },
  updateResourceGroup: function() {
    $.getJSON("/resources" , function(data){
      this.setState({ resourceGrouping : data });
    }.bind(this));
  },
  render: function() {

    var categories = [];
    var generalCategories = [];

    for (var key in this.state.resourceGrouping) {
      if (this.state.resourceGrouping.hasOwnProperty(key)) {
        categories.push(key);
      }
    }

    for (var key in this.state.generalResourceGrouping) {
      if (this.state.generalResourceGrouping.hasOwnProperty(key)) {
        generalCategories.push(key);
      }
    }

    var resourceCategories = categories.map(function(category, i){
      return (
        <ResourceCategories {...this.props} updateResourceGroup={this.updateResourceGroup} 
          editing={this.state.editing} resources={this.state.resourceGrouping[category]} 
          categoryName={category} key={i} general={false}/>
      );
    }.bind(this));

    var generalResourceCategories = generalCategories.map(function(category, i){
      return (
        <ResourceCategories {...this.props} updateResourceGroup={this.updateResourceGroup} 
          editing={this.state.editing} resources={this.state.generalResourceGrouping[category]} 
          categoryName={category} key={i} general={true}/>
      );
    }.bind(this));


    var editing;

    if(this.state.editing){
      editing = <li><a href="#" onClick={this.toggleEdit} >Finished editing</a></li>
    }else{
      editing = <li><a href="#" onClick={this.toggleEdit} >Edit resources</a></li>;
    }

    return (
      <div>
        <nav>
          <div className="nav-wrapper">
            <div className="brand-logo">Resources</div>
            <div className="dropdown-wrapper hide-on-small-only">
              <a className="right ellipsis-link" href="#"><i className="fa fa-ellipsis-h"></i></a>
              <ul className="dropdown z-depth-1">
                <li><a href="/resources/new">Create resource</a></li>
                {editing}
              </ul>
            </div>
          </div>
        </nav>
        <section className="section-container">
          <div id="category-grid" data-columns className="row">
            {generalResourceCategories}
            {resourceCategories}
          </div>
        </section>
      </div>
    );
  }

});

var ResourceCategories = React.createClass({

  getInitialState: function() {
    return { categoryName: this.props.categoryName, 
             resources: this.props.resources,
             editing: this.props.editing,
             general: this.props.general };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({ categoryName: nextProps.categoryName,
                    resources: nextProps.resources,
                    editing: nextProps.editing,
                    general: nextProps.general });
  },
  changeCategoryName: function(e){
    e.preventDefault();

    $.ajax({
      url: "/resources/change_category",
      dataType: "JSON",
      type: "POST",
      data: { old_category: this.state.categoryName, new_category: e.target.value },
      success: function(data) {
        this.props.updateResourceGroup();
      }.bind(this),
      error: function(data) {
        console.log(data);
      }
    });

  },
  deleteResource: function(e) {
    e.preventDefault();
    $.ajax({
      url: e.target.parentElement.pathname,
      dataType: "JSON",
      type: "DELETE",
      success: function(data) {
        this.props.updateResourceGroup();
      }.bind(this)
    });
  },
  render: function(){

    var categoryName;

    if(this.state.editing){
      categoryName = <input type="text" id="changing_resource_category" onBlur={this.changeCategoryName} defaultValue={this.state.categoryName} />;
    }else{
      categoryName = <div className="category-name truncate" href="#">{this.state.categoryName}</div>;
    }

    var resourceNodes = this.state.resources.map(function(resource, i){

      var editing, deleting;

      if(this.state.general){
        if(this.state.editing && this.props.isAdmin){
          deleting = <a className="right" rel="nofollow" onClick={this.deleteResource} href={"/resources/" + resource.id }><i className="fa fa-trash-o"></i></a>;
          editing  =  <a className="right" href={"/resources/"+ resource.id +"/edit"}><i className="fa fa-pencil"></i></a>;
        } 
      }else{
        if(this.state.editing){
          deleting = <a className="right" rel="nofollow" onClick={this.deleteResource} href={"/resources/" + resource.id }><i className="fa fa-trash-o"></i></a>;
          editing  =  <a className="right" href={"/resources/"+ resource.id +"/edit"}><i className="fa fa-pencil"></i></a>;
        }
      }


      return  <li key={i}>
                <a className={"resource-link thick " + (this.state.general ? "general" : "")} target="_blank" href={resource.link} >{resource.title}</a>
                {deleting}
                {editing}
                <p>{resource.description}</p>
              </li>;

    }.bind(this)); 

    return (
        <div className="resource-item col s12">
          <div className={"resource-category thick z-depth-1 " + (this.state.general ? "general" : "") }>
          {categoryName}
          </div>
          <ul>
          {resourceNodes}
          </ul>
        </div>
    );
  }

});
