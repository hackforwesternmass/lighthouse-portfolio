const Resources = React.createClass({
  getInitialState() {
    return { generalResources: {}, resources: {}, editing: false }
  },
  componentDidMount() {
    this.updateResourceGroup()
  },
  toggleEdit(e) {
    e.preventDefault()
    this.setState({
      editing: !this.state.editing
    })
  },
  updateResourceGroup() {
    $.ajax({
      url: `/users/${this.props.userId}/resources`,
      success: json => {
        this.setState({ generalResources: json.general_resources, resources: json.resources });
      }
    });
  },
  render() {
    const {generalResources, resources, editing} = this.state;
    return (
      <div>
        <nav>
          <div className='nav-wrapper'>
            <span className='breadcrumb'>
              <a href={`/users/${this.props.userId}/resources`}>Resources</a>
            </span>
            {this.props.editable && <div className='dropdown-wrapper hide-on-small-only'>
              <a className='right ellipsis-link' href='#'>
                <i className='fa fa-ellipsis-h'></i>
              </a>
              <ul className='dropdown z-depth-1'>
                <li>
                  <a href={`/users/${this.props.userId}/resources/new`}>Create resource</a>
                </li>
                {(Object.keys(generalResources).length > 0 || Object.keys(resources).length > 0) && <li>
                  <a href='#' onClick={this.toggleEdit}>
                    {editing
                      ? 'Finished editing'
                      : 'Edit resources'}
                  </a>
                </li>
}
              </ul>
            </div>
}
          </div>
        </nav>
        <section className='section-container'>
          <div id='category-grid' className='row'>
            {Object.keys(generalResources).map((category, i) => {
              return <ResourceCategories {...this.props} updateResourceGroup={this.updateResourceGroup} editing={editing} resources={generalResources[category]} categoryName={category} key={category} userId={this.props.userId} general={true}/>
            })
}
            {Object.keys(resources).map((category, i) => {
              return <ResourceCategories {...this.props} updateResourceGroup={this.updateResourceGroup} editing={editing} resources={resources[category]} categoryName={category} userId={this.props.userId} key={category} general={false}/>
            })
}
          </div>
        </section>
      </div>
    );
  }
});

var ResourceCategories = React.createClass({
  getInitialState() {
    return {categoryName: this.props.categoryName, resources: this.props.resources, editing: this.props.editing, general: this.props.general};
  },
  componentWillReceiveProps(nextProps) {
    this.setState({categoryName: nextProps.categoryName, resources: nextProps.resources, editing: nextProps.editing, general: nextProps.general});
  },
  changeCategoryName(e) {
    e.preventDefault();
    $.ajax({
      url: `/users/${this.props.userId}/resources/change_category`,
      type: 'POST',
      data: {
        old_category: this.state.categoryName,
        new_category: e.target.value
      },
      success: data => this.props.updateResourceGroup()
    });
  },
  deleteResource(e) {
    e.preventDefault();

    if (!confirm('Are you sure you would like to remove this resource?')) {
      return false;
    }

    $.ajax({
      url: e.target.parentElement.pathname,
      type: 'DELETE',
      success: () => {
        Materialize.toast('Resource successfully deleted!', 3500, 'teal')
        this.props.updateResourceGroup()
      },
      error: () => {
        Materialize.toast('Failed to delete resource', 3500, 'red darken-3')
      }
    });
  },
  render() {

    let categoryName;

    if (this.state.general) {
      if (this.state.editing && this.props.isAdmin) {
        categoryName = <input type='text' id='changing_resource_category' onBlur={this.changeCategoryName} defaultValue={this.state.categoryName}/>;
      } else {
        categoryName = <div className='category-name truncate' href='#'>{this.state.categoryName}</div>;
      }
    } else {
      if (this.state.editing) {
        categoryName = <input type='text' id='changing_resource_category' onBlur={this.changeCategoryName} defaultValue={this.state.categoryName}/>;
      } else {
        categoryName = <div className='category-name truncate' href='#'>{this.state.categoryName}</div>;
      }
    }

    const resourceNodes = this.state.resources.map((resource, i) => {
      let editing,
        deleting;
      if (this.state.general) {
        if (this.state.editing && this.props.isAdmin) {
          deleting = <a className='right' rel='nofollow' onClick={this.deleteResource} href={`/users/${this.props.userId}/resources/${resource.id}`}>
            <i className='fa fa-trash-o'></i>
          </a>;
          editing = <a className='right' href={`/users/${this.props.userId}/resources/${resource.id}/edit`}>
            <i className='fa fa-pencil'></i>
          </a>;
        }
      } else {
        if (this.state.editing) {
          deleting = <a className='right' rel='nofollow' onClick={this.deleteResource} href={`/users/${this.props.userId}/resources/${resource.id}`}>
            <i className='fa fa-trash-o'></i>
          </a>;
          editing = <a className='right' href={`/users/${this.props.userId}/resources/${resource.id}/edit`}>
            <i className='fa fa-pencil'></i>
          </a>;
        }
      }

      return (
        <li key={i}>
          <a className={'resource-link thick ' + (this.state.general
            ? 'general'
            : '')} target='_blank' href={resource.link}>{resource.title}</a>
          {deleting}
          {editing}
          <p>{resource.description}</p>
        </li>
      )
    })

    const {general, resources, editing} = this.props;

    return (
      <div className='resource-item col s12 m6 l4'>
        <div className={'resource-category thick z-depth-1 ' + (general ? 'general' : '')}>
          {categoryName}
        </div>
        <ul>
          {resourceNodes}
        </ul>
      </div>
    );
  }

});
