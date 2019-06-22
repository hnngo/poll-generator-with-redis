import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import '../styles/style.css';
import '../styles/bootstrap.min.css';
import NavButtons from './NavButtons';
import ExamplePolling from './poll/CurrentPolls';
import NewPolling from './poll/NewPoll';
import {
  TAB_CURRENT_POLL,
  TAB_NEW_POLL
} from '../constants';
import HeaderLightBar from './HeaderLightBar';

const App = (props) => {
  const [viewTab, setViewTab] = useState(TAB_CURRENT_POLL);

  // Connect socketio
  useEffect(() => {
    const socket = socketIOClient('http://localhost:5000');

    return () => socket.close();
  });

  const renderContent = () => {
    if (viewTab === TAB_CURRENT_POLL) {
      return <ExamplePolling />;
    } else if (viewTab === TAB_NEW_POLL) {
      return <NewPolling />;
    }
  };

  return (
    <div className="app-container">
      <HeaderLightBar />
      <div className="app-header">
        <p>Poll Generator</p>
      </div>
      <div className="app-nav-btn">
        <NavButtons onSelect={(tab) => setViewTab(tab)} />
      </div>
      <div className="app-cross-line" />
      <div className="app-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
