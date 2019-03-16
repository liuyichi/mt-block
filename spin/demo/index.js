import React from 'react';
import Doc from '../../util/doc';
import './index.scss';
import api from '../Api';
let conf = {
  "code": "spin",
  "sub": {
    "title": "Spin",
    "desc": "加载中"
  },
  "stage": {
    "title": "使用场景",
    "desc": "希望显示出正在加载时"
  },
  demos: [
    {
      "code": "basic",
      "title": "基本用法",
      "desc": <div>
        <p>目前支持三个点这一种样式</p>
      </div>,
      'element': require('./basic').default,
      "link": "basic.js"
    },
  ],
  api: api
};

export default <Doc className="block-spin-demo" {...conf} />;




