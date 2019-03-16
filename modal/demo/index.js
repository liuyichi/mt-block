import React from 'react';
import Doc from '../../util/doc';
import './index.scss';
import api from '../Api';
let conf = {
  "code": "modal",
  "sub": {
    "title": "Modal",
    "desc": "模态框"
  },
  "stage": {
    "title": "使用场景",
    "desc": "期望在当前页面上弹出新的层时"
  },
  demos: [
    {
      "code": "basic",
      "title": "基本用法",
      "desc": <div>
        <p>Modal 组件提供一个 show 方法，参数接受一个 React 组件，这个组件会被渲染到一个模态层上</p>
      </div>,
      'element': require('./basic').default,
      "link": "basic.js"
    }
  ],
  api: api
};

export default <Doc className="block-modal-demo" {...conf} />;




