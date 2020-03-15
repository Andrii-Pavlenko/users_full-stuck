import React from 'react';
import {Provider} from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { reducer } from './reducers/reducer';
import Users from './components/users/Users';
import thunk from 'redux-thunk';
import Todos from "./components/todos/Todos";
import {Menu} from "semantic-ui-react";
import {NavLink} from "react-browser-router";
import {Route, Switch} from "react-router-dom";

const store = createStore(reducer, applyMiddleware(thunk));

function App() {
  return (
    <Provider store={store}>
      <Menu>
        <Menu.Item as={NavLink} to="/" exact>Home</Menu.Item>
        <Menu.Item as={NavLink} to="/users" exact>Users</Menu.Item>
        <Menu.Item as={NavLink} to="/todos" exact>Todos</Menu.Item>
      </Menu>
      <Switch>
        <Route path="/" exact render={() => <h1>Welcome!</h1>} />
        <Route path="/users" exact component={Users} />
        <Route path="/todos" exact component={Todos} />
      </Switch>
    </Provider>
  );
}

export default App;
