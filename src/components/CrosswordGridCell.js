import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class CrosswordGridCell extends React.Component {
  render() {
    const { cell, showSolution } = this.props;
    const classes = ['crossword-grid-cell'];
    if (cell.empty) {
      classes.push('empty');
    }
    return (
      <div className={_.filter(classes).join(' ')}>{showSolution && !cell.empty && cell.letter}</div>
    )
  }
}

CrosswordGridCell.propTypes = {
  cell: PropTypes.object.isRequired,
  showSolution: PropTypes.bool.isRequired
};