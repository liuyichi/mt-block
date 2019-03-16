import React, { Component } from 'react';
import Doc from '../../util/doc';
import './index.scss';
let api = require("../Api");
let conf = {
    "code":"tree-select",
    "sub":{
        "title":"TreeSelect",
        "desc":"用于从下拉树结构中选择输入表单的内容"
    },
    "stage":{
        "title":"使用场景",
        "desc":"当用户需要从下拉树结构中选择一项或多项作为表单输入内容时"
    },
    demos:[
        {
            "code":"basic",
            "title":"基本用法",
            "desc":<div>
                <p>下拉树类型共有2种，单选下拉树、复选下拉树。</p>
                <p>通过 multiple 属性控制单选下拉树和复选下拉树。</p>
            </div>,
            'element':require('./basic').default,
            "link":"basic.js"
        }
    ],
    api:api
};

export default <Doc className="block-tree-select-demo" {...conf}/>;




