import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import socketIOClient from 'socket.io-client';
import '../styles/style.css';
import '../styles/bootstrap.min.css';
import '../styles/animate.css';
import NavButtons from './NavButtons';
import CurrentPolls from './poll/CurrentPolls';
import NewPoll from './poll/NewPoll';
import SignInForm from './form/SignInForm';
import SignUpForm from './form/SignUpForm';
import HeaderLightBar from './HeaderLightBar';
import YourPolls from './poll/YourPolls';
import { actSaveSocket, actPollUpdateScore } from '../actions';
import {
  TAB_CURRENT_POLL,
  TAB_NEW_POLL,
  TAB_YOUR_POLLS,
  TAB_SIGN_IN,
  TAB_SIGN_UP,
  TAB_EXACT_POLL
} from '../constants';
import ExactPoll from './poll/ExactPoll';


const App = (props) => {
  const { actSaveSocket, actPollUpdateScore, location } = props;

  // Get the poll query string if exist
  let queryPoll = null;
  if (location.search) {
    const queryArr = location.search.split("?")[1].split("&");
    queryArr.forEach(q => {
      if (q.startsWith("pollid")) {
        queryPoll = q.split("pollid=")[1];
      }
    });
  }

  let initialTab = queryPoll ? TAB_EXACT_POLL : TAB_CURRENT_POLL;
  const [viewTab, setViewTab] = useState(initialTab);

  // Connect socketio
  useEffect(() => {
    // Connect socket io
    const socket = socketIOClient('http://localhost:5000');

    // Receive updated scores
    socket.on("update-poll", (info) => {
      actPollUpdateScore(info);
    })

    // Save the connection info
    actSaveSocket(socket);

    return () => socket.disconnect(true);
  }, [actSaveSocket, actPollUpdateScore]);

  const renderContent = () => {
    if (!props.socket) {
      return <div />;
    }

    switch (viewTab) {
      case TAB_CURRENT_POLL:
        return <CurrentPolls />;
      case TAB_EXACT_POLL:
        return <ExactPoll pollId={queryPoll} />;
      case TAB_NEW_POLL:
        return <NewPoll onSelectTab={(tab) => setViewTab(tab)} />;
      case TAB_YOUR_POLLS:
        return <YourPolls />
      case TAB_SIGN_IN:
        return <SignInForm onSelectTab={(form) => setViewTab(form)} />;
      case TAB_SIGN_UP:
        return <SignUpForm onSelectTab={(form) => setViewTab(form)} />;
      default:
        return <div />;
    }
  };

  return (
    <div className="app-container">
      <HeaderLightBar
        onSelect={(tab) => setViewTab(tab)}
      />
      <div className="app-header">
        <p>Poll Generator</p>
      </div>
      <div className="app-nav-btn">
        <NavButtons
          onSelect={(tab) => setViewTab(tab)}
          selectedTab={viewTab}
        />
      </div>
      <div className="app-content">
        {renderContent()}
      </div>
    </div>
  );
}

const mapStateToProps = ({ user }) => {
  const socket = user.socket;
  return { socket };
}

export default connect(mapStateToProps, {
  actSaveSocket,
  actPollUpdateScore
})(App);
