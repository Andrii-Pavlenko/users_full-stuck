import {ENDPOINTS} from "../consts";
import {getAuthLogin, getAuthPassword} from "../selectors/auth";
import {AUTH_TEXT} from "../text";
import cookie from 'react-cookies';

export const AUTH_ACTIONS = {
  SET_LOGIN: 'SET_LOGIN',
  SET_PASSWORD: 'SET_PASSWORD',
  START_SUBMITTING: 'START_SUBMITTING',
  SET_RESULT: 'SET_RESULT',
  RESET: 'RESET'
};

export function setLogin(login) {
  return {
    type: AUTH_ACTIONS.SET_LOGIN,
    payload: login
  };
}

export function setPassword(password) {
  return {
    type: AUTH_ACTIONS.SET_PASSWORD,
    payload: password
  };
}

function startSubmitting() {
  return {
    type: AUTH_ACTIONS.START_SUBMITTING
  };
}

function setResult(error, showError = true) {
  return {
    type: AUTH_ACTIONS.SET_RESULT,
    payload: { error, showError }
  };
}

function reset() {
  return {
    type: AUTH_ACTIONS.RESET
  };
}

export function logIn(requestStatus = false) {
  return async (dispatch, getState) => {
    const state = getState();
    const login = getAuthLogin(state);
    const password = getAuthPassword(state);
    dispatch(startSubmitting());
    try {
      let response;
      if (requestStatus) {
        response = await fetch(ENDPOINTS.LOGIN_STATUS);
      } else {
        response = await fetch(ENDPOINTS.LOGIN, {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({login, password})
        });
      }
      if (response.ok) {
        dispatch(setResult(null));
      } else {
        dispatch(setResult(AUTH_TEXT.INVALID_CREDENTIALS, !requestStatus));
      }
    } catch(e) {
      dispatch(setResult(AUTH_TEXT.NO_CONNECTION, !requestStatus));
    }
  };
}

export function logOut() {
  return dispatch => {
    fetch(ENDPOINTS.LOGOUT, {
      method: 'POST'
    });
    cookie.remove('connect.sid', {path: '/'});
    dispatch(reset());
  };
}
