import React from "react";
import Table from '../index';


const columns = [
    {
        label: 'Name',
        code: 'name',
        render: text => <a href="#">{text}</a>
    },
    {
        label: 'Cash Assets',
        className: 'column-money',
        code: 'money'
    },
    {
      label: "HomePhone",
      code: "homePhone",
      format: (row, col, index) => {
        if(index == 0){
          return {
            children: row[col.code],
            props: {
              rowSpan: 2
            }
          }
        }
        if(index == 1){
          return {
            children: row[col.code],
            props: {
              rowSpan: 0
            }
          }
        }
        return row[col.code]
      }
    },
    {
        label: 'Address',
        code: 'address'
    }
];

const data = [
    {
        key: '1',
        name: 'John Brown',
        money: '￥300,000.00',
        address: 'New York No. 1 Lake Park',
        homePhone: "110"
    },
    {
        key: '2',
        name: 'Jim Green',
        money: '￥1,256,000.00',
        address: 'London No. 1 Lake Park',
        homePhone: "110"
    },
    {
        key: '3',
        name: 'Joe Black',
        money: '￥120,000.00',
        address: 'Sidney No. 1 Lake Park',
        homePhone: "120"
    },
    {
        key: '4',
        name: 'Joe Black',
        money: '￥120,000.00',
        address: 'Sidney No. 1 Lake Park',
        homePhone: "120"
    },
    {
        key: '5',
        name: 'Joe Black',
        money: '￥120,000.00',
        address: 'Sidney No. 1 Lake Park',
        homePhone: "120"
    }
];

export default <Table
    columns={columns}
    dataSource={data}
    bordered={true}
    scroll={{x: 500}}
/>
