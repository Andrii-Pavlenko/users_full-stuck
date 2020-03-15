import {TODO_ACTIONS} from "../actions/todos";

const initialState = {
  list: null,
  loadingError: null,

  formDisplayed: false,
  saving: false,
  savingError: false,

  formUser: null,
  formTitle: null,
  editedId: null,

  removedIds: [],
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case TODO_ACTIONS.POPULATE:
      return {
        ...state,
        list: action.payload
      };
    case TODO_ACTIONS.SET_LOADING_ERROR:
      return {
        ...state,
        loadingError: action.payload
      };
    case TODO_ACTIONS.SET_CREATE_FORM_DISPLAYED:
      return {
        ...state,
        formDisplayed: action.payload
      };
    case TODO_ACTIONS.SET_SAVING:
      return {
        ...state,
        saving: action.payload
      };
    case TODO_ACTIONS.SET_SAVING_ERROR:
      return {
        ...state,
        savingError: action.payload
      };
    case TODO_ACTIONS.ADD:
      return {
        ...state,
        list: [...state.list, action.payload]
      };
    default:
      return state;
  }
}
