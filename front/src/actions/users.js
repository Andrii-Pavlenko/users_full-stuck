import {ENDPOINTS} from "../consts";
import {USER_TEXT} from "../text";
import {getUserEditedId, getUserFormEmail, getUserFormName} from "../selectors/users";

export const USER_ACTIONS = {
  POPULATE: 'USER_POPULATE',
  SET_LOADING_ERROR: 'USER_SET_LOADING_ERROR',

  SET_CREATE_FORM_DISPLAYED: 'USER_SHOW_CREATE_FORM',
  SET_SAVING: 'USER_SET_SAVING',
  SET_SAVING_ERROR: 'USER_SET_ERROR',

  ADD: 'USER_ADD',
  SAVE: 'USER_SAVE',
  UPDATE_FORM_NAME: 'UPDATE_FORM_NAME',
  UPDATE_FORM_EMAIL: 'UPDATE_FORM_EMAIL',

  ADD_REMOVED_ID: 'ADD_REMOVED_ID',
  REMOVE: 'REMOVE'
};

export function populate(users) {
  return {
    type: USER_ACTIONS.POPULATE,
    payload: users
  };
}

function setLoadingError(error) {
  return {
    type: USER_ACTIONS.SET_LOADING_ERROR,
    payload: error
  };
}

export function setFormDisplayed(displayed, editedId = null) {
  return {
    type: USER_ACTIONS.SET_CREATE_FORM_DISPLAYED,
    payload: {
      displayed,
      editedId
    }
  };
}

function setSaving(saving) {
  return {
    type: USER_ACTIONS.SET_SAVING,
    payload: saving
  };
}

function setSavingError(savingError) {
  return {
    type: USER_ACTIONS.SET_SAVING_ERROR,
    payload: savingError
  };
}

function save(editMode, user) {
  return {
    type: editMode ? USER_ACTIONS.SAVE : USER_ACTIONS.ADD,
    payload: user
  };
}

export function loadUsers() {
  return async dispatch => {
    dispatch(setLoadingError(null));
    let success = false;
    try {
      const response = await fetch(ENDPOINTS.USERS);
      if (response.status === 200) {
        const users = await response.json();
        dispatch(populate(users));
        success = true;
      }
    } finally {
      if (!success) {
        dispatch(setLoadingError(USER_TEXT.LOADING_ERROR));
      }
    }
  };
}

function addRemovedId(id) {
  return {
    type: USER_ACTIONS.ADD_REMOVED_ID,
    payload: id
  };
}

function remove(id) {
  return {
    type: USER_ACTIONS.REMOVE,
    payload: id
  };
}

export function removeUser(id) {
  return async dispatch => {
    dispatch(addRemovedId(id));
    const response = await fetch(`${ENDPOINTS.USERS}/${id}`, {
      method: 'DELETE'
    });
    const json = await response.json();
    if (json.error === null) {
      dispatch(remove(id));
    }
  };
}

export function saveUser() {
  return async (dispatch, getState) => {
    const state = getState();
    const userId = getUserEditedId(state);
    const name = getUserFormName(state);
    const email = getUserFormEmail(state);

    dispatch(setSavingError(null));
    dispatch(setSaving(true));
    let success = false;
    try {
      const response = await fetch(ENDPOINTS.USERS + (userId === null ? '' : '/' + userId), {
        method: userId === null ? 'POST' : 'PUT',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ name, email })
      });
      if (response.ok) {
        const user = await response.json();
        dispatch(save(userId !== null, user));
        success = true;
      }
    } finally {
      dispatch(setSaving(false));
      if (success) {
        dispatch(setFormDisplayed(false));
      } else {
        dispatch(setSavingError(USER_TEXT.SAVING_ERROR));
      }
    }
  };
}

export function setUserFormName(name) {
  return {
    type: USER_ACTIONS.UPDATE_FORM_NAME,
    payload: name
  };
}

export function setUserFormEmail(email) {
  return {
    type: USER_ACTIONS.UPDATE_FORM_EMAIL,
    payload: email
  };
}
