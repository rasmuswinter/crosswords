import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware';
import _ from 'lodash';

import { actions } from './constants';

export default function (state = { crosswords: [] }, action) {
  console.log('crossword reducer handling action', action, '(state=', state, ')');
  let crosswords = state.crosswords;
  switch (action.type) {
    case actions.FETCH_CROSSWORD + '_' + PENDING:
      crosswords = handlePendingFetch(action, state);
      break;
    case actions.FETCH_CROSSWORD + '_' + FULFILLED:
      crosswords = handleFulfilledFetch(action, state);
      break;
    case actions.FETCH_CROSSWORD + '_' + REJECTED:
      crosswords = handleFailedFetch(action, state);
      break;
  //   case `${types.LOAD_BOOKS}_SUCCESS`: {
  //     console.log('reducer', action.payload);
  //     const data = action.payload.data.items;
  //     const items = Object.values(data);
  //
  //     if (items.length > 0) {
  //       return {
  //         ...state,
  //         books: Object.values(data),
  //         booksFetched: true,
  //         booksError: false,
  //       };
  //     }
  //
  //     return state;
  //   }
  //
  //   case `${types.LOAD_BOOKS}_ERROR`: {
  //     return {
  //       ...state,
  //       booksError: true,
  //     };
  //   }
  //
  //   case 'BOOKS_LOADING':
  //     return {
  //       ...state,
  //       booksLoading: action.booksLoading,
  //     };
  //
  }

  return {
    crosswords,
    lastAction: action
  };
}

function handlePendingFetch(action, state) {
  const { crosswordId } = action.payload;
  console.log('fetching crossword', crosswordId);
  const crosswords = _.filter(state.crosswords, item => item.crosswordId !== crosswordId);
  crosswords.push({
    crosswordId,
    crossword: {
      loading: true
    }
  });
  return crosswords;
}

function handleFulfilledFetch(action, state) {
  const { crosswordId } = action.payload;
  const { crosswords } = state;
  console.log('fetched crossword', crosswordId);
  const data = _.find(crosswords, { crosswordId });
  data.crossword = action.payload.data;
  return crosswords;
}

function handleFailedFetch(action, state) {
  const error = action.payload;
  const { crosswords } = state;
  console.log('fetch failed', error.crosswordId);
  const data = _.find(crosswords, { crosswordId: error.crosswordId });
  data.crossword = { error: error.message };
  return crosswords;
}
