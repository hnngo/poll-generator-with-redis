import React from 'react';
import { connect } from 'react-redux';
import { formatTime } from '../utils';

const PollCard = (props) => {
  const { poll, user } = props;

  let isVotedByUser = false;
  if (user.auth && Object.keys(user.auth.votedPolls).includes(poll.poll_id)) {
    isVotedByUser = true;
  }

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
    <div className={"poll-card-container " + (isVotedByUser ? "voted-bound" : "unvoted-bound")}>
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
            Created by {poll.name} -&nbsp;
          </div>
          <div className="created-time">
            {formatTime(new Date() - new Date(poll.date_created))}
          </div>
        </div>
        <div className="poll-updated-time">
          Last updated {formatTime(new Date() - new Date(poll.last_updated))}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = ({ user }) => {
  return { user };
}

export default connect(mapStateToProps)(PollCard);
