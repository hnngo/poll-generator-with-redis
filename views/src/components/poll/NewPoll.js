import React from 'react';
import PollSettingForm from '../form/PollSettingForm';

const NewPolling = (props) => {
  return (
    <div className="new-poll-container">
      <div className="container">
        <p className="np-header">Filling the poll setting and click Create Poll</p>
        <PollSettingForm />
      </div>
    </div>
  );
};

export default NewPolling;
