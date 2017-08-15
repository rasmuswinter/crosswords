import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { createSelector } from 'reselect'
import { Link } from 'react-router-dom';
import Promise from 'bluebird';

import { actions } from '../../redux/constants';
import CrosswordError from "../../util/CrosswordError";

// selectors
const crosswordsActivitySelector = (state, ownProps) => state.crossword.lastAction;
const crosswordsSelector = (state, ownProps) => state.crossword.crosswords;
const crosswordIdSelector = (state, ownProps) => parseInt(ownProps.match.params.crosswordId);
const crosswordSelector = createSelector(
  [crosswordsSelector, crosswordIdSelector, crosswordsActivitySelector],
  (crosswords, crosswordId) => {
    console.log('getting crossword', crosswordId, 'from', crosswords);
    if (crosswords && crosswordId) {
      const data = _.find(crosswords, { crosswordId });
      if (data) {
        return data.crossword;
      }
    }
    return null;
  }
);

function mapStoreToProps(state, ownProps) {
  return {
    crosswordId: crosswordIdSelector(state, ownProps),
    crosswords: crosswordsSelector(state, ownProps),
    crossword: crosswordSelector(state, ownProps)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    requestCrossword: crosswordId => dispatch({
      type: actions.FETCH_CROSSWORD,
      payload: {
        promise: new Promise((resolve, reject) => setTimeout(() => {
          if (crosswordId%2 == 1) {
            resolve({ crosswordId, data: {number: crosswordId, data: 'hello world!'} })
          } else {
            reject(new CrosswordError(crosswordId, 'Failed to fetch'));
          }
        }, 4000)),
        data: { crosswordId }
      }
    })
      .catch(() => {})
  };
}

@connect(mapStoreToProps, mapDispatchToProps)
export default class ViewCrossword extends React.Component {

  componentWillMount() {
    // console.log('will mount', this.props);
    const { crossword, crosswordId } = this.props;
    if (!crossword) {
      this.props.requestCrossword(crosswordId);
    }
  }

  componentWillReceiveProps(newProps) {
    console.log('Will receive', newProps);
    const { crossword, crosswordId } = newProps;
    if (!crossword) {
      this.props.requestCrossword(crosswordId);
    }
  }

  render() {
    const { crossword, crosswordId } = this.props;
    // console.log('VIEW', this.props);

    if (crossword) {
      return <div>Found crossword {crosswordId}! {JSON.stringify(crossword)} <Link to={'/' + (crosswordId-1)}>prev</Link> <Link to={'/' + (crosswordId+1)}>next</Link></div>
    } else {
      return <div>Not found crossword {crosswordId}!</div>
    }
  }
}