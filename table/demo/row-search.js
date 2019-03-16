import React from "react";
import Table from '../index';
import Input from '../../input';

const renderContent = (text,row,index)=>{
    if(index>0){
        return text;
    }
    return {
        props: {
            colSpan: 0
        }
    };
};
const columns = [
    {
        label: '页面名称',
        code: 'pageName',
        render:(text,row,index)=>{
            if(index>0){
                return text;
            }
            return {
                children: <Input placeholder="搜索"/>,
                props: {
                    colSpan: 3
                }
            };
        }
    },
    {
        label: '页面CODE',
        code: 'pageCode',
        render:renderContent
    }
];
const data = [
    {
        pageName: '个人信息',
        pageCode:"employee-info"
    },
    {
        pageCode: 'ruzhi',
        pageName: '入职'
    },
    {
        pageCode: 'zhuanzheng',
        pageName: '转正'
    },
    {
        pageCode: 'qingjia',
        pageName: '请假'
    }
];

const getData = ()=>{
    data.unshift({pageName:"111",pageCode:"111"});
    return data;
};

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    render:(row,index,expandIcon)=>{   //让input所在的行没有checkbox
        if(index>0){
            return expandIcon;
        }
        return {
            props:{
                colSpan:0
            }
        };
    }
};

export default  <Table rowSelection={rowSelection} columns={columns} dataSource={getData()} pagination={false} />;
