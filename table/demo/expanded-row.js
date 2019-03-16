/**
 * Created by shaohuanxia on 2017/7/11.
 */
import React from 'react';
import Table from '../index';


const columns = [
  {
    label: 'Name',
    code: 'name'
  },
  {
    label: 'Age',
    code: 'age'
  },
  {
    label: 'Address',
    code: 'address'
  },
  {
    label: 'sex',
    code: 'sex'
  }
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    desc: "John Brown likes playing",
    sex: "boy"
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    desc: "Jim Green likes sleeping",
    sex: "gril"
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    desc: "Joe Black likes eating",
    sex: "boy"
  }
];



export default  <Table columns={columns}
                       expandedRowRender={ record => <div>{record.desc}</div>}
                       defaultExpandedRowKeys={["1","2"]}
                       onExpandedRowsChange={ (expandedRowsKeys) => {console.log(expandedRowsKeys)} }
                       onExpand={ (expanded, row) => {console.log("expanded:" + expanded); console.log(row)} }
                       dataSource={data}
                       pagination={false}/>;





