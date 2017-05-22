const Klasses = React.createClass({
  getInitialState() {
    return { klasses: [] };
  },
  componentDidMount() {
    $.ajax({
      url: '/class',
      success: klasses => {
        this.setState({ klasses });
      }
    });
  },
  search(data) {
    $.ajax({
      url: '/class/search',
      data,
      success: klasses => {
        this.setState({ klasses });
      }
    });
  },
  render() {
    return(
      <div id='klass' className='section-container'>
        <Klasses.Search search={this.search}/>
        <Klasses.Index klasses={this.state.klasses}/>
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

    $(ReactDOM.findDOMNode(this)).find('select.filter-year').change(e => {
      this.props.search({ q: this.state.q, year: e.target.value, season: this.state.season, type: this.state.type });
      this.setState({ year: e.target.value });
    });

    $(ReactDOM.findDOMNode(this)).find('select.filter-season').change(e => {
      this.props.search({ q: this.state.q, year: this.state.year, season: e.target.value, type: this.state.type });
      this.setState({ season: e.target.value });
    });

    $(ReactDOM.findDOMNode(this)).find('select.filter-type').change(e => {
      this.props.search({ q: this.state.q, year: this.state.year, season: this.state.season, type: e.target.value });
      this.setState({ type: e.target.value });
    });

  },
  searchText(e) {
    this.props.search({ q: e.target.value, year: this.state.year, season: this.state.season });
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
        </select>
      </div>

      <div className="input-field col s12 m2 l2">
        <a className="btn" href="/class/new" style={{fontSize: 10}}>
          <i className="fa fa-plus no-padding" style={{fontSize: 10}}></i> Create
        </a>
      </div>
    </div>;
    }
  });

  Klasses.Index = React.createClass({
    componentDidUpdate() {
      $('.tooltipped').tooltip();
    },
    render() {
      return  <table className="bordered z-depth-1">
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
            this.props.klasses.map(klass => {
              const studentNames = klass.users.map(user => user.full_name)
              return(
                <tr key={klass.id}>
                  <td className="name-desc">
                    <div className="name">
                      <a href={`/class/${klass.id}/edit`}> {klass.name}</a>
                      {!!klass.google_drive_url ? <small><a href={klass.google_drive_url} target="_blank"><i className="fa fa-folder-open"></i></a></small> : null}
                      <small><a data-confirm="Are you positive that you want to delete this class?" rel="nofollow" data-method="delete" href={"/class/" + klass.id}><i className="fa fa-trash"></i></a></small>
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
                    {klass.weekday && <div className='secondary'>{klass.weekday}</div>}
                    {klass.time && <div className='secondary'>{klass.time}</div>}
                  </td>
                  <td className="hide-on-small-only">
                    <a href={`/class/${klass.id}.csv`} download={klass.name} className={studentNames.length > 0 ? "tooltipped center-align" : 'center-align'} data-position="left" data-delay="50" data-tooltip={studentNames.join(', ')}>{klass.enrolled_count}</a>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    }
  });
