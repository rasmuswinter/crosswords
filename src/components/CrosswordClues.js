import React from 'react';
import PropTypes from 'prop-types';

export default class CrosswordClues extends React.Component {
  render() {
    const { clues, alphabet } = this.props;

    if (alphabet) {

    } else {
      const across = [], down = [];
      return (
        <div>
          <h3>Across</h3>
          {clues.map((clue, i) => (
            <div className="clue" key={'clue-' + i}>{JSON.stringify(clue)}</div>
          ))}
          <h3>Down</h3>
          <p>todo</p>
        </div>
      )
    }


  }
}

CrosswordClues.propTypes = {
  clues: PropTypes.object.isRequired,
  alphabet: PropTypes.bool.isRequired
};