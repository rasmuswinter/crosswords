import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import { syncHistoryWithStore } from 'react-router-redux';
import { createBrowserHistory } from 'history'

import createStore from './redux/createStore';
import App from './components/App';
import './styles/main.scss';

if (module.hot) {
  module.hot.accept('./styles/main.scss')
}

const browserHistory = createBrowserHistory();
const store = createStore(browserHistory);
const enhancedHistory = syncHistoryWithStore(browserHistory, store);

render(
  <Provider store={store}>
    <BrowserRouter history={enhancedHistory}>
      <Route component={App} name="Home" path="/" />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
