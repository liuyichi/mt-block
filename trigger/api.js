import React from 'react';

const alignConf = `{
  points: ['tl', 'bl'],
  offset: [0, 2],
  targetOffset: [0, 2],
  overflow: {
    adjustX: true, 
    adjustY: true, 
  },
  useCssBottom: 1,
  useCssRight: 1,
  useCssTransform: 1,
}`;

const  align = `{
  points: ['tl', 'bl'],
  offset: [0, 2],
  overflow: {
    adjustX: 0,
    adjustY: 0,
  }
}`;

module.exports = [
	{
		title: "Trigger 接收的参数",
		desc: "trigger支持的属性",
		columns: ["属性", "说明", "类型", "默认值"],
		data: [
		  ["prefixCls", "设置样式前缀", "string", "mt"],
		  ["popupClassName", "设置 popup 弹出 dom 的样式前缀", "string", ""],
		  ["visible", "设置显示与否", "boolean", "-"],
		  ["defaultVisible", "设置默认显示与否", "boolean", "false"],
		  ["equalTargetWidth", "设置是否与参照节点等宽", "boolean", "true"],
		  ["equalTargetHeight", "设置是否与参照节点等高", "boolean", "false"],
		  ["align", <div>配置弹出位置 ,详细配置说明查看<a href="#basic">基本用法</a>,举个栗子:<pre>{alignConf}</pre></div>, "object", <pre>{align}</pre>],
		  ["autoDestory", "是否在 visible 为 false 时自动移除 DOM", "string", "false"],
		  ["getPopupContainer", "弹出到的父节点, 需要返回一个 DOM 节点", "function()", "默认弹出到实例化trigger的组件里"],
		  ["target", "相对于哪一个节点来定位位置, 需要返回一个 DOM 节点", "function()", "document.body"],
		  ["onAfterVisible", "当前 visible 改变时的 handler", "function(visible)", '-'],
		  ["onAlign", "弹出位置的计算函数", "function(sourceNode, positionAfterDomAlign)", '-'],
		]
	},
	{
		title: "Trigger 提供的方法",
		desc: "提供方法的描述",
		columns: ["方法", "方法说明", "参数说明", "返回值类型 | 返回值说明"],
		data: [
      ["removePopup()", "移除弹出框", "-", "-"],
      ["getPopupDOMNode()", "获取当前弹出框的DOM", "-", "element, 返回弹出框的dom"],
      ["forceAlign()", "重新定位弹出框的位置", "-", "-"],
    ]
	}
];