import React from 'react';
import Doc from '../../util/doc';
import Api from '../api';

import './index.scss';

let conf = {
  "code": "draggable",
  "sub": {
    "title": "Draggable",
    "desc": ""
  },
  "stage": {
    "title": "使用场景",
    "desc": "拖曳，放置"
  },
  demos:[
    {
      "code": "create-bill",
      "title": "表单示例",
      "desc": "拖拽表单组件并排序",
      'element': require('./create-bill').default,
      "link": "create-bill.js"
    },
    {
      "code": "demo-form",
      "title": "表单示例",
      "desc": "拖拽表单组件并排序",
      'element': require('./demo-form').default,
      "link": "demo-from.js"
    },
  ],
  api: Api,
};

export default <Doc className="block-draggble-demo" {...conf} />;
