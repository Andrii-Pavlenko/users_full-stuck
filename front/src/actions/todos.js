import { ENDPOINTS } from "../consts";
import { TODO_TEXT } from "../text";
import { populate as populateUsers } from "./users";
import { getTodoEditedId, getTodoFormTitle, getTodoFormUser } from "../selectors/todos";

export const TODO_ACTIONS = {
  POPULATE: 'TODO_POPULATE',
  SET_LOADING_ERROR: 'TODO_SET_LOADING_ERROR',

  SET_CREATE_FORM_DISPLAYED: 'TODO_SET_CREATE_FORM_DISPLAYED',
  SET_SAVING: 'TODO_SET_SAVING',
  SET_SAVING_ERROR: 'TODO_SET_SAVING_ERROR',
  ADD: 'TODO_ADD',
  SAVE: 'TODO_SAVE',
  UPDATE_FORM_TITLE: 'UPDATE_FORM_TITLE',
  UPDATE_FORM_USER: 'UPDATE_FORM_USER',

  ADD_REMOVED_ID: 'TODO_ADD_REMOVED_ID',
  REMOVE: 'TODO_REMOVE',
};

export function populate(todos) {
  return {
    type: TODO_ACTIONS.POPULATE,
    payload: todos,
  };
}

function setLoadingError(error) {
  return {
    type: TODO_ACTIONS.SET_LOADING_ERROR,
    payload: error,
  }
}

export function setFormDisplayed(displayed, editedId = null) {
  return {
    type: TODO_ACTIONS.SET_CREATE_FORM_DISPLAYED,
    payload: {
       displayed,
       editedId,
     },
  };
}

function setSaving(saving) {
  return {
    type: TODO_ACTIONS.SET_SAVING,
    payload: saving,
  };
}

function setSavingError(savingError) {
  return {
    type: TODO_ACTIONS.SET_SAVING_ERROR,
    payload: savingError,
  };
}

function save(editMode, todo) {
  return {
    type: editMode ? TODO_ACTIONS.SAVE : TODO_ACTIONS.ADD,
    payload: todo,
  }
}

export function loadTodos(params) {
  return async dispatch => {
    dispatch(setLoadingError(null));
    let success = false;
    try {
      const response = await fetch(ENDPOINTS.TODOS);
      if (response.status === 200) {
        const todos = await response.json();
        const usersResponse = await fetch(ENDPOINTS.USERS);    //Look here
        if (usersResponse.status === 200) {
            const users = await usersResponse.json();
            dispatch(populateUsers(users));
            dispatch(populate(todos));
            success = true;
        }
      }
    } finally  {
      if (!success) {
        dispatch(setLoadingError(TODO_TEXT.LOADING_ERROR))
      }
    }
  }
}

export function saveTodo() {
  return async (dispatch, getState) => {
    const state = getState();
    const todoId = getTodoEditedId(state);
    const title = getTodoFormTitle(state);
    const user_id = getTodoFormUser(state);

    dispatch(setSaving(true));
    dispatch(setSavingError(null));
    let success = false;
    try {
      const response = await fetch(ENDPOINTS.TODOS + (todoId === null ? '' : '/' + todoId), {
        method: todoId === null ? 'POST' : 'PUT',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ title, user_id })
      });
      if (response.ok) {
        const todo = await response.json();
        dispatch(save(todoId  !== null, todo));
        success = true;
      }
    } finally  {
      dispatch(setSaving(false));
      if (success) {
        dispatch(setFormDisplayed(false));
      } else {
        dispatch(setSavingError(TODO_TEXT.SAVING_ERROR));
      }
    }
  }
}

function addRemovedId(id) {
  return {
    type: TODO_ACTIONS.ADD_REMOVED_ID,
    payload: id,
  };
}

function remove(id) {
  return {
    type: TODO_ACTIONS.REMOVE,
    payload: id,
  };
}

export function removeTodo(id) {
  return async dispatch => {
    dispatch(addRemovedId(id));
    const response = await fetch(`${ENDPOINTS.TODOS}/${id}`, {
      method: 'DELETE'
    });
    const json = await response.json();
    if (json.error === null) {
      dispatch(remove(id));
    }
  }
}

export function setTodoFormTitle(title) {
  return {
    type: TODO_ACTIONS.UPDATE_FORM_TITLE,
    payload: title,
  }
}

export function setTodoFormUser(user) {
  return {
    type: TODO_ACTIONS.UPDATE_FORM_USER,
    payload: user,
  }
}
