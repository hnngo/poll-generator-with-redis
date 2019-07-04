import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  actFetchAllPoll
} from '../../actions';
import PollCard from './PollCard';

const YourPolls = (props) => {
  const { actFetchAllPoll, user, poll } = props;

  // PENDING: Immediately refresh will show you have not yet voted
  
  useEffect(() => {
    actFetchAllPoll(user.auth.user_id);
  }, [actFetchAllPoll, user.auth.user_id]);

  const renderPollCards = () => {
    if (!poll.userPolls.length) {
      return <div />;
    }

    return poll.userPolls.map((poll, i) => {
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

const mapStateToProps = ({ poll, user }) => {
  return { poll, user };
}

export default connect(mapStateToProps, {
  actFetchAllPoll
})(YourPolls);
