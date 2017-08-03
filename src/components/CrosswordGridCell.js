import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class CrosswordGridCell extends Component {
  render() {
    const { cell } = this.props;
    const classes = ['crossword-grid-cell'];
    return (
      <div className={_.filter(classes).join(' ')} />
    )
  }
}

CrosswordGridCell.propTypes = {
  cell: PropTypes.object.isRequired
};