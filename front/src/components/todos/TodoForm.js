import React from 'react';
import {Button, Form, Header, Icon, Label, Modal, Select} from "semantic-ui-react";
import {TODO_TEXT} from "../../text";
import {connect} from "react-redux";
import {
  saveTodo,
  setFormDisplayed,
  setTodoFormTitle,
  setTodoFormUser
} from "../../actions/todos";
import {
  getTodoCreateFormDisplayed,
  getTodoFormEditMode,
  getTodoFormTitle,
  getTodoFormUser,
  getTodoSaving,
  getTodoSavingError
} from "../../selectors/todos";
import {getUsers} from "../../selectors/users";

const TodoForm = ({ title, userId, editMode, users, error, displayed, saveTodo, saving, hide, show, setUserId, setTitle }) => {
  if (!displayed) {
    return null;
  }

  const icon = `${editMode ? 'pencil' : 'plus'} square`;

  return (
    <Modal closeIcon open={displayed} onClose={hide}>
      <Header icon={icon}
              content={editMode ? TODO_TEXT.EDIT_TODO : TODO_TEXT.NEW_TODO} />
      <Modal.Content>
        <Form>
          <Form.Field disabled={saving}>
            <Label>{TODO_TEXT.TITLE}</Label>
            <input value={title} onChange={e => setTitle(e.target.value)} autoFocus />
          </Form.Field>
          <Form.Field disabled={saving} >
            <Label>{TODO_TEXT.USER_NAME}</Label>
            <Select options={users.map(user => ({ key: user.id, value: user.id, text: user.name }))} value={userId}
                    onChange={(e, {value}) => setUserId(value)}
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        { error ? <Label color="red">{error}</Label> : null }
        <Button onClick={() => saveTodo({ title, user_id: +userId })}
                loading={saving}
                color="green"
                disabled={saving || (title && title.trim() === '') || userId === ''}>
          <Icon name={icon} /> {editMode ? TODO_TEXT.SAVE_TODO : TODO_TEXT.CREATE_TODO}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default connect(state => ({
  userId: getTodoFormUser(state),
  title: getTodoFormTitle(state),
  saving: getTodoSaving(state),
  editMode: getTodoFormEditMode(state),
  error: getTodoSavingError(state),
  displayed: getTodoCreateFormDisplayed(state),
  users: getUsers(state),
}), dispatch => ({
  saveTodo: todo => dispatch(saveTodo(todo)),
  show: () => dispatch(setFormDisplayed(true)),
  hide: () => dispatch(setFormDisplayed(false)),
  setTitle: title => dispatch(setTodoFormTitle(title || "")),
  setUserId: user => dispatch(setTodoFormUser(user || "")),
}))(TodoForm);
