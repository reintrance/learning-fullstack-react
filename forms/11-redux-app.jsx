import React from 'react';
import thunkMidleware from 'redux-thunk';
import { connect, Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { reducer } from './11-redux-reducer.js';
import { fetchUsers, saveUsers} from './11-redux-actions.js';
import FormComponent from './11-redux-form.jsx';

const store = createStore(reducer, applyMiddleware(thunkMidleware));
const ReduxForm = connect(mapStateToProps, mapDispatchToProps)(FormComponent);

class UserFormApp extends React.Component {
  componentWillMount () {
    store.dispatch(fetchUsers());
  }

  render () {
    return (
      <Provider store={store}>
        <ReduxForm />
      </Provider>
    )
  }
}

UserFormApp.displayName = __filename.split('/').slice(-1)[0];

module.exports = UserFormApp;

function mapStateToProps (state) {
  return {
    isLoading: state.isLoading,
    fields: state.user,
    users: state.users,
    saveStatus: state.saveStatus
  };
}

function mapDispatchToProps (dispatch) {
  return {
    onSubmit (users) {
      dispatch(saveUsers(users));
    }
  };
}
