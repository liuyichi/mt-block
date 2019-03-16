
import React from 'react';
import Dialog from '../index';
import Button from '../../button';

export default <div className="dialog-alert-demo">
    <Button type="primary" onClick={() => Dialog.info({title:"提示",content:"这是一个重要信息"})}>信息提示</Button>
    <Button type="success" onClick={() => Dialog.success('保存成功了!')}>成功提示</Button>
    <Button type="warning" onClick={() => Dialog.warning({title:"警告",content:<p style={{color:"#ff9801"}}>这是一个警告</p>})}>警告提示</Button>
    <Button type="danger" onClick={() => Dialog.error({title:"错误",content:<p style={{color:"red",fontSize:"20px"}}>这是一个错误</p>})}>错误提示</Button>
</div>;
