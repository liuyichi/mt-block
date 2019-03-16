export default [
  {
    title: "Dialog",
    columns: ["参数", "说明", "类型", "默认值"],
    data: [
      ["prefixCls", "设置样式前缀", "string", "mt"],

      ["title", "对话框的标题", "string|ReactElement", "-"],
      ["content", "对话框的内容", "string|ReactElement", "-"],
      ["buttons", "对话框的按钮", "[{ label, type, action: function(close) }, ...]", "-"],
      ["style", "对话框的样式", "[normal|compact]", "-"],
      ["onClose", "点击关闭按钮时的回调，不传会隐藏关闭按钮", "function(e)", "-"],
    ]
  },
  {
    title: "Method",
    desc: "Modal 对外提供的方法",
    columns: ["方法名", "说明", "参数", "返回值类型|返回值说明"],
    data: [
      ["show(config)", "显示模态对话框", "对话框的配置，作为 props 传递给 <Dialog />", "返回一个 Promise，在模态对话框关闭之后被 resolve"],
      ["confirm(config)", "显示确认框", "{ title, content, onOk, onCancel } | string", "返回一个 Promise，在确认对话框关闭之后被 resolve"],
      ["alert(config, type)", "显示提示框", "{ title, content, onOk } | string, [info|success|warning|error]", "返回一个 Promise，在提示框关闭之后被 resolve"],
      ["info(config)", "显示消息提示框", "{ title, content, onOk } | string", "返回一个 Promise，在提示框关闭之后被 resolve"],
      ["success(config)", "显示成功提示框", "{ title, content, onOk } | string", "返回一个 Promise，在提示框关闭之后被 resolve"],
      ["warning(config)", "显示警告提示框", "{ title, content, onOk } | string", "返回一个 Promise，在提示框关闭之后被 resolve"],
      ["error(config)", "显示错误提示框", "{ title, content, onOk } | string", "返回一个 Promise，在提示框关闭之后被 resolve"],
    ]
  },
];
