import axios from 'axios';
import {
  ACT_SIGNING_UP_USER,
  ACT_SIGN_UP_USER
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
