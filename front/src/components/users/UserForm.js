import React from 'react';
import {Button, Form, Header, Icon, Label, Modal} from "semantic-ui-react";
import {USER_TEXT} from "../../text";
import {connect} from "react-redux";
import {
  saveUser,
  setFormDisplayed,
  setUserFormEmail,
  setUserFormName
} from "../../actions/users";
import {
  getUserCreateFormDisplayed,
  getUserFormEditMode,
  getUserFormEmail,
  getUserFormName,
  getUserSaving,
  getUserSavingError
} from "../../selectors/users";

const UserForm = ({ name, email, editMode, error, displayed, saveUser, saving, hide, show, setName, setEmail }) => {
  if (!displayed) {
    return null;
  }

  const emailValid = email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  const icon = `${editMode ? 'pencil' : 'plus'} square`;

  return (
    <Modal closeIcon open={displayed} onClose={hide}>
      <Header icon={icon}
              content={editMode ? USER_TEXT.EDIT_USER : USER_TEXT.NEW_USER} />
      <Modal.Content>
        <Form>
          <Form.Field disabled={saving}>
            <Label>{USER_TEXT.NAME}</Label>
            <input value={name} onChange={e => setName(e.target.value)} autoFocus />
          </Form.Field>
          <Form.Field disabled={saving} error={email.trim() !== '' && !emailValid} >
            <Label>{USER_TEXT.EMAIL}</Label>
            <input value={email} onChange={e => setEmail(e.target.value)} />
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
  saving: getUserSaving(state),
  editMode: getUserFormEditMode(state),
  error: getUserSavingError(state),
  displayed: getUserCreateFormDisplayed(state),
}), dispatch => ({
  saveUser: () => dispatch(saveUser()),
  show: () => dispatch(setFormDisplayed(true)),
  hide: () => dispatch(setFormDisplayed(false)),
  setName: name => dispatch(setUserFormName(name)),
  setEmail: email => dispatch(setUserFormEmail(email)),
}))(UserForm);
