import React, { Component } from 'react';
import Pagination from '../index';
import Button from '../../button';

class Demo extends Component {
  render() {
    return (
      <div className="pagination-basic-demo">
        <Pagination defaultCurrent={3}
                    total={450}
                    showSizeChanger={true}
                    pageSizeOptions={['10', '20', '30', '40']}
                    showQuickJumper={true}
                    quickJumperSubmit={true}
                    showTotal={(total, current, pageSize)=>{
                    return Math.max((current - 1)*pageSize + 1, 1) + '-' + Math.min(current*pageSize, total) + '/' + total;
                   }}
        />
        <br />
        <Pagination defaultCurrent={3}
                    total={45}
                    showSizeChanger={true}
        />
      </div>
    );
  }
}

export default <Demo />