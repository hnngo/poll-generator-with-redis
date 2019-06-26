import axios from 'axios';
import _ from 'lodash';
import {
  ACT_POLL_CREATE,
  ACT_FETCH_POLL_ALL
} from '../constants';

export const actFetchAllPoll = () => {
  return async (dispatch) => {
    const res = await axios.get('/pollser/all');

    dispatch({
      type: ACT_FETCH_POLL_ALL,
      payload: res.data
    });
  }
};

export const actCreatePoll = (pollsetting) => {
  return async (dispatch) => {
    // Re-format the pollsetting
    const optionKeys = Object.keys(pollsetting).filter((d) => d.startsWith("option"));
    const formattedSetting = _.omit(pollsetting, optionKeys);
    formattedSetting.options = optionKeys.map((o) => pollsetting[o]);

    const res = await axios.post('/pollser/create', formattedSetting);

    console.log(res.data);
    
    dispatch({
      type: ACT_POLL_CREATE,
      payload: res.data
    })
  }
};
