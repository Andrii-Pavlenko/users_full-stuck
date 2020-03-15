import React, {useEffect} from 'react';
import {Button, Divider, Icon, Loader, Message, Table} from "semantic-ui-react";
import {OPERATIONS, USER_TEXT} from "../../text";
import {connect} from "react-redux";
import {loadUsers, removeUser, setFormDisplayed} from "../../actions/users";
import {getUserLoadingError, getUserRemovedIds, getUsers} from "../../selectors/users";
import UserForm from "./UserForm";

const Users = ({ users, removedIds, error, load, showCreateUserForm, showEditUserForm, removeUser }) => {
  useEffect(() => {
    load();
  }, [load]);

  if (error) {
    return (
      <Message negative>
        <Message.Header>{error}</Message.Header>
        <Divider />
        <Button onClick={load}>{USER_TEXT.RETRY_LOADING}</Button>
      </Message>
    );
  } else if (users) {
    return (
      <>
        <Table celled collapsing>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>{USER_TEXT.NAME}</Table.HeaderCell>
              <Table.HeaderCell>{USER_TEXT.EMAIL}</Table.HeaderCell>
              <Table.HeaderCell>{OPERATIONS.EDIT}</Table.HeaderCell>
              <Table.HeaderCell>{OPERATIONS.DELETE}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users.map(user => {
              const removing = removedIds.includes(user.id);
              return (
                <Table.Row key={user.id}>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell><a href={`mailto:${user.email}`}>{user.email}</a></Table.Cell>
                  <Table.Cell>
                    <Button icon onClick={() => showEditUserForm(user.id)}>
                      <Icon name="pencil" />
                    </Button>
                  </Table.Cell>
                  <Table.Cell>
                    <Button icon loading={removing} disabled={removing} onClick={() => removeUser(user.id)}>
                      <Icon name="close" color="red" />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
        <Button onClick={showCreateUserForm}>{USER_TEXT.NEW_USER}</Button>
        <UserForm />
      </>
    );
  } else {
    return <Loader active inline="centered" />;
  }
};

export default connect(state => ({
  users: getUsers(state),
  removedIds: getUserRemovedIds(state),
  error: getUserLoadingError(state)
}), dispatch => ({
  load: () => dispatch(loadUsers()),
  showCreateUserForm: () => dispatch(setFormDisplayed(true)),
  showEditUserForm: id => dispatch(setFormDisplayed(true, id)),
  removeUser: id => dispatch(removeUser(id))
}))(Users);
