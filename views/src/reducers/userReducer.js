import {
  ACT_SAVE_SOCKET,
  ACT_FETCH_USER,
  ACT_SIGN_IN_SUCCESSFULLY,
  ACT_SIGN_IN_UNSUCCESSFULLY,
  ACT_SIGNING_IN,
  ACT_SIGN_UP_SUCCESSFULLY,
  ACT_SIGN_UP_UNSUCCESSFULLY,
  ACT_SIGNING_UP,
  ACT_SIGN_OUT_USER,
  ACT_CLEAR_AUTH_ERR_MSG
} from '../constants'

const INITIAL_STATE = {
  auth: undefined,
  isProcessingAuth: false,
  errMsg: "",
  votedPoll: {},
  socket: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACT_SAVE_SOCKET:
      return { ...state, socket: action.payload };
    case "@@redux-form/CHANGE":
      return { ...state, errMsg: "" };
    case ACT_SIGNING_IN:
    case ACT_SIGNING_UP:
      return { ...state, isProcessingAuth: true, errMsg: "" };
    case ACT_FETCH_USER:
      if (!action.payload) {
        return { ...state, auth: null };
      }

      return { ...state, auth: action.payload };
    case ACT_SIGN_IN_UNSUCCESSFULLY:
    case ACT_SIGN_UP_UNSUCCESSFULLY:
      return { ...state, ...action.payload, isProcessingAuth: false };
    case ACT_SIGN_IN_SUCCESSFULLY:
    case ACT_SIGN_UP_SUCCESSFULLY:
      return { ...state, auth: action.payload, isProcessingAuth: false };
    case ACT_SIGN_OUT_USER:
      return { ...state, auth: null };
    case ACT_CLEAR_AUTH_ERR_MSG:
      return { ...state, errMsg: "" };
    default:
      return state;
  }
};
