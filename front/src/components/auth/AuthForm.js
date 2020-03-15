import React from 'react';
import {connect} from "react-redux";
import {Button, Dimmer, Form, Grid, Header, Loader, Message, Segment} from "semantic-ui-react";
import {AUTH_TEXT} from "../../text";
import {getAuthError, getAuthLogin, getAuthPassword, getAuthSubmitting} from "../../selectors/auth";
import {logIn, setLogin, setPassword} from "../../actions/auth";

const AuthForm = ({ login, password, submitting, error, setLogin, setPassword, logIn }) => {
  if (submitting) {
    return (
      <Dimmer active>
        <Loader />
      </Dimmer>
    );
  } else {
    return (
      <Grid textAlign="center" style={{height: "100vh"}} verticalAlign="middle">
        <Grid.Column style={{maxWidth: 450}}>
          <Header as="h2" color="teal" textAlign="center">
            {AUTH_TEXT.FORM_HEADER}
          </Header>
          <Form size="large">
            <Segment>
              <Form.Input fluid icon="user" iconPosition="left" placeholder="Login"
                          value={login} onChange={event => setLogin(event.target.value)}/>
              <Form.Input fluid icon="lock" iconPosition="left" placeholder="Password" type="password"
                          value={password} onChange={event => setPassword(event.target.value)}/>
              <Button color="teal" fluid size="large" onClick={logIn} disabled={login === '' || password === ''}>
                {AUTH_TEXT.LOGIN}
              </Button>
            </Segment>
          </Form>
          {error ? <Message color="red">{error}</Message> : null}
        </Grid.Column>
      </Grid>
    );
  }
};

export default connect(state => ({
  login: getAuthLogin(state),
  password: getAuthPassword(state),
  submitting: getAuthSubmitting(state),
  error: getAuthError(state)
}), dispatch => ({
  setLogin: login => dispatch(setLogin(login)),
  setPassword: password => dispatch(setPassword(password)),
  logIn: () => dispatch(logIn())
}))(AuthForm);
