import React from 'react';
import { Modal } from '../index';
import Button from "../../button";
import Dialog from "../../dialog";
import Table from "../../table";

function openModal(){
    let columns = [
        {code: 'pageCode',label: '页面编码'},
        {code: 'pageName',label: '页面名称'}
    ];
    let data = [
        {pageCode:"employee-info",pageName:"员工信息页面"},
        {pageCode:"attend-list",pageName:"请假列表页面"},
        {pageCode:"attend-info",pageName:"请假详情页面"},
        {pageCode:"system-list",pageName:"系统列表页面"},
        {pageCode:"setting",pageName:"设置页面"},
        {pageCode:"notice-list",pageName:"公告列表页面"}
    ];
    let content = <Table columns={columns} dataSource={data} dataIndex="pageCode" pagination={false}/>;
    Modal.show(({ onClose }) => (
        <div className="block-modal-basic-demo">
            <Dialog title="查看详情" content={content} onClose={onClose} buttons={[{"label":"关闭"}]}/>
        </div>
    ));
}

export default <div className="block-modal-demo">
    <Button label="弹出框" type="primary" onClick={openModal}/>
</div>;
