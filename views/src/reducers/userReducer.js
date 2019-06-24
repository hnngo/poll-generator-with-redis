import {
  ACT_FETCH_USER,
  ACT_SIGN_IN_USER,
  ACT_SIGN_UP_USER,
  ACT_SIGN_OUT_USER
} from '../constants'

const INITIAL_STATE = {
  auth: undefined
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACT_FETCH_USER:
    case ACT_SIGN_IN_USER:
    case ACT_SIGN_UP_USER:
      if (
        Object.keys(action.payload).includes("errMsg") ||
        Object.keys(action.payload).length === 0
      ) {
        return { ...state, auth: null };
      }

      return { ...state, auth: action.payload };
    case ACT_SIGN_OUT_USER:
      return { ...state, auth: null };
    default:
      return state;
  }
};
