import React from 'react';

const PollCard = (props) => {
  const { poll } = props;

  const renderOptions = () => {
    return poll.options.map((option, i) => {
      return (
        <li
          key={i}
        >
          {option}
        </li>
      );
    });
  };

  return (
    <div className="poll-card-container">
      <div className="poll-question">
        {poll.poll_id}
        {poll.question}
      </div>
      <div className="poll-options">
        {renderOptions()}
      </div>
      <div className="poll-user-create">
        Created by {poll.user_id}
      </div>
      <div className="poll-time">
        <div className="created-time">
          Created 3 days ago
        </div>
        <div className="updated-time">
          Last updated 10 minutes ago
        </div>
      </div>
    </div>
  );
}

export default PollCard;
