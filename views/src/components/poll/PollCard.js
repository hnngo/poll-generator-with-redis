import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { formatTime } from '../utils';
import {
  actVotePoll,
  actPollDelete
} from '../../actions';

const PollCard = (props) => {
  const [choices, setChoices] = useState([]);
  const { poll, user } = props;

  const isPrivate = poll.private;
  const isAuth = user.auth;
  const isVoted = isAuth && Object.keys(user.auth.votedPolls).includes(poll.poll_id);
  const isYourPoll = isAuth && (user.auth.user_id === poll.user_id);

  let isAbleToVote = true;
  let barColor = "#007B4F";
  let boundOption = "unvoted-bound";
  if (isPrivate && !isAuth) {
    barColor = "#757575";
    isAbleToVote = false;
    boundOption = "close-bound"
  } else if (isVoted) {
    barColor = "#007bff";
    isAbleToVote = false;
    boundOption = "voted-bound";
  }

  const renderChoices = (i) => {
    if (!isAbleToVote) {
      return <div />;
    } else if (poll.multiple_choice) {
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
    // Prepare progress bar
    const scoresNum = poll.scores.map(s => +s);
    const maxVotes = _.max(scoresNum);
    const barProgress = poll.scores.map((s) => {
      return (maxVotes === 0) ? 0 : (+s) * 100 / maxVotes;
    });
    const optionsVoteByUser = isVoted ? user.auth.votedPolls[poll.poll_id] : [];

    return (
      <div className="poll-vote-form">
        <form>
          {
            poll.options.map((option, i) => {
              let border = optionsVoteByUser.includes(i) ? `2px solid ${barColor}` : "";

              return (
                <div
                  key={i}
                  className="poll-vote-row"
                  style={{ border }}
                >
                  <div className="poll-vote-header">
                    <div>
                      {renderChoices(i)}
                      {option}
                    </div>
                    <div className="poll-scores">
                      {poll.scores[i]}
                      {/* PENDING: Percentage */}
                    </div>
                  </div>
                  <div className="progress poll-progress">
                    <div
                      className="progress-bar progress-bar-striped  progress-bar-animated"
                      role="progressbar"
                      style={{
                        width: `${barProgress[i]}%`,
                        backgroundColor: barColor
                      }}
                      aria-valuenow="10"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                  <div className="poll-voted-user">
                    {optionsVoteByUser.includes(i) ? "Voted by you" : ""}
                  </div>
                </div>
              );
            })
          }
        </form>
        {
          isAbleToVote ?
            <button
              className="btn-main-orange"
              onClick={() => props.actVotePoll(poll.poll_id, choices)}
            >
              Submit Vote
            </button>
            :
            <div />
        }
      </div>
    );
  };

  const renderPollTags = () => {
    return (
      <div className="poll-tags">
        {
          isYourPoll ?
            <div className="tags">Your Poll</div> : <div />
        }
        <div className="tags">
          {
            isPrivate ? "Private Poll" : "Public Poll"
          }
        </div>
      </div>
    );
  }

  const renderDeleteBtn = () => {
    if (isAuth && isYourPoll) {
      return (
        <div
          className="btn-main-danger"
          onClick={() => props.actPollDelete(poll.poll_id)}
        >
          Delete Poll
        </div>
      )
    }

    return <div />;
  }

  return (
    <div className={"poll-card-container " + boundOption}>
      {renderPollTags()}
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
          Last voted {formatTime(new Date() - new Date(poll.last_updated))}
        </div>
      </div>
      <div className="poll-delete">
        {renderDeleteBtn()}
      </div>
    </div>
  );
}

const mapStateToProps = ({ user }) => {
  return { user };
}

export default connect(mapStateToProps, {
  actVotePoll,
  actPollDelete
})(PollCard);
