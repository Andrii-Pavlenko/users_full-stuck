import {USER_ACTIONS} from "../actions/users";

const initialState = {
  list: null,
  loadingError: null,

  formDisplayed: false,
  saving: false,
  savingError: null,

  formName: null,
  formEmail: null,
  editedId: null,

  removedIds: []
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case USER_ACTIONS.POPULATE:
      return {
        ...state,
        list: action.payload
      };
    case USER_ACTIONS.SET_LOADING_ERROR:
      return {
        ...state,
        loadingError: action.payload
      };
    case USER_ACTIONS.SET_CREATE_FORM_DISPLAYED:
      const editedId = action.payload.editedId;
      const editedUser = editedId === null ? null : state.list.find(user => user.id === editedId);
      return {
        ...state,
        formDisplayed: action.payload.displayed,
        editedId: editedId,
        formName: editedUser === null ? '' : editedUser.name,
        formEmail: editedUser === null ? '' : editedUser.email
      };
    case USER_ACTIONS.SET_SAVING:
      return {
        ...state,
        saving: action.payload
      };
    case USER_ACTIONS.SET_SAVING_ERROR:
      return {
        ...state,
        savingError: action.payload
      };
    case USER_ACTIONS.ADD:
      return {
        ...state,
        list: [...state.list, action.payload]
      };
      case USER_ACTIONS.SAVE:
        return {
        ...state,
        list: state.list.map(user => user.id === state.editedId ? action.payload : user)
      };
      case USER_ACTIONS.ADD_REMOVED_ID:
        return {
        ...state,
        removedIds: [...state.removedIds, action.payload]
      };
      case USER_ACTIONS.UPDATE_FORM_NAME:
        return {
        ...state,
        formName: action.payload
      };
      case USER_ACTIONS.UPDATE_FORM_EMAIL:
        return {
        ...state,
        formEmail: action.payload
      };
    case USER_ACTIONS.REMOVE:
      return {
        ...state,
        list: state.list.filter(user => user.id !== action.payload),
        removedIds: state.removedIds.filter(id => id !== action.payload)
      };
    default:
      return state;
  }
}
