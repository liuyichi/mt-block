import React from 'react';
import Doc from '../../util/doc';
import './index.scss';
import api from '../Api';
let conf = {
  "code": "dialog",
  "sub": {
    "title": "Dialog",
    "desc": "对话框"
  },
  "stage": {
    "title": "使用场景",
    "desc": "期望在当前页面上弹出对话框与用户交互时"
  },
  demos: [
    {
      "code": "basic",
      "title": "基本用法",
      "desc": <div>
        <p>弹出一个对话框，标题、内容、操作按钮都手动传入</p>
      </div>,
      'element': require('./basic').default,
      "link": "basic.js"
    },
    {
      "code": "alert",
      "title": "标准提示框",
      "desc": <div>
        <p>弹出只包含一个“确认”按钮的标准提示框，有信息、成功、警告、错误四种类型</p>
      </div>,
      'element': require('./alert').default,
      "link": "alert.js"
    },
    {
      "code": "confirm",
      "title": "标准确认框",
      "desc": <div>
        <p>弹出包含“确认”按钮和“取消”按钮的标准提示框</p>
      </div>,
      'element': require('./confirm').default,
      "link": "confirm.js"
    },
  ],
  api: api
};

export default <Doc className="block-dialog-demo" {...conf} />;




