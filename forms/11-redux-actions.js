export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
function fetchUsersRequest () {
  return {
    type: FETCH_USERS_REQUEST
  }
}

export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
function fetchUsersSuccess (users) {
  return {
    type: FETCH_USERS_SUCCESS,
    users
  }
}

export const SAVE_USERS_REQUEST = 'SAVE_USERS_REQUEST';
function saveUsersRequest () {
  return {
    type: SAVE_USERS_REQUEST
  };
}

export const SAVE_USERS_FAILURE = 'SAVE_USERS_FAILURE';
function saveUsersFailure (error) {
  return {
    type: SAVE_USERS_FAILURE,
    error
  };
}

export const SAVE_USERS_SUCCESS = 'SAVE_USERS_SUCCESS';
function saveUsersSuccess (users) {
  return {
    type: SAVE_USERS_SUCCESS,
    users
  };
}

export function fetchUsers () {
  return function (dispatch) {
    dispatch(fetchUsersRequest());

    apiClient.loadUsers().then((users) => {
      dispatch(fetchUsersSuccess(users));
    });
  }
}

export function saveUsers (users) {
  return function (dispatch) {
    dispatch(saveUsersRequest());

    apiClient.saveUsers(users)
      .then((resp) => { dispatch(saveUsersSuccess()) })
      .catch((err) => { dispatch(saveUsersFailure()) });
  }
}

function apiClient(department) {
  return {
    then: function (cb) {
      setTimeout(() => { cb(Courses[department]); }, 1000);
    },
  };
}

apiClient.loadUsers = function () {
  return {
    then: function (cb) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      setTimeout(() => cb(users));
    }
  };
}

apiClient.saveUsers = function (people) {
  const success = !!(this.count++ % 2);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!success) return reject({ success });

      localStorage.setItem('users', JSON.stringify(people));
      return resolve({ success });
    }, 1000);
  });
};

apiClient.count = 1;
