import React from 'react';
import PollSettingForm from '../form/PollSettingForm';

const NewPolling = (props) => {
  return (
    <div className="new-poll-container">
      <div className="container">
        <PollSettingForm />
      </div>
    </div>
  );
};

export default NewPolling;
