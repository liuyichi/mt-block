import React, { Component } from 'react';
import Doc from '../../util/doc';
import './index.scss';
let api = require("../api");
let conf = {
    "code":"bill",
    "sub":{
        "title":"Bill",
        "desc":"表单组件,处理复杂表单"
    },
    "stage":{
        "title":"使用场景",
        "desc":"用户需要录入的表单"
    },
    demos:[
        {
            "code":"basic",
            "title":"基本用法",
            "desc":"通用型表单,通过配置搞定",
            'element':require('./basic').default,
            "link":"basic.js"
        }, {
            "code":"fieldmode",
            "title":"字段状态",
            "desc":"设置Bill的状态有三种分别是: default(默认模式) , mode:view(为只显示模式),disabled:true(控制组件禁用状态)",
            'element':require('./fieldmode').default,
            "link":"fieldmode.js"
        },{
            "code":"allfield",
            "title":"全字段用法",
            "desc":"通用型表单,通过配置搞定",
            'element':require('./allfield').default,
            "link":"allfield.js"
        },{
            "code":"validation",
            "title":"自定义校验",
            "desc":"通用型表单,通过配置搞定",
            'element':require('./validation').default,
            "link":"validation.js"
        },
        {
            "code":"custom-field",
            "title":"自定义字段",
            "desc":"特殊字段的自定义注入,这里替换一个行操作的表格里面",
            'element':require('./custom-field').default,
            "link":"custom-field.js"
        },
        {
            "code":"control",
            "title":"绑定级联控制",
            "desc":"通用型表单,通过配置搞定",
            'element':require('./control').default,
            "link":"control.js"
        },
        {
            "code":"complex_1",
            "title":"复杂用法1",
            "desc":"涉及内容:普通表单分组,当位编辑,view模式和编辑模式,分组自定义,字段自定义",
            'element':require('./complex_1').default,
            "link":"complex_1.js"
        }
    ],
    api:api
};

export default <Doc className="block-bill-demo" {...conf}/>;




