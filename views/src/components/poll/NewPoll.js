import React from 'react';
import NewPollForm from '../form/NewPollForm';
import { TAB_YOUR_POLLS } from '../../constants';

const NewPolling = (props) => {
  return (
    <div className="new-poll-container">
      <div className="container">
        <NewPollForm
          onCreated={() => props.onSelectTab(TAB_YOUR_POLLS)}
        />
      </div>
    </div>
  );
};

export default NewPolling;
