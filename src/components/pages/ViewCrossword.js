import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { createSelector } from 'reselect'
import { Link } from 'react-router-dom';

import { actions } from '../../redux/constants';
import CrosswordError from '../../util/CrosswordError';
import client from '../../util/api';
import CrosswordGrid from '../CrosswordGrid';
import CrosswordClues from '../CrosswordClues';

// selectors
const crosswordsActivitySelector = (state, ownProps) => state.crossword.lastAction;
const crosswordsSelector = (state, ownProps) => state.crossword.crosswords;
const crosswordIdSelector = (state, ownProps) => parseInt(ownProps.match.params.crosswordId);
const crosswordSelector = createSelector(
  [crosswordsSelector, crosswordIdSelector, crosswordsActivitySelector],
  (crosswords, crosswordId) => {
    if (crosswords && crosswordId) {
      const data = _.find(crosswords, { crosswordId });
      if (data) {
        const { crossword } = data;
        if (!crossword.number) {
          return crossword;
        }
        const grids = [];
        for (let i=0; i<crossword.config.gridCount; i++) {
          const grid = [];
          const solution = _.find(crossword.solution, { gridNumber: i+1 });
          for (let x=0; x<crossword.config.gridSize; x++) {
            const row = [];
            for (let y=0; y<crossword.config.gridSize; y++) {
              const letter = solution.gridLetters[x][y];
              row.push({
                x,
                y,
                empty: letter === '-',
                letter
              });
            }
            grid.push(row);
          }
          grids.push(grid);
        }
        return _.merge({}, crossword, { grids })
      }
    }
    return null;
  }
);

function mapStoreToProps(state, ownProps) {
  return {
    crosswordId: crosswordIdSelector(state, ownProps),
    crossword: crosswordSelector(state, ownProps)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    requestCrossword: crosswordId => dispatch({
      type: actions.FETCH_CROSSWORD,
      payload: {
        promise: client.fetchCrossword(crosswordId)
          .then(response => response.json())
          .then(data => ({ crosswordId, data }))
          .catch(error => { throw new CrosswordError(crosswordId, error.message) }),
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

    if (!crossword) {
      return null;
    }

    if (crossword.loading) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        {
          crossword.error
            ?
            <div className="error">{crossword.error}</div>
            :
            <div>
              {JSON.stringify(crossword)}
              <h1>Crossword {crossword.number}</h1>
              <h2>By {crossword.setter}</h2>
              {crossword.notes && <p>{crossword.notes}</p>}
              {crossword.grids.map((grid, i) => <CrosswordGrid key={i} cells={grid} showSolution={true} />)}
              <CrosswordClues clues={crossword.clues} alphabet={crossword.config.alphabet} />

            </div>
        }
        <div><Link to={'/' + (crosswordId-1)}>prev</Link> <Link to={'/' + (crosswordId+1)}>next</Link></div>
      </div>
    );
  }
}