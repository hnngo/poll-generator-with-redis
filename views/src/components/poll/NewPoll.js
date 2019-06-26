import React from 'react';
import NewPollForm from '../form/NewPollForm';

const NewPolling = (props) => {
  return (
    <div className="new-poll-container">
      <div className="container">
        <NewPollForm />
      </div>
    </div>
  );
};

export default NewPolling;
