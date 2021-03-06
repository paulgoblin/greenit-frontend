import React from 'react';
import API from '../API';
import LoadingSpinner from './LoadingSpinner.jsx';
import Topic from './Topic.jsx';
import NewTopicModal from './NewTopicModal.jsx';
import classNames from 'classnames';
import {genErr} from '../util/alerts';
import {eventEmitter, store} from '../util/store';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allTopics: [],
      greens: store.getDatum('me') ? store.getDatum('me').greenTopics : new Set(),
      activeTopic: false,
      loading: true
    };
  }
  componentWillMount() {
    (this.getTopics.bind(this))();
    store.registerListener('me', () => {
      let greens = store.getDatum('me') ? store.getDatum('me').greenTopics : new Set();
      this.setState({ greens: greens });
    })
    eventEmitter.registerListener('goHome', () => {
      this.setState({activeTopic: false });
      this.getTopics();
    })
  }
  handleTopicClick(topicId){
    this.setState({activeTopic:this.state.activeTopic === topicId ? false : topicId});
  }
  getTopics(callback){
    API.getTopics()
    .done( resp => {
      this.setState( {allTopics: resp, loading: false} );
    })
    .fail( err => genErr(err.responseText))
    .always( () => {
      if (callback) callback();
    });
  }
  render() {
    let topicEls = this.state.allTopics.map((topic,i) => {
      let isActive = this.state.activeTopic === topic._id;
      return <Topic {...topic} isActive={isActive}
                               isGreen={this.state.greens.has(topic._id)}
                               onClick={this.handleTopicClick.bind(this,topic._id)}
                               key={i}/>
    });
    let mainClasses = classNames('main', 'panel', {displayTopic : this.state.activeTopic})
    return (
      <div className={mainClasses}>
        <NewTopicModal topicPosted={this.getTopics.bind(this)} />
        {this.state.loading ? <LoadingSpinner /> : []}
        {topicEls}
      </div>
    )
  }
}

export default Main;
