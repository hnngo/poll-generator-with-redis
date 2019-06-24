import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import '../styles/style.css';
import '../styles/bootstrap.min.css';
import '../styles/animate.css';
import NavButtons from './NavButtons';
import CurrentPolls from './poll/CurrentPolls';
import NewPoll from './poll/NewPoll';
import SignInForm from './form/SignInForm';
import SignUpForm from './form/SignUpForm';
import {
  TAB_CURRENT_POLL,
  TAB_NEW_POLL,
  TAB_SIGN_IN,
  TAB_SIGN_UP
} from '../constants';
import HeaderLightBar from './HeaderLightBar';

const App = (props) => {
  const [viewTab, setViewTab] = useState(TAB_CURRENT_POLL);

  // Connect socketio
  useEffect(() => {
    const socket = socketIOClient('http://localhost:5000');

    return () => socket.close();
  }, []);

  const renderContent = () => {
    switch (viewTab) {
      case TAB_CURRENT_POLL:
        return <CurrentPolls />;
      case TAB_NEW_POLL:
        return <NewPoll />;
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
      <div className="app-cross-line" />
      <div className="app-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
