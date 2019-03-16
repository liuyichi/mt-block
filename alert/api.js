module.exports = [
    {
        title: "Alert",
        desc: "",
        columns: ["属性", "说明", "类型", "默认值"],
        data: [
            ["prefixCls", "设置样式前缀", "string", "mt"],

            ["type", "提示类型", "[info|success|warning|error]", "'info'"],
            ["title", "提示的标题", "string", "-"],
            ["content", "提示的内容", "string", "-"],
            ["onClose", "点击关闭按钮时的回调，不传会隐藏关闭按钮", "function(e)", "-"],
        ]
    }
];