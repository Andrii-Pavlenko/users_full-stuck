import {combineReducers} from "redux";
import {reducer as usersReducer} from "./users";
import {reducer as todosReducer} from "./todos";

export const reducer = combineReducers({
  users: usersReducer,
  todos: todosReducer,
});
