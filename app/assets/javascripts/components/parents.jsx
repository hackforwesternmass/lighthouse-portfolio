const update = React.addons.update;

const Parents = React.createClass({
  getInitialState() {
    return { parents: [], studentParentIds: [] }
  },
  componentDidMount() {
    this.loadParents();
  },
  loadParents() {
    $.ajax({
      url: '/parents',
      data: { student_id: this.props.student_id },
      success: json => {
        this.setState({ parents: json.parents, studentParentIds: json.studentParentIds })
      }
    });
  },
  toggleParentId(e) {
    const { studentParentIds } = this.state;
    const { value } = e.currentTarget;
    if(studentParentIds.indexOf(parseInt(value)) > -1) {
      this.setState({ studentParentIds: update(studentParentIds, { $splice: [[studentParentIds.indexOf(parseInt(value)), 1]]  }) });
    } else {
      this.setState({ studentParentIds: update(studentParentIds, { $push: [parseInt(value)]}) });
    }
  },
  submit(e) {
    e.preventDefault();
    $.ajax({
      url: `/parents`,
      type: 'POST',
      data: { student_id: this.props.student_id, student_parent_ids: this.state.studentParentIds },
      success: () => {
        Materialize.toast('Updated parents successfully!', 3500, 'teal');
      }
    });
  },
  render() {
    const { parents, studentParentIds } = this.state;
    return(
      <div className='section-container'>
        <div className='row'>
          <h4>Existing Parents</h4>
        </div>

        <div className='parents'>
          <form onSubmit={this.submit}>
            <input type='hidden' name='student_id' value={this.props.studentId} id='student_id' />
              {
                parents.map(parent => {
                  return(
                    <div className='row' key={parent.id}>
                      <input type='checkbox' id={`parent_${parent.id}`} onChange={this.toggleParentId} value={parent.id} checked={studentParentIds.indexOf(parent.id) > -1} className='filled-in' />
                      <label htmlFor={`parent_${parent.id}`}>{parent.full_name}</label>
                    </div>
                  );
                })
               }
              <input type='submit' name='commit' value='Save' className='btn' />
              {' '}
              <a className='btn btn-flat' href='/users'>Back</a>
            </form>
          </div>
        </div>
    );
  }
});
