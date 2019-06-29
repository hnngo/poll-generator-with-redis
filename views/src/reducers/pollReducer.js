import {
  ACT_POLL_IS_CREATING,
  ACT_POLL_CREATE_SUCCESSFULLY,
  ACT_FETCH_POLL_ALL,
  ACT_FETCH_YOUR_POLLS
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
    default:
      return state;
  }
};
