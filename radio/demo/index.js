import React, { Component } from 'react';
import Doc from '../../util/doc';
import Api from '../api';

import './index.scss';

let conf = {
    "code": "radio",
    "sub": {
        "title": "Radio",
        "desc": "单选框(Radio)，以及单选按钮组(RadioGroup)"
    },
    "stage": {
        "title": "使用场景",
        "desc": "单选框单独使用，应用于多选一的场景"
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
        }],
    api: Api
};

export default <Doc className="block-radio-demo" {...conf} />;
