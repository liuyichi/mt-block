import React from "react";
import Table from '../index';

const columns = [
  [
    {
      label: "基本信息",
      colSpan: 2
    },
    {
      label: "其他",
      colSpan: 2
    }
  ],
  [
    {
      label: 'Name',
      code: 'name',
      width: 200
    },
    {
      label: 'Age',
      code: 'age',
      width: 200
    },
    {
      label: 'Address',
      code: 'address',
      width: 200
    },
    {
      label: 'Action',
      code: 'action'
    }
  ]
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park'
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park'
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  }
];

export default <Table bordered={true} columns={columns} dataSource={data}/>
