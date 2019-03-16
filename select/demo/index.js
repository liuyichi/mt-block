import React, { Component } from 'react';
import Doc from '../../util/doc';
import './index.scss';
let api = require("../api");

let conf = {
    "code":"select",
    "sub":{
        "title":"Select",
        "desc":"用于从下拉列表中选择输入内容"
    },
    "stage":{
        "title":"使用场景",
        "desc":"当用户需要从下拉列表中选择一项或多项作为表单输入内容时"
    },
    demos:[
        {
            "code":"basic",
            "title":"基本用法",
            "desc":<div>
                <p>下拉框类型共有3种，单选下拉框、复选下拉框、文字输入联想下拉框。</p>
                <p>通过 multiple 属性控制单选下拉框和复选下拉框;通过 combobox 属性控制文字输入联想下拉框。</p>
            </div>,
            'element':require('./basic').default,
            "link":"basic.js"
        },
        {
            "code": "search",
            "title": "搜索",
            "desc": <div>
                <p>可禁用搜索功能</p>
                <p>也可控制未输入关键字时不进行搜索</p>
            </div>,
            'element': require('./search').default,
            "link": "search.js"
        },
        {
            "code": "custom",
            "title": "自定义",
            "desc": <div>
                <p>下拉内容可以自定义模版</p>
                <p>显示框内容也可以自定义模版</p>
            </div>,
            'element': require('./custom').default,
            "link": "custom.js"
        },
        {
            "code": "cascade",
            "title": "省市县级联",
            "desc": <div>
                <p>可以手动清空选中的内容, 自定义获取失败或者为空时的显示</p>
            </div>,
            "element": require('./cascade').default,
            "link": "cascade.js"
        },
        {
            "code": "listCustom",
            "title": "自定义下拉显示列表",
            "desc": <div>
                <p>自定义弹窗的内容和样式</p>
            </div>,
            "element": require('./listCustom').default,
            "link": "listCustom.js"
        }
        // {
        //     "code": "race",
        //     "title": "竞态条件",
        //     "desc": <div>
        //         <p>奇数次搜索比偶数次搜索数据返回很多的情况</p>
        //     </div>,
        //     'element': require('./race').default,
        //     "link": "race.js"
        // },
    ],
    api:api
};

export default <Doc className="block-select-demo" {...conf}/>;




