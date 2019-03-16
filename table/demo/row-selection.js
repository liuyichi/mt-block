import React from "react";
import Table from '../index';


const columns = [
    {
        label: 'Name',
        code: 'name',
        width: "30%",
        render: text => <a href="#">{text}</a>
    },
    {
        label: 'Age',
        code: 'age',
        width: "30%"
    },
    {
        label: 'Address',
        code: 'address',
        width: "30%",
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
        address: 'London No. 1 Lake Park',
        children: [
          {
            key: '21',
            name: "Jim Green child1",
            age: 30,
            address: "New York No. 2 Lake Park"
          },
          {
            key: '22',
            name: "Jim Green child2",
            age: 30,
            address: "New York No. 2 Lake Park",
            children: [
              {
                key: "221",
                name: "Jim Green child21",
                age: 22,
                address: "New York No. 2 Lake Park",
              }
            ]
          },

        ]
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park'
    },
    {
        key: '4',
        name: 'Disabled User',
        age: 99,
        address: 'Sidney No. 1 Lake Park'
    }
];

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
    },
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User'
    })
};

export default  <Table rowSelection={rowSelection}
                       columns={columns}
                       scroll={{y:200}}
                       dataSource={data}/>;
