import React from 'react';
import API from '../API';
import Comment from './Comment';
import NewComment from './NewComment';
import LoadingSpinner from './LoadingSpinner';
import classNames from 'classnames';
import {genErr, pleaseLogin} from '../util/alerts';
import {canHazToken} from '../util/authorization';
import {formatTime} from '../util/time';

class Topic extends React.Component {
  constructor(props) {
    super(props);
    this.state = { allComments: [], replying: false, loading: true };
  }
  headerClicked() {
    if (!this.props.isActive) {
      (this.fetchComments.bind(this))();
    }
    this.props.onClick();
  }
  fetchComments(callback) {
    API.getComments(this.props._id)
    .done( resp => {
      this.setState( {allComments: resp, loading: false} );
      if (callback) callback();
    })
    .fail( err => {
      console.log(err);
    });
  }
  reply(e) {
    e.preventDefault();
    let haveToken = canHazToken();
    if(!haveToken) return pleaseLogin();
    this.setState({ replying: haveToken });
  }
  postComment(body) {
    this.setState({ replying: false, loading: true });
    API.postComment(this.props._id, body, 'seed')
    .done(resp => (this.fetchComments.bind(this))())
    .fail(err => genErr(err.responseText));
  }
  discard() {
    this.setState({ replying: false });
  }
  render() {
    let commentEls = [];
    let closeTopic = [];
    if (this.props.isActive) {
      closeTopic = <span className="glyphicon glyphicon-remove closeTopic" />;
      commentEls = this.state.allComments.map( (comment, i) => {
        return <Comment {...comment} update={this.fetchComments.bind(this)} key={i} />
      });
    }
    let addedClasses = classNames('topic', {active: this.props.isActive});
    let newComment = this.state.replying ? <NewComment post={this.postComment.bind(this)}
                                                       discard={this.discard.bind(this)} />
                                         : [];
    return (
      <div className={addedClasses}>
        <div>
          <div onClick={this.headerClicked.bind(this)} className="topicHead">
            <div className="container">
              <h4 className="topicTitle">
                <strong>{this.props.title}</strong> &mdash; {this.props.user.username}
                {closeTopic}
              </h4>
            </div>
          </div>
          <div className="container topicContent">
            <div className="panel-body topicBody">
              {this.props.body}
            </div>
            <div className="topicFooter">
              <span className="timeStamp">{formatTime(this.props.timestamp)}</span>
              <button className="btn btn-success replyTopicButton" href="#" onClick={this.reply.bind(this)}>reply</button>
            </div>
            {newComment}
            {this.state.loading ? <LoadingSpinner /> : []}
            {commentEls}
          </div>
        </div>
      </div>
    )
  }
}

export default Topic;
