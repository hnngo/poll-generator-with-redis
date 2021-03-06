import axios from 'axios';
import _ from 'lodash';
import {
  ACT_POLL_IS_CREATING,
  ACT_POLL_CREATE_SUCCESSFULLY,
  ACT_FETCH_POLL_ALL,
  ACT_FETCH_YOUR_POLLS,
  ACT_VOTE_POLL,
  ACT_POLL_UPDATE_SCORE,
  ACT_POLL_DELETE_POLL
} from '../constants';

export const actFetchAllPoll = (user_id = null) => {
  return async (dispatch, getState) => {
    try {
      const { user } = getState();

      // Setup query string
      let queryString = '/pollser/all?';
      let type = ACT_FETCH_POLL_ALL;
      if (user_id) {
        queryString += `user_id=${user_id}`;
        type = ACT_FETCH_YOUR_POLLS;
      }

      const res = await axios.get(queryString);

      dispatch({
        type,
        payload: res.data
      });

      // Trigger socket io the subscribed poll set
      const subscribedPolls = _.map(res.data, (p) => p.poll_id)
      user.socket.emit('subscribe poll', subscribedPolls);
    } catch (err) {
      console.log(err);
    }
  }
};

export const actFetchPollById = (pollid) => {
  return async (dispatch, getState) => {
    try {
      const { user } = getState();

      // Setup query string
      // let queryString = '/pollser/all?';
      // let type = ACT_FETCH_POLL_ALL;
      // if (user_id) {
      //   queryString += `user_id=${user_id}`;
      //   type = ACT_FETCH_YOUR_POLLS;
      // }

      const res = await axios.get(`/pollser/${pollid}`);

      dispatch({
        type: ACT_FETCH_POLL_ALL,
        payload: res.data
      });

      // Trigger socket io the subscribed poll set
      const subscribedPolls = _.map(res.data, (p) => p.poll_id)
      user.socket.emit('subscribe poll', subscribedPolls);
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

export const actVotePoll = (pollid, ansIndex) => {
  return async (dispatch) => {
    const ans = JSON.stringify(ansIndex).replace('[', '').replace(']', '');
    await axios.get(`/pollser/vote/${pollid}?ans_index=${ans}`);

    dispatch({
      type: ACT_VOTE_POLL,
      payload: {
        pollid,
        ansIndex
      }
    });
  }
}

export const actPollUpdateScore = (info) => {
  const { pollid, res } = info;
  const scores = _.fromPairs(_.chunk(res, 2));

  return {
    type: ACT_POLL_UPDATE_SCORE,
    payload: {
      pollid,
      scores
    }
  };
}

export const actPollDelete = (pollid) => {
  axios.delete(`/pollser/${pollid}`);

  return {
    type: ACT_POLL_DELETE_POLL,
    payload: pollid
  }
}
