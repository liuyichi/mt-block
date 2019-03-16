let model = [
    {
        title: "React",
        desc: "react 相关的API",
        columns: ["参数", "说明", "类型", "默认值"],
        data: [
            ["prefixCls", "设置样式前缀", "string", "mt"]
        ]
    },
    {
        title: "Dom",
        desc: "dom 操作相关API",
        columns: ["参数", "说明", "类型", "默认值"],
        data: [
            ["prefixCls", "设置样式前缀", "string", "mt"],
        ]
    },
    {
        title: "Data",
        desc: "数据对象操作相关API",
        columns: ["方法名", "方法说明", "参数", "返回值类型 | 返回值说明"],
        data: [
            ["getOptions()", "获取当前的可选项", "-", "array | 返回当前所有的可选项，即传给 radioGroup 的 model"],
        ]
    }
];

export default model;
