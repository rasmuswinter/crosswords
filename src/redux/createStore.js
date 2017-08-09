import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import { createStore as _createStore, compose, applyMiddleware } from 'redux';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import config from '../../config';

const sagaMiddleware = createSagaMiddleware();
const browserMiddleware = routerMiddleware(browserHistory);

const appliedMiddleware = [sagaMiddleware, browserMiddleware];
if (config.logging.redux) {
  appliedMiddleware.push(createLogger());
}

export default function createStore(initialState = {}) {
  const store = _createStore(
    combineReducers({
      form: formReducer
    }),
    initialState,
    applyMiddleware(...appliedMiddleware)
  );

  // store.runSaga = sagaMiddleware.run;
  // store.runSaga(rootSaga);

  return store
}
