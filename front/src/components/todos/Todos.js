import React, { useEffect } from 'react';
import {Table, Message, Loader, Divider, Button, Icon} from 'semantic-ui-react';
import {OPERATIONS, TODO_TEXT} from '../../text';
import { connect } from 'react-redux';
import { loadTodos, removeTodo, setFormDisplayed } from '../../actions/todos';
import TodoForm from "./TodoForm";
import {getTodoLoadingError, getTodoRemovedIds, getTodos} from "../../selectors/todos";

const Todos = ({ todos, error, load, showCreateTodoForm, removedIds, removeTodo, showEditTodoForm  }) => {
  useEffect(() => {
    load();
  }, [load]);

  if (error) {
    return (
      <Message negative>
        <Message.Header>{error}</Message.Header>
        <Divider />
        <Button type="button" onClick={load}>{TODO_TEXT.RETRY_LOADING}</Button>
      </Message>
    )
  } else if (todos) {
    return (
      <>
        <Table celled collapsing>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>{TODO_TEXT.TITLE}</Table.HeaderCell>
              <Table.HeaderCell>{TODO_TEXT.USER_NAME}</Table.HeaderCell>
              <Table.HeaderCell>{OPERATIONS.EDIT}</Table.HeaderCell>
              <Table.HeaderCell>{OPERATIONS.DELETE}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {todos.map(todo => {
              const removing = removedIds.includes(todo.id);
              return (
                <Table.Row key={todo.id}>
                  <Table.Cell>{todo.title}</Table.Cell>
                  <Table.Cell>{todo.userName}</Table.Cell>
                  <Table.Cell>
                    <Button icon onClick={() => showEditTodoForm(todo.id)}>
                      <Icon name="pencil" />
                    </Button>
                  </Table.Cell>
                  <Table.Cell>
                    <Button icon loading={removing} disabled={removing} onClick={() => removeTodo(todo.id)}>
                      <Icon name="close" color="red" />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
        <Button onClick={showCreateTodoForm}>{TODO_TEXT.NEW_TODO}</Button>
        <TodoForm />
      </>
    );
  } else {
    return <Loader active inline="centered" />;
  }
};

export default connect(state => ({
  todos: getTodos(state),
  removedIds: getTodoRemovedIds(state),
  error: getTodoLoadingError(state),
}), dispatch => ({
  load: () => dispatch(loadTodos()),
  showCreateTodoForm: () => dispatch(setFormDisplayed(true)),
  showEditTodoForm: id =>  dispatch(setFormDisplayed(true, id)),
  removeTodo: id => dispatch(removeTodo(id)),
}))(Todos);
