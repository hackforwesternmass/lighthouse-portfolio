var Klasses = React.createClass({
  getInitialState: function(){
    return { klasses: [] };
  },
  componentDidMount: function(){
    $.getJSON("/class", function(data){
      this.setState({ klasses: data });
    }.bind(this));
  },
  search: function(params){
    $.getJSON("/class/search", params).done(function(data){
      this.setState({klasses: data });
    }.bind(this));
  },
  render: function(){
    return  <section id="klass" className="section-container">
      <Klasses.Search search={this.search}/>
      <Klasses.Index klasses={this.state.klasses}/>
    </section>;
  }
});

Klasses.Search = React.createClass({
  getInitialState: function(){
    return { q: "", year: "", season: "" };
  },
  componentDidMount: function(){
    $('select').material_select();

    $(ReactDOM.findDOMNode(this)).find('select.filter-year').change(function(e){
      this.props.search({ q: this.state.q, year: e.target.value, season: this.state.season });
      this.setState({ year: e.target.value });
    }.bind(this));

    $(ReactDOM.findDOMNode(this)).find('select.filter-season').change(function(e){
      this.props.search({ q: this.state.q, year: this.state.year, season: e.target.value });
      this.setState({ season: e.target.value });
    }.bind(this));

  },
  searchText: function(e){
    this.props.search({ q: e.target.value, year: this.state.year, season: this.state.season });
    this.setState({ q: e.target.value });
  },
  render: function(){
    return  <div className="row grey-text text-darken-2">
      <div className="input-field col s12 m5">
        <i className="fa fa-search prefix"></i>
        <input id="class-search" className="search" type="text" onChange={this.searchText}/>
        <label htmlFor="class-search" className="">Search</label>
      </div>

      <div className="input-field col s12 m2">
        <select className="filter-year" defaultValue="YEAR">
          <option value="YEAR" disabled>YEAR</option>
          <option value="All">All</option>
          <option value="2015">2015</option>
          <option value="2016">2016</option>
          <option value="2017">2017</option>
        </select>
      </div>

      <div className="input-field col s12 m2">
        <select className="filter-season" defaultValue="SEASON">
          <option value="SEASON" disabled>SEASON</option>
          <option value="All">All</option>
          <option value="Fall">FALL</option>
          <option value="Winter">WINTER</option>
        </select>
      </div>

      <div className="input-field col s12 m2">
        <a className="btn" href="/class/new">
          <i className="fa fa-plus no-padding"></i> Create
          </a>
        </div>
      </div>;
    }
  });

  Klasses.Index = React.createClass({
    componentDidUpdate: function(){
      $('.tooltipped').tooltip();
    },
    studentNames: function(){
      var studentNames = "";

    },
    klass: function(){
      var klassNodes = this.props.klasses.map(function(klass){
        var studentNames = [];
        klass.users.forEach(function(student){
          studentNames.push( student.first_name + " " + student.last_name );
        });

        return  <tr key={klass.id}>
          <td className="name-desc">
            <div className="name">
              <a href={"/class/"+ klass.id +"/edit"}> {klass.name}</a>
              {!!klass.google_drive_url ? <small><a href={klass.google_drive_url} target="_blank"><i className="fa fa-folder-open"></i></a></small> : null}
              <small><a data-confirm="Are you positive that you want to delete this class?" rel="nofollow" data-method="delete" href={"/class/" + klass.id}><i className="fa fa-trash"></i></a></small>
            </div>
            {klass.description}
          </td>
          <td className="hide-on-small-only">
            {klass.instructor ? <div>{klass.instructor}</div> : null}
            {klass.instructor_email ? <div><a href={"mailto:" + klass.instructor_email}>{klass.instructor_email}</a></div> : null}
            {klass.instructor_phone ? <div>{klass.instructor_phone}</div> : null}
          </td>
          <td className="hide-on-small-only">
            <div>
              <b>
                {klass.season ? <span>{klass.season} </span> : null}
                {klass.year ? <span> {klass.year}</span> : null}
              </b>
            </div>
            {klass.location ? <div>{klass.location}</div> : null}
            {klass.weekday ? <div>{klass.weekday}</div> : null}
            {klass.time ? <div>{klass.time}</div> : null}
          </td>
          <td className="hide-on-small-only">
            <div className="tooltipped" data-position="left" data-delay="50" data-tooltip={studentNames.join(', ')}>{klass.enrolled}</div>
          </td>
        </tr>;
      }.bind(this));

      return klassNodes;
    },
    render: function(){
      return  <table className="bordered z-depth-1">
        <thead className="grey darken-4 white-text">
          <tr>
            <th className="name-desc">CLASS AND DESCRIPTION</th>
            <th className="hide-on-small-only">INSTRUCTOR</th>
            <th className="hide-on-small-only">WHERE AND WHEN</th>
            <th className="hide-on-small-only"># OF STUDENTS</th>
          </tr>
        </thead>

        <tbody>
          {this.klass()}
        </tbody>
      </table>
    }
  });
