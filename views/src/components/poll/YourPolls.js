import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  actFetchAllPoll
} from '../../actions';
import PollCard from './PollCard';

const YourPolls = (props) => {
  const { actFetchAllPoll, user, poll } = props;

  useEffect(() => {
    actFetchAllPoll(user.auth.user_id);
  }, [actFetchAllPoll]);

  const renderPollCards = () => {
    if (!poll.userPolls.length) {
      return <div />;
    }

    return poll.userPolls.map((poll, i) => {
      return (
        <PollCard
          key={i}
          poll={poll}
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
