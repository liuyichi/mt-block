import React from 'react';
import ReactDOM from 'react-dom';
import Toaster from '../toaster';
import Dialog from '../dialog';
import Spin from '../spin';

let Page = {
  dialog(model, type) {
    //FIXME Dialog需要支持okText和cancelText
    switch (type) {
      case 'alert':
        return Dialog.alert(model, model.type);
      case 'confirm':
        return Dialog.confirm(model);
      default:
        return Dialog.show(model);
    }
  },
  toaster(model) {
    Toaster.show(model);
  },
  loading(flag) {
    let self = this;
    if(!self._loading){
      if(flag == false){
        return;
      }
      let div = document.createElement('div');
      let container = document.body;
      container.appendChild(div);
      this._div = div;
      ReactDOM.render(
        <Spin className="app-loading">
        </Spin>, div, function(){
          self._loading = true;
        }
      );
    }
    if (flag == false) {
      this.hideLoading();
    }
  },
  hideLoading() {
    if(this._loading){
      this._div.parentNode.removeChild(this._div);
      this._loading = false;
    }
  }
};

export default Page;
