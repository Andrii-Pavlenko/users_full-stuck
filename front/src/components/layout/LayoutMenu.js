import React from 'react';
import {Button, Menu} from "semantic-ui-react";
import {NavLink} from "react-browser-router";
import {connect} from "react-redux";
import {logOut} from "../../actions/auth";

const LayoutMenu = ({ logOut }) => {
  return (
    <Menu>
      <Menu.Item as={NavLink} to="/" exact>Home</Menu.Item>
      <Menu.Item as={NavLink} to="/users/">Users</Menu.Item>
      <Menu.Item as={NavLink} to="/todos/">Todos</Menu.Item>
      <Menu.Item position="right"><Button onClick={logOut}>Log out</Button></Menu.Item>
    </Menu>
  );
};

export default connect(null, dispatch => ({
  logOut: () => dispatch(logOut())
}))(LayoutMenu);
