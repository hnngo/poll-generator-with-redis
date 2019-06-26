import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import userReducer from './userReducer';
import pollReducer from './pollReducer';

export default combineReducers({
  form: formReducer,
  user: userReducer,
  poll: pollReducer
});
