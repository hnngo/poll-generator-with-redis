import axios from 'axios';
import {
  ACT_FETCH_USER,
  ACT_SIGNING_UP_USER,
  ACT_SIGN_UP_USER,
  ACT_SIGNING_IN_USER,
  ACT_SIGN_IN_USER,
  ACT_SIGN_OUT_USER
} from '../constants';

export const actFetchUser = () => {
  return async (dispatch) => {
    const res = await axios.get('/user/current');

    dispatch({
      type: ACT_FETCH_USER,
      payload: res.data
    });
  }
}

export const actSignOut = () => {
  axios.get('/user/logout');

  return { type: ACT_SIGN_OUT_USER };
}

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
