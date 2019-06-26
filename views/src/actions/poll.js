import axios from 'axios';
import {
  ACT_POLL_CREATE
} from '../constants';

export const actCreatePoll = (pollsetting) => {
  return async (dispatch) => {
    console.log(pollsetting);

    // Re-format the pollsetting
    const optionKeys = Object.keys(pollsetting).map((d) => d.startsWith("option"));


    // const res = await axios.post('/pollser/create', pollsetting);

    // console.log(res.data);
    
    dispatch({
      type: ACT_POLL_CREATE
    })
  }
};
