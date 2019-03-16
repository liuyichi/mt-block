import React, {Component} from 'react';
import Doc from '../../util/doc';
import './index.scss';
let api = require("../api");
let conf = {
  "code": "records",
  "sub": {
    "title": "Records",
    "desc": "记录高级搜索组件，包含搜索、按钮操作、列表展示等操作的复合组件，有两种模式 Records|Records.Complex。",
  },
  "stage": {
    "title": "使用场景",
    "desc": "数据需要检索和列表展示时",
  },
  demos: [
    {
      "code": "simple-basic",
      "title": "simple模式的基本用法",
      "desc": "通用型表单，通过配置搞定",
      'element': require('./basic').default,
      "link": "basic.js",
    },
    {
      "code": "complex-simple",
      "title": "complex模式的简单搜索",
      "desc": "",
      'element': require('./complex-records/simple').default,
      "link": "complex-records/simple.js",
    },
    {
      "code": "complex-complex",
      "title": "complex模式的复杂搜索",
      "desc": "",
      'element': require('./complex-records/complex').default,
      "link": "complex-records/complex.js",
    },
    {
      "code": "complex-zhaopin",
      "title": "复杂筛选",
      "desc": "",
      'element': require('./complex-records/zhaopin').default,
      "link": "complex-records/zhaopin.js",
    },
  ],
  api: api,
};

export default <Doc className="block-records-demo" {...conf} />;




