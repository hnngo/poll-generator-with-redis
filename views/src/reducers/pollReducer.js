import {
  ACT_POLL_IS_CREATING,
  ACT_POLL_CREATE_SUCCESSFULLY,
  ACT_FETCH_POLL_ALL,
  ACT_FETCH_YOUR_POLLS,
  ACT_POLL_UPDATE_SCORE
} from '../constants';

const INITIAL_STATE = {
  allPolls: [],
  userPolls: [],
  isCreating: false
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACT_FETCH_POLL_ALL:
      return { ...state, allPolls: action.payload };
    case ACT_FETCH_YOUR_POLLS:
      return { ...state, userPolls: action.payload };
    case ACT_POLL_IS_CREATING:
      return { ...state, isCreating: true };
    case ACT_POLL_CREATE_SUCCESSFULLY:
      return { ...state, isCreating: false };
    case ACT_POLL_UPDATE_SCORE:
      const { pollid, scores } = action.payload;

      const newAllPolls = updateScore(state.allPolls, pollid, scores);
      const newUserPolls = updateScore(state.userPolls, pollid, scores);

      return { ...state, allPolls: newAllPolls, userPolls: newUserPolls };
    default:
      return state;
  }
};

const updateScore = (pollArr, pollid, newScores) => {
  const newPollArr = [...pollArr];
  const arrIndex = newPollArr.map((p) => p.poll_id);
  const updatedPollIndex = arrIndex.indexOf(pollid);

  if (updatedPollIndex < 0) {
    return newPollArr;
  }

  newPollArr[updatedPollIndex].scores = Object.values(newScores);
  return newPollArr;
}
