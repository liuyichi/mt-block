import React, { Component } from 'react';
import Api from '../api';
import Pagination from '../Pagination';
import Select from '../../select';
import '../style';
import './index.scss';


class Demo extends Component {
  render() {
    return (
      <div className="pagination-demo">
        <h1>Pagination API</h1>
        <ul className="category">
          <li><a href="javascript: scrollToCode('pagination')">Pagination 接收的参数</a></li>
          <li><a href="javascript: scrollToCode('function')">Radio 提供的方法</a></li>
          <li><a href="javascript: scrollToCode('group')">Radio.Group 接收的参数</a></li>
        </ul>
        <h1>类型</h1>
        <p>根据不同的总页数和当前页数，翻页控件的样式如下（分为normal和small两种尺寸）</p>
        <p>备注：hover、chick等各状态的样式请参考按钮控件</p>
        <h2>normal尺寸</h2>
        <table>
          <tbody>
          <tr>
            <td>带操作的样式</td>
            <td>
              <Pagination defaultCurrent={3}
                          total={45}
                          showSizeChanger={true}
                          pageSizeOptions={['10', '20', '30', '40']}
                          selectComponentClass={Select}
                          showTotal={(total, current, pageSize)=>{
                    return Math.max((current - 1)*pageSize + 1, 1) + '-' + Math.min(current*pageSize, total) + '/' + total;
                   }}
              />
            </td>
          </tr>
          <tr>
            <td>页数很多使用</td>
            <td>
              <Pagination defaultCurrent={3}
                          total={450}
                          showQuickJumper={true}
              />
            </td>
          </tr>
          <tr>
            <td>完整样式</td>
            <td>
              <Pagination defaultCurrent={3}
                          total={450}
                          showSizeChanger={true}
                          pageSizeOptions={['10', '20', '30', '40']}
                          showQuickJumper={true}
                          quickJumperSubmit={true}
                          selectComponentClass={Select}
                          showTotal={(total, current, pageSize)=>{
                    return Math.max((current - 1)*pageSize + 1, 1) + '-' + Math.min(current*pageSize, total) + '/' + total;
                   }}
              />
            </td>
          </tr>
          <tr>
            <td>范围小使用</td>
            <td>
              <Pagination defaultCurrent={3} total={450} showQuickJumper={true} simple={true} />
            </td>
          </tr>
          </tbody>
        </table>

        <h2>small尺寸</h2>
        <table>
          <tbody>
          <tr>
            <td>带操作的样式</td>
            <td>
              <Pagination defaultCurrent={3}
                          size='small'
                          total={45}
                          showSizeChanger={true}
                          pageSizeOptions={['10', '20', '30', '40']}
                          selectComponentClass={Select}
                          showTotal={(total, current, pageSize)=>{
                    return Math.max((current - 1)*pageSize + 1, 1) + '-' + Math.min(current*pageSize, total) + '/' + total;
                   }}
              />
            </td>
          </tr>
          <tr>
            <td>页数很多使用</td>
            <td>
              <Pagination defaultCurrent={3}
                          size='small'
                          total={450}
                          showQuickJumper={true}
              />
            </td>
          </tr>
          <tr>
            <td>完整样式</td>
            <td>
              <Pagination defaultCurrent={3}
                          size='small'
                          total={450}
                          showSizeChanger={true}
                          pageSizeOptions={['10', '20', '30', '40']}
                          showQuickJumper={true}
                          quickJumperSubmit={true}
                          selectComponentClass={Select}
                          showTotal={(total, current, pageSize)=>{
                    return Math.max((current - 1)*pageSize + 1, 1) + '-' + Math.min(current*pageSize, total) + '/' + total;
                   }}
              />
            </td>
          </tr>
          <tr>
            <td>范围小使用</td>
            <td>
              <Pagination defaultCurrent={3} size='small' total={450} showQuickJumper={true} simple={true} />
            </td>
          </tr>
          </tbody>
        </table>
        <Api />
      </div>
    )
  }
}

export default <Demo />