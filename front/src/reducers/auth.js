import {AUTH_ACTIONS} from "../actions/auth";

const initialState = {
  login: '',
  password: '',
  submitting: false,
  error: null,
  loggedIn: false
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOGIN:
      return {
        ...state,
        login: action.payload,
        error: null
      };
    case AUTH_ACTIONS.SET_PASSWORD:
      return {
        ...state,
        password: action.payload,
        error: null
      };
    case AUTH_ACTIONS.START_SUBMITTING:
      return {
        ...state,
        submitting: true,
        error: null,
        password: ''
      };
    case AUTH_ACTIONS.SET_RESULT:
      return {
        ...state,
        submitting: false,
        error: action.payload.showError ? action.payload.error : null,
        loggedIn: action.payload.error === null
      };
    case AUTH_ACTIONS.RESET:
      return initialState;
    default:
      return state;
  }
}
