import createLogger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import { createStore as _createStore, compose, applyMiddleware } from 'redux';

import config from '../../config';
// import reducers from './reducers';
// import DevTools from '../containers/DevTools';
// import rootSaga from './sagas'

const reducers = function() {
  return {};
};

const rootSaga = function * () {
    yield [];
};

const sagaMiddleware = createSagaMiddleware();
const browserMiddleware = routerMiddleware(browserHistory);

const appliedMiddleware = [sagaMiddleware, browserMiddleware];
if (config.logging.redux) {
  appliedMiddleware.push(createLogger());
}

export default function createStore(initialState = {}) {
  const store = _createStore(
    reducers,
    initialState,
    applyMiddleware(...appliedMiddleware)
  );

  store.runSaga = sagaMiddleware.run;
  store.runSaga(rootSaga);

  return store
}
