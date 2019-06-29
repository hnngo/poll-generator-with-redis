import axios from 'axios';
import _ from 'lodash';
import {
  ACT_POLL_IS_CREATING,
  ACT_POLL_CREATE_SUCCESSFULLY,
  ACT_FETCH_POLL_ALL,
  ACT_FETCH_YOUR_POLLS
} from '../constants';

export const actFetchAllPoll = () => {
  return async (dispatch) => {
    try {
      const res = await axios.get('/pollser/all');

      dispatch({
        type: ACT_FETCH_POLL_ALL,
        payload: res.data
      });
    } catch (err) {
      console.log(err);
    }
  }
};

export const actFetchYourPoll = (user_id) => {
  return async (dispatch) => {
    try {
      const res = await axios.get(`/pollser/all?user_id=${user_id}`);

      dispatch({
        type: ACT_FETCH_YOUR_POLLS,
        payload: res.data
      });
    } catch (err) {
      console.log(err);
    }
  }
};

export const actCreatePoll = (pollsetting) => {
  return async (dispatch) => {
    try {
      dispatch({ type: ACT_POLL_IS_CREATING });

      // Re-format the pollsetting
      const optionKeys = Object.keys(pollsetting).filter((d) => d.startsWith("option"));
      const formattedSetting = _.omit(pollsetting, optionKeys);
      formattedSetting.options = optionKeys.map((o) => pollsetting[o]);

      const res = await axios.post('/pollser/create', formattedSetting);

      dispatch({
        type: ACT_POLL_CREATE_SUCCESSFULLY,
        payload: res.data
      });
    } catch (err) {
      console.log(err);
    }
  }
};
