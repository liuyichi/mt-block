import React, { Component } from 'react';
import Doc from '../../util/doc';
import './index.scss';
let api = require("../api");
let conf = {
    "code":"workspace",
    "sub":{
        "title":"Workspace",
        "desc":"这个页面的工作区间,包含导航和整个页面的布局,通用导航和路由控制"
    },
    "stage":{
        "title":"使用场景",
        "desc":"项目的入口设置路由配置,页面导航,组件组装使用"
    },
    demos:[
        {
            "code":"basic",
            "title":"基本用法",
            "desc":"只显示导航不包含路由",
            'element':require('./basic').default,
            "link":"basic.js"
        },
        //{
        //    "code":"custom",
        //    "title":"复杂用法",
        //    "desc":"与 router 一起构建一个项目",
        //    'element':require('./custom').default,
        //    "link":"custom.js"
        //}
    ],
    api:api
};

export default <Doc className="block-workspace-demo" {...conf}/>;




