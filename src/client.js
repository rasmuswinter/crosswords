import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';

import createStore from './redux/createStore';
import App from './components/App';
import './styles/main.scss';

const store = createStore();

if (module.hot) {
  module.hot.accept('./styles/main.scss')
}

render(
  <Provider store={store}>
    <BrowserRouter>
      <Route component={App} name="Home" path="/" />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
