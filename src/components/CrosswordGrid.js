import React from 'react';
import PropTypes from 'prop-types';
import CrosswordGridCell from "./CrosswordGridCell";

export default class CrosswordGrid extends React.Component {
  render() {
    const { cells, showSolution } = this.props;
    return (
      <div className="crossword-grid">
        {cells.map((row, rowIndex) => (
          <div className="crossword-grid-row" key={'row-' + rowIndex}>
            {
              row.map((cell, cellIndex) => {
                const props = { cell, showSolution, key: 'row-' + rowIndex + '-cell-' + cellIndex};
                return <CrosswordGridCell {...props} />;
              })
            }
          </div>
        ))}
      </div>
    );
  }
}

CrosswordGrid.propTypes = {
  cells: PropTypes.array.isRequired,
  showSolution: PropTypes.bool.isRequired
};