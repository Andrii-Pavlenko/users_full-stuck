import { TODO_ACTIONS } from "../actions/todos";

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
        list: action.payload,
      };

    case TODO_ACTIONS.SET_LOADING_ERROR:
      return {
        ...state,
        loadingError: action.payload,
      };

    case TODO_ACTIONS.SET_CREATE_FORM_DISPLAYED:
      const { editedId, displayed } = action.payload;
      const editedTodo = editedId === null ? null : state.list.find(todo => todo.id === editedId);
      return {
        ...state,
         formDisplayed: displayed,
         editedId: editedId,
         formTitle: editedTodo && editedTodo.title,
         formUser: editedTodo && editedTodo.user_id, //look on user_id
      };

    case TODO_ACTIONS.SET_SAVING:
      return {
        ...state,
        saving: action.payload,
      };

    case TODO_ACTIONS.SET_SAVING_ERROR:
      return {
        ...state,
        savingError: action.payload,
      };

    case TODO_ACTIONS.ADD:
      return {
        ...state,
        list: [...state.list, action.payload],
      };

    case TODO_ACTIONS.ADD_REMOVED_ID:
      return {
        ...state,
        removedIds: [...state.removedIds, action.payload],
      };

    case TODO_ACTIONS.REMOVE:
      return {
        ...state,
        list: state.list.filter(todo => todo.id !== action.payload),
        removedIds: state.removedIds.filter(id => id !== action.payload),
      };

    case TODO_ACTIONS.SAVE:
      return {
        ...state,
        list: state.list.map(todo => todo.id === state.editedId ? action.payload : todo),
      };

    case TODO_ACTIONS.UPDATE_FORM_TITLE:
      return {
        ...state,
        formTitle: action.payload,
      };

    case TODO_ACTIONS.UPDATE_FORM_USER:
      return {
        ...state,
        formUser: action.payload,
      };

    default:
      return state;
  }
}
