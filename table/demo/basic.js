import React from "react";
import Table from '../index';

const columns = [
    {
        label: 'Name',
        code: 'name',
        render: text => <a href="#">{text}</a>,
        fixed: 'right',
        width: 150
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
        label: 'Action',
        code: 'action',
        width: 1000,
        render: (text, record) => (
            <span>
              <a href="#">Action 一 {record.name}</a>
              <span className="ant-divider"/>
              <a href="#">Delete</a>
              <span className="ant-divider"/>
              <a href="#" className="ant-dropdown-link">
                  More actions
              </a>
            </span>
        )
    }
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
    },
    {
        key: '11',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park'
    },
    {
        key: '12',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park'
    },
    {
        key: '13',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park'
    },
    {
        key: '21',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park'
    },
    {
        key: '22',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park'
    },
    {
        key: '23',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park'
    },
    {
        key: '31',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park'
    },
    {
        key: '32',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park'
    },
    {
        key: '33',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park'
    }
];

export default <Table scroll={{x: "2000px", y: "200px"}} columns={columns} dataSource={data}/>
