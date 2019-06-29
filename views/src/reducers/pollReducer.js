import {
  ACT_FETCH_POLL_ALL,
  ACT_FETCH_YOUR_POLLS,
  ACT_POLL_CREATE
} from '../constants';

const INITIAL_STATE = {
  allPolls: [],
  userPolls: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACT_FETCH_POLL_ALL:
      return { ...state, allPolls: action.payload };
    case ACT_FETCH_YOUR_POLLS:
      return { ...state, userPolls: action.payload };
    case ACT_POLL_CREATE:
      return { ...state }
    default:
      return state;
  }
};
