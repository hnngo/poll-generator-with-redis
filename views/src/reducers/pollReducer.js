import {
  ACT_FETCH_POLL_ALL
} from '../constants';

const INITIAL_STATE = {
  allPolls: [],
  userPolls: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACT_FETCH_POLL_ALL:
      return { ...state, allPolls: action.payload };
    default:
      return state;
  }
};
