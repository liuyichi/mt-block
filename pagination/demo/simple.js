import React, { Component } from 'react';
import Pagination from '../index';
import Button from '../../button';

class Demo extends Component {
  render() {
    return (
      <div className="pagination-simple-demo">
        <Pagination defaultCurrent={3} size='small' total={450} showQuickJumper={true} simple={true} />
      </div>
    );
  }
}

export default <Demo />