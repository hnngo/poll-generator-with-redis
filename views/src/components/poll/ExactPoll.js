import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  actFetchPollById
} from '../../actions';
import PollCard from './PollCard';

const ExactPoll = (props) => {
  const { actFetchPollById, poll, pollId } = props;

  // Fetch all polls
  useEffect(() => {
    actFetchPollById(pollId);
  }, [actFetchPollById])

  const renderPollCards = () => {
    if (!poll.allPolls.length) {
      return (
        <div className="poll-none">
          No polls were created
        </div>
      );
    }

    return poll.allPolls.map((poll, i) => {
      return (
        <PollCard
          key={i}
          poll={poll}
          triggerRender={poll.scores}
        />
      )
    })
  }

  return (
    <div className="poll-container">
      <div className="container">
        {renderPollCards()}
      </div>
    </div>
  );
};

const mapStateToProps = ({ poll }) => {
  return { poll };
}

export default connect(mapStateToProps, {
  actFetchPollById
})(ExactPoll);
