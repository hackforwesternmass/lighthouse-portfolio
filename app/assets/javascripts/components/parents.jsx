const update = React.addons.update;

const Parents = React.createClass({
  getInitialState() {
    return { parents: [], studentParentIds: [] }
  },
  componentDidMount() {
    this.loadParents();
  },
  loadParents() {
    $.getJSON('/parents', { student_id: this.props.student_id }, json => {
      this.setState({ parents: json.parents, studentParentIds: json.studentParentIds })
    });
  },
  toggleParentId(e) {
    if(e.currentTarget.checked) {
      this.setState({ studentParentIds: update(this.state.studentParentIds, { $push: [parseInt(e.currentTarget.value)]}) });
    } else {
      this.setState({ studentParentIds: update(this.state.studentParentIds, { $splice: [[this.state.studentParentIds.indexOf(e.currentTarget.value), 1]]  }) });
    }
  },
  submit(e) {
    e.preventDefault();
    $.ajax({
      url: `/parents`,
      dataType: 'JSON',
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
          <h3>Existing Parents</h3>
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
