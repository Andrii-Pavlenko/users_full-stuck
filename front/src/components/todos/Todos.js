import React, {useEffect} from 'react';
import {Button, Divider, Loader, Message, Table} from "semantic-ui-react";
import {TODO_TEXT} from "../../text";
import {connect} from "react-redux";
import {loadTodos} from "../../actions/todos";
import CreateTodo from "./CreateTodo";
import {getTodoLoadingError, getTodos} from "../../selectors/todos";

const Todos = ({ todos, error, load }) => {
  useEffect(() => {
    load();
  }, [load]);

  if (error) {
    return (
      <Message negative>
        <Message.Header>{error}</Message.Header>
        <Divider />
        <Button onClick={load}>{TODO_TEXT.RETRY_LOADING}</Button>
      </Message>
    );
  } else if (todos) {
    return (
      <>
        <Table celled collapsing>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>{TODO_TEXT.TITLE}</Table.HeaderCell>
              <Table.HeaderCell>{TODO_TEXT.USER_NAME}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {todos.map(todo => (
              <Table.Row key={todo.id}>
                <Table.Cell>{todo.title}</Table.Cell>
                <Table.Cell>{todo.userName}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <CreateTodo />
      </>
    );
  } else {
    return <Loader active inline='centered' />;
  }
};

export default connect(state => ({
  todos: getTodos(state),
  error: getTodoLoadingError(state)
}), dispatch => ({
  load: () => dispatch(loadTodos())
}))(Todos);
