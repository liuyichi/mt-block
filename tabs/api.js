import React, { Component } from 'react';
const TabsModel = `{
    "idField": "code",
    "showField": "label",
    "iconField": "icon",
    "disableField": "disabled",
    "contentField": "content"
}`;
const TabsValue = `[
    {code: "1", label: "基本", content: "标签页1", className: "_customClassName"},
    {code: "2", label: "带图标", icon: "plus", content: "标签页2"},
    {code: "3", label: "禁用", disabled: true, content: "标签页3"},
    {code: "4", label: "可删除", deleteIcon: true, content: "标签页4"}
]`;

let model = [
    {
        title: "Tabs",
        desc: "选项卡支持的属性",
        columns: ["参数", "说明", "类型", "默认值"],
        data: [
            ["prefixCls", "设置样式前缀", "string", "mt"],
            ["itemClass", "设置单个标签的样式前缀", "function(item, index) or string", "-"],
            ["type", "设置选项卡的显示格式, 可选值为 card 或者不设", "string", "default"],
            ["activeKey", "指定当前选中的项", "string or number", "false"],
            ["defaultActiveKey", "指定默认选中的项", "string or number", "第一项"],
            ["width", "设置选项卡内容的固定宽度", "number or string", '-'],
            ["height", "设置选项卡内容的固定高度", "number or string", '-'],
            ["size", "设置选项卡的大小，可选值为 small|large 或者不设", "string", 'default'],
            ["disabled", "设置选项卡是否禁用", "boolean", 'false'],
            ["deleteIcon", "设置选项卡是否显示删除按钮", "boolean", 'false'],
            ["showPage", "标签卡是否要分页", "boolean", 'true'],
            ["initAll", "是否要在刚开始就挂在所有 tab 的页面", "boolean", 'false'],
            ["autoDestory", "是否自动移除未选中tab的内容, 如果 initAll 为 true, 则此属性不生效", "boolean", 'false'],
            ["position", "设置页签位于内容的什么位置，可选值为 top|left|right|bottom 或者不设", "string", 'top'],
            ["model", <div>设置选项卡的模板, <a href="#model">查看属性</a></div>, "object", <pre>{TabsModel}</pre>],
            ["data", <div>
                设置选项卡的数据, demo 如下:<br/>
                <pre>{TabsValue}</pre>
                <a href="#data">查看属性</a>
            </div>, "string", "[]"],
            ["extraTab", "额外的标签, 不参与分页, 一般的使用场景是'新增标签'", "node or element", '-'],
            ["extraRight", "额外的标签是否显示在最右边, 默认跟随在标签的右边", "boolean", 'false'],
            ["onChange", "切换选项卡触发的 handler", "function(idField)", '-'],
            ["onDelete", "点击删除按钮触发的 handler", "function(idField, item)", '-'],
            ["onPrevClick", "点击上一页触发的 handler, 返回 false 会阻止向前切页", "function(btn, e)", '-'],
            ["onNextClick", "点击下一页触发的 handler, 返回 false 会阻止向后切页", "function(btn, e)", '-']
        ],
    },
    {
        title:"model",
        desc:"",
        columns: ["参数", "说明", "类型", "默认值"],
        data:[
            ["idField", "键的属性名标识", "string or number or boolean", "code"],
            ["showField", "标题的属性名标识", "string or node", "label"],
            ["iconField", "标题图标的属性名标识", "string", "icon"],
            ["contentField", "内容的属性名标识", "string or node", "content"],
        ]
    },
    {
        title:"data",
        desc:"",
        columns: ["参数", "说明", "类型", "默认值"],
        data:[
            ["${model.idField}", "键", "string or number or boolean", "code"],
            ["${model.showField}", "标题", "string or node", "label"],
            ["${model.iconField}", "标题图标", "string", "icon"],
            ["${model.contentField}", "内容", "string or node", "content"],
            ["deleteIcon", "是否显示删除按钮", "boolean", "false"],
            ["autoDestory", "是否在未选中时移除 Dom 节点", "boolean", "false"],
            ["disabled", "是否禁用", "boolean", "false"],
        ]
    }
];

export default model;
