
import React from 'react';
import { Dialog } from '../index';
import Button  from '../../button';

function confirmHandler(){
  Dialog.confirm({
    title: '确认要删除',
    content: '您确认要删除xxx这条记录嘛?',
    onOk:(close)=>{
      console.info('执行删除');
      close();
    }
  })
}

export default <Button label="确认框" type="primary" onClick={confirmHandler}/>;
