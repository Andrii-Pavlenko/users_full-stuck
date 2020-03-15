import React from 'react';
import {Button, Form, Header, Icon, Label, Modal} from "semantic-ui-react";
import {USER_TEXT} from "../../text";
import {connect} from "react-redux";
import {
  getUserCreateFormDisplayed,
  getUserFormEditMode,
  getUserFormEmail,
  getUserFormName,
  getUserSaving,
  getUserSavingError
} from "../../selectors/users";

const UserForm = ({ name, email, editMode, displayed, error, saving, saveUser, show, hide, setName, setEmail }) => {
  if (!displayed) {
    return null;
  }

  const emailValid = email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  const icon = `${editMode ? 'pencil' : 'plus'} square`;

  return (
    <Modal closeIcon open onClose={hide}>
      <Header icon={icon}
              content={editMode ? USER_TEXT.EDIT_USER : USER_TEXT.NEW_USER} />
      <Modal.Content>
        <Form>
          <Form.Field disabled={saving}>
            <label>{USER_TEXT.NAME}</label>
            <input value={name} onChange={event => setName(event.target.value)} autoFocus />
          </Form.Field>
          <Form.Field disabled={saving} error={email.trim() !== '' && !emailValid}>
            <label>{USER_TEXT.EMAIL}</label>
            <input value={email} onChange={event => setEmail(event.target.value)} />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        { error ? <Label color="red">{error}</Label> : null }
        <Button onClick={() => saveUser()}
                loading={saving}
                color="green"
                disabled={saving || name.trim() === '' || !emailValid}>
          <Icon name={icon} /> {editMode ? USER_TEXT.SAVE_USER : USER_TEXT.CREATE_USER}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default connect(state => ({
  name: getUserFormName(state),
  email: getUserFormEmail(state),
  editMode: getUserFormEditMode(state),
  saving: getUserSaving(state),
  error: getUserSavingError(state),
  displayed: getUserCreateFormDisplayed(state)
}), dispatch => ({
  saveUser: () => dispatch(saveUser()),
  show: () => dispatch(setFormDisplayed(true)),
  hide: () => dispatch(setFormDisplayed(false)),
  setName: name => dispatch(setUserFormName(name)),
  setEmail: email => dispatch(setUserFormEmail(email))
}))(UserForm);
