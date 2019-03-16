import React, { Component } from 'react';
import Doc from '../../util/doc';
import Api from '../api';

import './index.scss';

let conf = {
  "code": "checkbox",
  "sub": {
    "title": "Checkbox",
    "desc": "复选框(Checkbox)，以及复选框组(CheckboxGroup)"
  },
  "stage": {
    "title": "使用场景",
    "desc": "复选框单独使用，复选框组用在一组可选项中进行多项选择时"
  },
  demos:[
    {
      "code": "basic",
      "title": "基本用法",
      "desc": "每个选项可在两种状态之间切换",
      'element': require('./basic').default,
      "link": "basic.js"
    }, {
      "code": "fieldmode",
      "title": "字段状态",
      "desc": "复选框状态：默认、选中、禁用、选中并禁用、半选。\n复选框组状态：default(默认模式), mode:view(显示模式), disabled:true(控制组件禁用状态)",
      'element': require('./fieldmode').default,
      "link": "fieldmode.js"
    }, {
      "code": "format",
      "title": "自定义",
      "desc": "format 属性可用来自定义每一项的显示",
      'element': require('./format').default,
      "link": "format.js"
    },{
      "code": "validation",
      "title": "校验方法",
      "desc": "必填校验及自定义校验",
      'element': require('./validation').default,
      "link": "validation.js"
    }],
  api: Api,
};

export default <Doc className="block-checkbox-demo" {...conf} />;
