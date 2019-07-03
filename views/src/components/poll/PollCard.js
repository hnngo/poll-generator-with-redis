import React, { useState } from 'react';
import { connect } from 'react-redux';
import { formatTime } from '../utils';
import {
  actVotePoll
} from '../../actions';

const PollCard = (props) => {
  const [choices, setChoices] = useState([]);
  const { poll, user } = props;

  const isPrivate = poll.private;
  const isAuth = user.auth;
  const isVoted = isAuth && Object.keys(user.auth.votedPolls).includes(poll.poll_id);
  let isAbleToVote = true;
  let boundOption = "unvoted-bound";
  if (isPrivate && !isAuth) {
    isAbleToVote = false;
    boundOption = "close-bound"
  } else if (isVoted) {
    isAbleToVote = false;
    boundOption = "voted-bound";
  }

  const renderChoices = (i) => {
    if (poll.multiple_choice) {
      return (
        <input
          type="checkbox"
          value={i}
          name={poll.poll_id}
          onChange={(e) => {
            const { value, checked } = e.target;
            let newChoices = choices;

            if (checked) {
              newChoices.push(+value);
            } else {
              newChoices.splice(choices.indexOf(+value), 1);
            }

            setChoices(newChoices);
          }}
        />
      );
    }

    return (
      <input
        type="radio"
        value={i}
        name={poll.poll_id}
        onChange={(e) => setChoices([+e.target.value])}
      />
    );
  }

  const renderOptions = () => {
    if (isAbleToVote) {
      return (
        <div className="poll-vote-form">
          <form>
            {
              poll.options.map((option, i) => {
                return (
                  <div key={i} className="row">
                    <div className="col-1">
                      {poll.scores[i]}
                    </div>
                    <div className="col-11">
                      {renderChoices(i)}
                      {option}
                    </div>
                  </div>
                );
              })
            }
          </form>
          <button
            className="btn-main-orange"
            onClick={() => props.actVotePoll(poll.poll_id, choices)}
          >
            Submit Vote
          </button>
        </div>
      )
    }

    return (
      <ul>
        {
          poll.options.map((option, i) => {
            return (
              <li
                key={i}
              >
                <div className="row">
                  <div className="col-1">
                    {poll.scores[i]}
                  </div>
                  <div className="col-11">
                    {option}
                  </div>
                </div>
              </li>
            );
          })
        }
      </ul>
    )
  };

  return (
    <div className={"poll-card-container " + boundOption}>
      <div className="poll-question">
        {poll.question}
      </div>
      <div className="poll-options">
        {renderOptions()}
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

export default connect(mapStateToProps, {
  actVotePoll
})(PollCard);
