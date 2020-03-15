import {reducer as authReducer} from "./auth";
import {reducer as usersReducer} from "./users";
import {reducer as todosReducer} from "./todos";

import {combineReducers} from "redux";

export const reducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  todos: todosReducer
});
