import React, { Component, PropTypes } from 'react';
import Checkbox from '../checkbox';

export default class Radio extends Component {
  static defaultProps = {
    type: 'radio'
  };

  render() {
    return (
      <Checkbox {...this.props} />
    );
  }
};
