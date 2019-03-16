module.exports = [
    {
        title: "Toaster",
        desc: "",
        columns: ["属性", "说明", "类型", "默认值"],
        data: [
            ["prefixCls", "设置样式前缀", "string", "mt"],

            ["type", "提示类型", "[info|success|warning|error]", "'info'"],
            ["title", "提示的标题", "string", "-"],
            ["content", "提示的内容", "string", "-"]
        ]
    }
];