const update = React.addons.update;

const Klasses = React.createClass({
  getInitialState() {
    return { klasses: [] };
  },
  componentDidMount() {
    this.loadKlasses();
  },
  loadKlasses(data = {}) {
    $.ajax({
      url: '/class',
      data,
      success: klasses => {
        this.setState({ klasses });
      }
    });
  },
  render() {
    return(
      <div id='klass' className='section-container'>
        <Klasses.Search loadKlasses={this.loadKlasses}/>
        <table className="bordered z-depth-1">
          <thead className="grey darken-4 white-text">
            <tr>
              <th className="name-desc">CLASS AND DESCRIPTION</th>
              <th className="hide-on-small-only">INSTRUCTOR</th>
              <th className="hide-on-small-only">WHERE AND WHEN</th>
              <th className="hide-on-small-only">STUDENTS</th>
            </tr>
          </thead>

          <tbody>
            {
              this.state.klasses.map((klass, i) => <Klasses.Show key={`klass-${klass.id}`} parent={this} index={i} klass={klass}/>)
            }
          </tbody>
        </table>
      </div>
    );
  }
});

Klasses.Search = React.createClass({
  getInitialState() {
    return { q: '', year: '', season: '', type: '' };
  },
  componentDidMount() {
    $('select').material_select();
    $('.tooltipped').tooltip({ position: 'left' });

    $(ReactDOM.findDOMNode(this)).find('select.filter-year').change(e => {
      this.props.loadKlasses({ q: this.state.q, year: e.target.value, season: this.state.season, type: this.state.type });
      this.setState({ year: e.target.value });
    });

    $(ReactDOM.findDOMNode(this)).find('select.filter-season').change(e => {
      this.props.loadKlasses({ q: this.state.q, year: this.state.year, season: e.target.value, type: this.state.type });
      this.setState({ season: e.target.value });
    });

    $(ReactDOM.findDOMNode(this)).find('select.filter-type').change(e => {
      this.props.loadKlasses({ q: this.state.q, year: this.state.year, season: this.state.season, type: e.target.value });
      this.setState({ type: e.target.value });
    });

  },
  searchText(e) {
    this.props.loadKlasses({ q: e.target.value, year: this.state.year, season: this.state.season });
    this.setState({ q: e.target.value });
  },
  render() {
    return  <div className='row grey-text text-darken-2'>
      <div className="input-field col s12 m5 l5">
        <i className="fa fa-search prefix"></i>
        <input id="class-search" className="search" type="text" onChange={this.searchText}/>
        <label htmlFor="class-search" className="">Search</label>
      </div>

      <div className="input-field col s12 m1 l1">
        <select className="filter-year" defaultValue="YEAR">
          <option value="YEAR" disabled>YEAR</option>
          <option value="All">All</option>
          <option value="2015">2015</option>
          <option value="2016">2016</option>
          <option value="2017">2017</option>
          <option value="2018">2018</option>
        </select>
      </div>

      <div className="input-field col s12 m2 l2">
        <select className="filter-season" defaultValue="SEASON">
          <option value="SEASON" disabled>SEASON</option>
          <option value="All">All</option>
          <option value="Fall">FALL</option>
          <option value="Winter">WINTER</option>
        </select>
      </div>

      <div className="input-field col s12 m2 l2">
        <select className="filter-type" defaultValue="TYPE">
          <option value="TYPE" disabled>TYPE</option>
          <option value="All">All</option>
          <option value="Regular">REGULAR</option>
          <option value="Tutorial">TUTORIAL</option>
          <option value="Archived">ARCHIVED</option>
        </select>
      </div>

      <div className="input-field col s12 m2 l2">
        <a href='/class/new' data-tooltip="Create Class" data-position='left' className="right tooltipped btn-floating waves-effect waves-light">
          <i className="material-icons">add</i>
        </a>
      </div>
    </div>;
    }
  });

  Klasses.Show = React.createClass({
    componentDidMount() {
      $('.tooltipped').tooltip();
      $('.dropdown-button').dropdown({
        constrainWidth: false,
      });
    },
    componentDidUpdate() {
      $('.dropdown-button').dropdown({
        constrainWidth: false,
      });
      $('.tooltipped').tooltip();
    },
    toggleArchiveClass(e) {
      e.preventDefault();
      const { klass, index, parent } = this.props;

      if (!klass.archive && !confirm('The class will be moved to past classes for students enrolled in the class.')) {
        return false;
      }

      $.ajax({
        url: `/class/${klass.id}`,
        type: 'PATCH',
        data: { klass: { archive: !klass.archive } },
        success: klass => {
          parent.setState({ klasses: update(parent.state.klasses, {$splice: [[index, 1, klass]]})});
        },
        error: () => {
          Materialize.toast('Something went wrong, try reloading the page.', 3500, 'red darken-3');
        }
      });
    },
    render() {
      const { klass } = this.props;
      const studentNames = klass.enrolls.filter(enrolly => !(enrolly.completed || enrolly.user.archive)).map(enrolly => enrolly.user.full_name);
      return(
        <tr className={klass.archive ? 'half-opacity' : ''}>
          <td className="name-desc">
            <div className="name">
              <a href={`/class/${klass.id}/edit`}> {klass.name}</a>
              {klass.google_drive_url && <small><a href={klass.google_drive_url} target="_blank"><i className="fa fa-folder-open"></i></a></small>}
            </div>
            <br/>
            {klass.description && <div className='secondary' dangerouslySetInnerHTML={{ __html: klass.description.replace(/\n\r?/g, '<br>') }} />}
          </td>
          <td className="hide-on-small-only">
            {klass.instructor && <div><strong>{klass.instructor}</strong></div>}
            {klass.instructor_email && <div><a className='secondary' href={`mailto:${klass.instructor_email}`}>{klass.instructor_email}</a></div>}
            {klass.instructor_phone && <div className='secondary' >{klass.instructor_phone}</div>}
          </td>
          <td className="hide-on-small-only">
            <div>
              <b>
                {klass.seasons.length > 0 && <span>{klass.seasons.join('/')} </span>}
                {klass.years.length > 0 && <span> {klass.years.join('/')}</span>}
              </b>
            </div>
            {klass.location && <div className='secondary'>{klass.location}</div>}
            {klass.weekdays.length > 0 && <div className='secondary'>{klass.weekdays.join('/')}</div>}
            {klass.time && <div className='secondary'>{klass.time}</div>}
          </td>
          <td className="hide-on-small-only">
            <a href={`/class/${klass.id}.csv`} download={klass.name} className={studentNames.length > 0 ? "tooltipped center-align" : 'center-align'} data-position="left" data-delay="50" data-tooltip={studentNames.join(', ')}>{studentNames.length}</a>
            <a href='#' data-activates={`dropdown-${klass.id}`} className='dropdown-button secondary-content'><i className='material-icons'>more_vert</i></a>
            <ul id={`dropdown-${klass.id}`} className='dropdown-content'>
              <li><a href={`/class/${klass.id}/edit`}>Edit</a></li>
              <li>
                <a data-confirm='Are you positive that you want to delete this class?' rel="nofollow" data-method="delete" href={`/class/${klass.id}`}>Delete</a>
              </li>
              <li className="divider"></li>
              <li><a href="#" onClick={this.toggleArchiveClass}>{klass.archive ? 'Unarchive' : 'Archive'}</a></li>
            </ul>
          </td>
        </tr>
      )
    }
  });
