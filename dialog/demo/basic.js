import React from 'react';
import Dialog  from '../index';
import Button  from '../../button';
import Input  from '../../input';

function openDialog(){
  let userName="",password="",userElement,pwdElement;
  let dialog = Dialog.show({
    title:"用户登录",
    className:"dialog-basic-demo",
    content:<div className="dialog-basic-demo-content">
      <Input ref={(target)=>{userElement=target}}
             placeholder="用户名"
             required={true}
             validation="用户名不能为空"
             onChange={(value)=>{userName=value}} />
      <Input
          ref={(target)=>{pwdElement=target}}
          placeholder="密码"
          required={true}
          type="password"
          validation="不能为空"
          onChange={(value)=>{password=value}} />
    </div>,
    buttons: [
      {
        label: '取消',
        action: close => close()
      },
      {
        label: '登录',
        type: 'primary',
        action: close => {
          if(userElement.validate()&&pwdElement.validate()){
            console.info("执行登录");
            console.info(userName,password);
            close();
          }
        }
      }
    ],
    onMaskClick: close => close(),
    onClose: (confirm, data) => confirm()
  });
  console.info(dialog);
}

export default  <Button label="登录" onClick={openDialog} />;
