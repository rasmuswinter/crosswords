import React from 'react';
import PropTypes from 'prop-types';
import CrosswordGridCell from "./CrosswordGridCell";

export default class CrosswordGrid extends React.Component {
  render() {
    const { cells } = this.props;
    return (
      <div className="crossword-grid">
        {cells.map((row, rowIndex) => (
          <div className="crossword-grid-row" key={'row-' + rowIndex}>
            {row.map((cell, cellIndex) => <CrosswordGridCell cell={cell} key={'row-' + rowIndex + '-cell-' + cellIndex} />)}
          </div>
        ))}
      </div>
    );
  }
}

CrosswordGrid.propTypes = {
  cells: PropTypes.array.isRequired
};