module.exports = [
    {
        title: "Button",
        desc: "通过设置 Button 的属性来产生不同的按钮样式，推荐顺序为： shape -> type -> size -> loading -> disabled",
        columns: ["参数", "说明", "类型", "默认值"],
        data: [
            ["prefixCls", "设置样式前缀", "string", "mt"],
            ["className", "设置className", "string", ""],
            ["shape", "设置按钮形状，可选值为 circle|circle-outline|no-outline 或者不设", "string", "-"],
            ["type", "设置按钮类型，可选值为 primary|success|warning|danger|ghost 或者不设", "string", "default"],
            ["size", "设置按钮大小，可选值为 small|large 或者不设,如果对于样式有其他要求,可以运用style属性自定义样式", "string", 'default'],
            ["loading", "设置按钮载入状态", "boolean", 'false'],
            ["disabled", "设置按钮禁用状态", "boolean", 'false'],
            ["label", "设置按钮上显示的文字", "string", "-"],
            ["htmlType", "设置 button 原生的 type 值, 可选值为 submit|button|reset 或者不设", "string", "button"],
            ["icon", "设置按钮的图标类型", "string", "-"],
            ["iconRight", "设置按钮图标的位置", "boolean", "false"],
            ["onClick", "click 事件的 handler", "function(button,e)", '-'],
            ["domProps", "设置 button 原生的属性", "object", '{}'],
            ["style", "设置 button 原生的样式属性", "object", '{}']
        ]
    },
    {
        title:"Method",
        desc:"button 对外提供的方法 ",
        columns: ["方法名", "说明", "参数", "返回值类型|返回值说明"],
        data:[
            ["clearButton()", "清除按钮的点击效果, 去掉clicked的样式", "-", "-"],
            ["loading(flag)", "增加转圈加载效果", "flag: 是否显示loading状态", "-"]
        ]
    },
    {
        title:"ButtonGroup",
        desc:"按钮组",
        columns: ["参数", "说明", "类型", "默认值"],
        data:[
            ["prefixCls", "设置样式前缀", "string", "mt"],
            ["className", "设置className", "string", "-"],
            ["size", "Button.Group 中所有的 Button 的大小，可选值为 small|large 或者不设", "string", "default"],
            ["style", "设置 div 标签的内联样式", "object", "{}"],
            ["domProps", "设置 div 标签原生的属性", "object", "{}"]
        ]
    }
];