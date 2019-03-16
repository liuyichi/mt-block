import React, { Component } from 'react';
import Doc from '../../util/doc';
import './index.scss';
let api = require("../api");
let conf = {
    "code":"button",
    "sub":{
        "title":"Button",
        "desc":"按钮用于点击的交互"
    },
    "stage":{
        "title":"使用场景",
        "desc":"响应用户的行为,触发业务逻辑"
    },
    demos:[
        {
            "code":"basic",
            "title":"基本用法",
            "desc":<div>
                <p>按钮有5种类型:默认(default)、信息(primary)、成功(success)、警告(warning)、危险(danger)</p>
                <p>通过设置 type 为 default primary success warning danger，若不设置 type 值则为默认。不同的样式可以用来区别其使用场景</p>
            </div>,
            'element':require('./basic').default,
            "link":"basic.js"
        },
        {
            "code":"shape",
            "title":"形状",
            "desc":"按钮的形状分为三种:文字形式(no-outline)、方形(-)、有底色的圆形(circle)、无底色的圆型(circle-outline);默认为方形,通过shape属性来设置.",
            'element':require('./shape').default,
            "link":"shape.js"
        },
        {
            "code":"size",
            "title":"大小",
            "desc":"按钮的大小分4中:正常(normal)、大号(large)、小号(small)、小小号(xsmall);默认为正常,通过size属性设置,如果对于样式有其他要求,可以运用style属性自定义样式",
            'element':require('./size').default,
            "link":"size.js"
        },
        {
            "code":"icon",
            "title":"带图标",
            "desc":"分3种组合:单图标、图标+文字、文字+图标;通过设置icon和iconRight属性实现",
            'element':require('./icon').default,
            "link":"icon.js"
        },
        {
            "code":"state",
            "title":"按钮的状态",
            "desc":"按钮的状态分为:正常、不可点击、loading状态;通过disabled设置是否可用,通过loading设置是否是加载中",
            'element':require('./state').default,
            "link":"state.js"
        },
        {
            "code":"button-group",
            "title":"按钮组",
            "desc":"按钮可以组合使用,提供ButtonGroup组件",
            'element':require('./button-group').default,
            "link":"button-group.js"
        }
    ],
    api:api
};

export default <Doc className="block-button-demo" {...conf}/>;




