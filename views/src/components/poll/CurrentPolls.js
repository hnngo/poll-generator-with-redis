import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  actFetchAllPoll
} from '../../actions';
import PollCard from './PollCard';

const ExamplePolling = (props) => {
  const { actFetchAllPoll, poll } = props;

  // Fetch all polls
  useEffect(() => {
    actFetchAllPoll();
  }, [actFetchAllPoll])

  const renderPollCards = () => {
    if (!poll.allPolls.length) {
      return <div />;
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
    <div className="poll-containerr">
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
  actFetchAllPoll
})(ExamplePolling);
