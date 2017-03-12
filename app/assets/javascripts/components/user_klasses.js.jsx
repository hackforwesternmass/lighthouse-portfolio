const UserKlasses = React.createClass({
  getInitialState() {
    return {
      enrolledKlasses: [],
      allKlasses: [],
      showArchivedKlasses: false,
      loading: true,
    }
  },
  componentDidMount() {
    this.loadEnrolledKlasses();
    this.loadAllKlasses();
    $('.modal').modal();
  },
  loadEnrolledKlasses() {
    $.ajax({
      url: `/users/${this.props.userId}/classes`,
      success: enrolledKlasses => {
        this.setState({ enrolledKlasses, loading: false });
      },
      error: () => {
        Materialize.toast('An error has occured loading enrolled classes.', 3500, 'red darken-4');
      }
    });
  },
  loadAllKlasses() {
    this.previousYear = null;
    $.ajax({
      url: `/class`,
      success: allKlasses => {
        this.setState({ allKlasses, loading: false })
      },
      error: () => {
        Materialize.toast('An error has occured loading all classes.', 3500, 'red darken-4');
      }
    });
  },
  toggleArchiveKlass(e) {
    e.preventDefault();
    const { klassId, enrollId, value } = e.currentTarget.dataset;

    $.ajax({
      url: `/users/${this.props.userId}/classes/${klassId}`,
      type: 'PATCH',
      data: { klass: { enrolls_attributes: {'0': { id: enrollId, completed: value == 'true' } } } },
      success: () => {
        this.loadEnrolledKlasses();
        this.loadAllKlasses();
      },
      error: () => {
        Materialize.toast('An error occured. Reload the page and try toggling class checkbox again.', 3500, 'red darken-4');
      }
    });
  },
  hasArchivedKlasses() {
    return this.state.enrolledKlasses.reduce((completed, value) =>  completed || value.completed, false)
  },
  toggleShowArchiveKlasses(e) {
    e.preventDefault();
    this.setState({ showArchivedKlasses: !this.state.showArchivedKlasses });
  },
  toggleEnrolledKlass(e){
    const klassId = e.currentTarget.value;
    const { checked } = e.currentTarget;
    const { enrollId } = e.currentTarget.dataset;

    let data = { klass: { enrolls_attributes: {'0': { user_id: this.props.userId } } } }

    if(!checked) {
      data = { klass: { enrolls_attributes: {'0': { id: enrollId, _destroy: true } } } }
    }

    $.ajax({
      url: `/users/${this.props.userId}/classes/${klassId}`,
      type: 'PATCH',
      data,
      success: () => {
        this.loadEnrolledKlasses();
        this.loadAllKlasses();
      },
      error: () => {
        Materialize.toast('An error occured. Reload the page and try toggling class checkbox again.', 3500, 'red darken-4');
      }
    });
  },
  render() {
    const { enrolledKlasses, allKlasses, loading, showArchivedKlasses } = this.state;
    return(
      <div className='section-container'>
        <h3 className='teal-text'>Enrolled Classes</h3>

        <a href='#enroll-modal' className='btn'>Enroll to class</a>

        {
          enrolledKlasses.length > 0 &&
          <div style={{margin: '20px 0'}}>
            <ul className='collection'>
              {
                enrolledKlasses.map(klass => {
                  if(klass.completed) return false;
                  return(
                    <li className='collection-item' key={klass.id}>
                      <div>{klass.name}
                        <a href='#'
                           data-klass-id={klass.id}
                           data-enroll-id={klass.enroll_id}
                           data-value={true}
                           onClick={this.toggleArchiveKlass}
                           className='secondary-content'>
                           <i className='material-icons'>archive</i>
                        </a>
                      </div>
                    </li>
                  )
                })
              }
            </ul>
          </div>
        }

        {
          this.hasArchivedKlasses() && !showArchivedKlasses &&
          <a href='#' onClick={this.toggleShowArchiveKlasses} className='btn btn-flat'>View Archived Classes</a>
        }

        {
          this.hasArchivedKlasses() && showArchivedKlasses &&
          <div>
            <h5>Archived Classes</h5>

              <div style={{margin: '20px 0'}}>
                <ul className='collection'>
                  {
                    enrolledKlasses.map(klass => {
                      if(!klass.completed) return false;
                      return(
                        <li className='collection-item' key={klass.id}>
                          <div>{klass.name}
                            <a href='#'
                               data-klass-id={klass.id}
                               data-enroll-id={klass.enroll_id}
                               data-value={false}
                               onClick={this.toggleArchiveKlass}
                               className='secondary-content'>
                               <i className='material-icons'>unarchive</i>
                            </a>
                          </div>
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
          </div>
        }

        {
          enrolledKlasses.length === 0 && !loading &&
          <h6 className='center-align'><i>Currently not enrolled into any classes</i></h6>
        }

        <div id='enroll-modal' className='modal' style={{ maxWidth: 600 }}>
          <div className='modal-content'>
            <h4 className='center-align'>Enroll to Classes</h4>
            <form >
                <div className='row'>
                  {
                    allKlasses.length == 0 &&
                    <h5 className='center-align grey-text'>No classes added yet.</h5>
                  }
                  {
                    allKlasses.map(klass => {
                      const yearChange = klass.year !== this.previousYear;
                      this.previousYear = klass.year;
                      const enrollId = klass.enrolls.reduce((enrolled, value) => enrolled || (value.user_id == this.props.userId && value.id), false)
                      return(
                        <div className='row' key={klass.id}>
                          {yearChange && <h6 className='center-align'>{klass.year}</h6>}
                          <div>
                            <input type='checkbox' id={`check-${klass.id}`} data-enroll-id={enrollId} onChange={this.toggleEnrolledKlass} className='filled-in' value={klass.id} defaultChecked={enrollId && 'checked'}/>
                            <label htmlFor={`check-${klass.id}`}>{klass.name}</label>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
            </form>
            <br/>
            {
              allKlasses.length == 0 &&
              <a className='btn' style={{ width: '100%' }} href='/class/new'>Add Class</a>
            }
          </div>
        </div>
      </div>
    )
  }
})
