const Feedbacks = React.createClass({
  getInitialState(){
    return { feedbacks: [] };
  },
  componentDidMount(){
    this.loadFeedbacks();
  },
  loadFeedbacks(){
    $.ajax({
      url: `/users/${this.props.userId}/feedbacks`,
      success: feedbacks => {
        if(location.hash === '#feedback') $('ul.tabs').tabs('select_tab', 'feedback-action-plan');
        this.setState({ feedbacks });
      }
    })
  },
  render(){
    const { feedbacks } = this.state;
    const { editable } = this.props;

    return(
      <div id='feedbacks'>
        {
          editable &&
            <a href={`/users/${this.props.userId}/feedbacks/new`}>
              <div className='row'>
                <div className='card grey darken-3 no-margin hoverable'>
                  <div className='card-content white-text center-align'>
                    <h6>
                      <i className='fa fa-plus-circle' />
                      ADD FEEDBACK
                    </h6>
                  </div>
                </div>
              </div>
            </a>
        }
        {
          feedbacks.length === 0 &&
            <div className='card'>
              <div className='card-content'>
                <h5 className='center-align'>You currently have no feedback.</h5>
              </div>
            </div>
        }
        {
          feedbacks.map(feedback => {
            return(
              <div className='card' key={`feedback-${feedback.id}`}>
                <div className='card-content'>
                  <h6 className='grey-text text-darken-2 no-margin'>{`${feedback.name} - ${feedback.subject}`}</h6>
                  <p className='grey-text text-darken-1'><small>{moment(feedback.created_at).format('MMMM D, YYYY')}</small></p>
                  <br />
                  <div className='grey-text text-darken-1' dangerouslySetInnerHTML={{ __html: feedback.text }}></div>
                </div>
                <div className='card-action'>
                  <a className='blue-text text-darken-1' href={`/users/${this.props.userId}/feedbacks/${feedback.id}/edit`}>Edit</a>
                </div>
              </div>
            )
          })
        }
      </div>
    );
  }
});
