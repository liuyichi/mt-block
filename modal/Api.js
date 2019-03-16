export default [
  {
    title: "Modal",
    columns: ["参数", "说明", "类型", "默认值"],
    data: [
      ["prefixCls", "设置样式前缀", "string", "mt"]
    ]
  },
  {
    title: "Method",
    desc: "Modal 对外提供的方法 ",
    columns: ["方法名", "说明", "参数", "返回值类型|返回值说明"],
    data: [
      ["show(ModalContent, { onClose, onMaskClick })", "显示模态框", "模态框内容的组件", "返回一个 Promise，在模态框内容组件调用 onClose 方法之后被 resolve"]
    ]
  },
];
