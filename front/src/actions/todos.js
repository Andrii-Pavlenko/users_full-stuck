import {ENDPOINTS} from "../consts";
import {TODO_TEXT} from "../text";
import {populate as populateUsers} from "./users";

export const TODO_ACTIONS = {
  POPULATE: 'TODO_POPULATE',
  SET_LOADING_ERROR: 'TODO_SET_LOADING_ERROR',

  SET_CREATE_FORM_DISPLAYED: 'TODO_SHOW_CREATE_FORM',
  SET_SAVING: 'TODO_SET_SAVING',
  SET_SAVING_ERROR: 'TODO_SET_ERROR',
  ADD: 'TODO_ADD'
};

function populate(todos) {
  return {
    type: TODO_ACTIONS.POPULATE,
    payload: todos
  };
}

function setLoadingError(error) {
  return {
    type: TODO_ACTIONS.SET_LOADING_ERROR,
    payload: error
  };
}

export function setCreateFormDisplayed(displayed) {
  return {
    type: TODO_ACTIONS.SET_CREATE_FORM_DISPLAYED,
    payload: displayed
  };
}

function setSaving(saving) {
  return {
    type: TODO_ACTIONS.SET_SAVING,
    payload: saving
  };
}

function setSavingError(savingError) {
  return {
    type: TODO_ACTIONS.SET_SAVING_ERROR,
    payload: savingError
  };
}

function add(todo) {
  return {
    type: TODO_ACTIONS.ADD,
    payload: todo
  };
}

export function loadTodos() {
  return async dispatch => {
    dispatch(setLoadingError(null));
    let success = false;
    try {
      const response = await fetch(ENDPOINTS.TODOS);
      if (response.status === 200) {
        const todos = await response.json();

        const usersResponse = await fetch(ENDPOINTS.USERS);
        if (usersResponse.status === 200) {
          const users = await usersResponse.json();
          dispatch(populateUsers(users));
          dispatch(populate(todos));
          success = true;
        }
      }
    } finally {
      if (!success) {
        dispatch(setLoadingError(TODO_TEXT.LOADING_ERROR));
      }
    }
  };
}

export function createTodo({ title, userId }) {
  return async dispatch => {
    dispatch(setSavingError(null));
    dispatch(setSaving(true));
    let success = false;
    try {
      const response = await fetch(ENDPOINTS.TODOS, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ title, userId })
      });
      if (response.status === 201) {
        const todo = await response.json();
        dispatch(add(todo));
        success = true;
      }
    } finally {
      dispatch(setSaving(false));
      if (success) {
        dispatch(setCreateFormDisplayed(false));
      } else {
        dispatch(setSavingError(TODO_TEXT.SAVING_ERROR));
      }
    }
  };
}
