import React, {useEffect} from 'react';
import {Redirect, Route, Switch} from "react-router";
import Users from "../users/Users";
import Todos from "../todos/Todos";
import AuthForm from "../auth/AuthForm";
import {connect} from "react-redux";
import {getAuthLoggedIn} from "../../selectors/auth";
import {logIn} from "../../actions/auth";
import './Container.css';
import LayoutMenu from "./LayoutMenu";

const Container = ({ loggedIn, requestLoginStatus }) => {
  useEffect(() => {
    requestLoginStatus();
  }, []);

  return loggedIn ? (
    <>
      <LayoutMenu />
      <div className="container">
        <div className="content">
          <Switch>
            <Route path="/" exact render={() => <Redirect to="/users/" />} />
            <Route path="/users/" exact component={Users} />
            <Route path="/todos/" exact component={Todos} />
          </Switch>
        </div>
      </div>
    </>
  ) : (
    <AuthForm />
  );
};

export default connect(state => ({
  loggedIn: getAuthLoggedIn(state)
}), dispatch => ({
  requestLoginStatus: () => dispatch(logIn(true))
}))(Container);
