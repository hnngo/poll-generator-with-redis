import {
  ACT_SIGN_IN_USER,
  ACT_SIGN_UP_USER
} from '../constants'

const INITIAL_STATE = {
  auth: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACT_SIGN_IN_USER:
    case ACT_SIGN_UP_USER:
      if (Object.keys(action.payload).includes("errMsg")) {
        return { ...state, auth: null };
      }
      
      return { ...state, auth: action.payload };
    default:
      return state;
  }
};
