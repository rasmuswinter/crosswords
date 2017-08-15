import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import { createStore as _createStore, applyMiddleware } from 'redux';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import promiseMiddleware from 'redux-promise-middleware';

import config from '../../config';
import crosswordReducer from './crosswordReducer';

export default function createStore(history, initialState = {}) {
  const middleware = [
    promiseMiddleware(),
    // createSagaMiddleware(),
    routerMiddleware(history)
  ];
  if (config.logging.redux) {
    middleware.push(createLogger());
  }

  const store = _createStore(
    combineReducers({
      form: formReducer,
      routing: routerReducer,
      crossword: crosswordReducer
    }),
    initialState,
    applyMiddleware(...middleware)
  );

  // store.runSaga = sagaMiddleware.run;
  // store.runSaga(rootSaga);

  return store
}
