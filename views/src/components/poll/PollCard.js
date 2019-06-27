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
        {/* {poll.poll_id} */}
        {poll.question}
      </div>
      <div className="poll-options">
        <ul>
          {renderOptions()}
        </ul>
      </div>
      <div className="poll-info">
        <div className="poll-user-created">
          <div className="user-name">
            Created by {poll.name} - 
          </div>
          <div className="created-time">
            Created 3 days ago
          </div>
        </div>
        <div className="poll-updated-time">
          Last updated 10 minutes ago
        </div>
      </div>
    </div>
  );
}

export default PollCard;
