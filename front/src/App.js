import React from 'react';
import {Provider} from "react-redux";
import {applyMiddleware, createStore} from "redux";
import {reducer} from "./reducers/reducer";
import thunk from "redux-thunk";
import Container from "./components/layout/Container";

const store = createStore(reducer, applyMiddleware(thunk));

function App() {
  return (
    <Provider store={store}>
      <Container />
    </Provider>
  );
}

export default App;
