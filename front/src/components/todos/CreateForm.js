import React, {useState} from 'react';
import {Button, Form, Header, Icon, Label, Modal, Select} from "semantic-ui-react";
import {TODO_TEXT} from "../../text";
import {createTodo, setCreateFormDisplayed} from "../../actions/todos";
import {connect} from "react-redux";
import {getTodoCreateFormDisplayed, getTodoSaving, getTodoSavingError} from "../../selectors/todos";
import {getUsers} from "../../selectors/users";

const CreateTodo = ({ displayed, error, saving, users, saveTodo, show, hide }) => {
  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState('');

  return (
    <Modal trigger={<Button onClick={() => {
      setTitle('');
      setUserId('');
      show();
    }}>{TODO_TEXT.NEW_TODO}</Button>} closeIcon
           open={displayed}
           onClose={hide}>
      <Header icon="plus square" content={TODO_TEXT.NEW_TODO} />
      <Modal.Content>
        <Form>
          <Form.Field disabled={saving}>
            <label>{TODO_TEXT.TITLE}</label>
            <input value={title} onChange={event => setTitle(event.target.value)} autoFocus />
          </Form.Field>
          <Form.Field disabled={saving}>
            <label>{TODO_TEXT.USER_NAME}</label>
            <Select options={users.map(user => ({key: user.id, value: user.id, text: user.name}))} value={userId}
                    onChange={(event, {value}) => setUserId(value)} />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        { error ? <Label color="red">{error}</Label> : null }
        <Button onClick={() => saveTodo({ title, userId: +userId })}
                loading={saving}
                disabled={saving || title.trim() === '' || userId === ''}
                color="green">
          <Icon name="plus square" /> {TODO_TEXT.CREATE_TODO}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default connect(state => ({
  saving: getTodoSaving(state),
  error: getTodoSavingError(state),
  displayed: getTodoCreateFormDisplayed(state),
  users: getUsers(state)
}), dispatch => ({
  saveTodo: todo => dispatch(createTodo(todo)),
  show: () => dispatch(setCreateFormDisplayed(true)),
  hide: () => dispatch(setCreateFormDisplayed(false))
}))(CreateTodo);
