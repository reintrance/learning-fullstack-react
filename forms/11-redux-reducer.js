import { FETCH_USERS_REQUEST, FETCH_USERS_SUCCESS, SAVE_USERS_REQUEST, SAVE_USERS_FAILURE, SAVE_USERS_SUCCESS } from './11-redux-actions.js'
const initialState = {
  users: [],
  isLoading: false,
  saveStatus: 'READY',
  user: {
    name: '',
    email: ''
  }
};

export function reducer (state = initialState, action) {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return Object.assign({}, state, {
        isLoading: true
      });
    case FETCH_USERS_SUCCESS:
      return Object.assign({}, state, {
        users: action.users,
        isLoading: false
      });
    case SAVE_USERS_REQUEST:
      return Object.assign({}, state, {
        saveStatus: 'SAVING'
      });
    case SAVE_USERS_FAILURE:
      return Object.assign({}, state, {
        saveStatus: 'ERROR'
      });
    case SAVE_USERS_SUCCESS:
      return Object.assign({}, state, {
        saveStatus: 'SUCCESS',
        user: {
          name: '',
          email: ''
        },
        users: action.users
      });
    default:
      return state;
  }

  return state;
}
