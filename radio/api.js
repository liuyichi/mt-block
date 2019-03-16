import React, { Component } from 'react';
const radioGroupModel = `[
  {"label": "1人", value: 1},
  {"label": "2人", value: 2},
  {"label": "3人", value: 3}
]`;

let model = [
    {
        title: "Radio",
        desc: "复选框支持的属性",
        columns: ["参数", "说明", "类型", "默认值"],
        data: [
            ["prefixCls", "设置样式前缀", "string", "mt"],
            ["name", "指定 radio 原生的 name 值", "string", "-"],
            ["checked", "指定当前是否选中", "boolean", "false"],
            ["defaultChecked", "设置初始是否选中", "boolean", "false"],
            ["indeterminate", "设置半选状态", "boolean", 'false'],
            ["size", "设置按钮大小，可选值为 small|large 或者不设", "string", 'default'],
            ["disabled", "设置禁用状态", "boolean", 'false'],
            ["label", "设置说明文字", "string", "-"],
            ["onChange", "click 事件的 handler", "function(e)", '-'],
            ["onClick", "click 事件的 handler", "function(e)", '-'],
            ["onFocus", "focus 事件的 handler", "function(e)", '-'],
            ["onBlur", "blur 事件的 handler", "function(e)", '-'],
            ["domProps", "设置 radio 原生的属性", "object", '{}']
        ],
    },
    {
        title: "RadioGroup",
        desc: "复选框组支持的属性",
        columns: ["参数", "说明", "类型", "默认值"],
        data: [
            ["prefixCls", "设置样式前缀", "string", "mt"],
            ["mode", "设置控件的状态, 可选值为 default|view 或者不设", "string", "default"],
            ["name", "指定 radio 原生的 name 值", "string", "-"],
            ["value", "设置当前选中的值。当 returnStringIfOnlyChild 为 true 且只有一个可选项时可以是数值或者字符串类型。", "number|string|boolean", ""],
            ["defaultValue", "设置初始选中的值", "number|string|boolean", ""],
            ["size", "radio的统一大小，可选值为 small|large 或者不设", "string", "default"],
            ["disabled", "设置是否统一禁用所有的 radio，单独禁用可以在配置 model 时给指定项传入 disabled:true", "boolean", "false"],
            ["required", "设置是否必填", "boolean", "false"],
            ["validator", "设置校验规则", "function(value)", "-"],
            ["validation", "设置必填校验不通过时的提示文字", "string", "-"],
            ["emptyLabel", "设置当前值为空时显示的文本，只在 mode 为 view 的情况下有效", "string", "-"],
            ["model", <div>必传，指定可选项<pre>{radioGroupModel}</pre></div>, "array", "[]"],
            ["format", "自定义每一项的显示", "function(option) || ReactElement", "[]"],
            //["model", "设置显示的配置, 例如 {idField: 'id', showField: 'name'}", "object", "-"],
            ["onChange", "控件选择的条目改变时的回调函数", "function(value, e)", "-"]
        ],
    },
    {
        title: "RadioGroup.method",
        desc: "复选框组对外提供的方法",
        columns: ["方法名", "方法说明", "参数", "返回值类型 | 返回值说明"],
        data: [
            ["getOptions()", "获取当前的可选项", "-", "array | 返回当前所有的可选项，即传给 radioGroup 的 model"],
            ["validate()", "校验，外部校验时触发预设校验，如必填或设置过 validator 属性等", "-", "bool|当前值是否有效"],
            ["reset()", "重置，如果设置过默认值，则回到默认值的状态", "-", "-"],
            ["clear()", "清空异常状态，校验提示等", "-", "-"]
        ]
    }
];

export default model;
