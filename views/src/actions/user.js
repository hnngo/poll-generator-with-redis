import axios from 'axios';
import {
  ACT_SIGNING_UP_USER,
  ACT_SIGN_UP_USER,
  ACT_SIGNING_IN_USER,
  ACT_SIGN_IN_USER
} from '../constants';

export const actSignUpWithEmailAndPassword = (val) => {
  return async (dispatch) => {
    dispatch({ type: ACT_SIGNING_UP_USER });

    try {
      const res = await axios.post('/user/signup', val);

      dispatch({
        type: ACT_SIGN_UP_USER,
        payload: res.data
      })
    } catch (err) {
      console.log(err);
    }
  }
};

export const actSignInpWithEmailAndPassword = (val) => {
  return async (dispatch) => {
    dispatch({ type: ACT_SIGNING_IN_USER });

    try {
      const res = await axios.post('/user/signin', val);

      dispatch({
        type: ACT_SIGN_IN_USER,
        payload: res.data
      })
    } catch (err) {
      console.log(err);
    }
  }
};
