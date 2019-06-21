import React, { useState } from 'react';
import '../styles/style.css';
import '../styles/bootstrap.min.css';
import NavButtons from './NavButtons';
import ExamplePolling from './polling/ExamplePolling';
import NewPolling from './polling/NewPolling';
import {
  TAB_EXAMPLE_POLLING,
  TAB_NEW_POLLING
} from '../constants';

const App = (props) => {
  const [viewTab, setViewTab] = useState(TAB_EXAMPLE_POLLING);

  const renderContent = () => {
    if (viewTab === TAB_EXAMPLE_POLLING) {
      return <ExamplePolling />;
    } else if (viewTab === TAB_NEW_POLLING) {
      return <NewPolling />;
    }
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <p>Polling Generator</p>
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
