import axios from 'axios';
import {
  ACT_FETCH_USER,
  ACT_SIGNING_UP,
  ACT_SIGN_UP_SUCCESSFULLY,
  ACT_SIGN_UP_UNSUCCESSFULLY,
  ACT_SIGNING_IN,
  ACT_SIGN_IN_SUCCESSFULLY,
  ACT_SIGN_IN_UNSUCCESSFULLY,
  ACT_SIGN_OUT_USER,
  ACT_CLEAR_AUTH_ERR_MSG
} from '../constants';

const isDataErr = (data) => {
  return (
    Object.keys(data).includes("errMsg") ||
    Object.keys(data).length === 0
  );
}

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
    dispatch({ type: ACT_SIGNING_UP });

    try {
      const res = await axios.post('/user/signup', val);

      let type = isDataErr(res.data) ? ACT_SIGN_UP_UNSUCCESSFULLY : ACT_SIGN_UP_SUCCESSFULLY;
      dispatch({
        type,
        payload: res.data
      });
    } catch (err) {
      console.log(err);
    }
  }
};

export const actSignInpWithEmailAndPassword = (val) => {
  return async (dispatch) => {
    dispatch({ type: ACT_SIGNING_IN });

    try {
      const res = await axios.post('/user/signin', val);

      let type = isDataErr(res.data) ? ACT_SIGN_IN_UNSUCCESSFULLY : ACT_SIGN_IN_SUCCESSFULLY;
      dispatch({
        type,
        payload: res.data
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const actClearAuthErrorMsg = () => {
  return { type: ACT_CLEAR_AUTH_ERR_MSG };
};
