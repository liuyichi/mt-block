import React from 'react';

const locale = 	<pre>
								  <p>label: "上传文件",</p>
								  <p>desc: "请上传文件",</p>
								  <p>uploading: '上传中...',</p>
								  <p>uploadSucceed: '上传成功',</p>
								  <p>uploadFailed: '上传失败',</p>
								  <p>delete: '删除',</p>
								  <p>overMaxSize: {`{{name}} 过大`},</p>
								  <p>wrongType: {`{{name}} 的文件类型不被允许`},</p>
								  <p>unknownDocumentType: '文件类型不是已知的文档类型',</p>
								  <p>unknownImgType: '文件类型不是已知的图像类型',</p>
								  <p>unknowArchiveType: '文件类型不是已知的压缩包类型',</p>
								  <p>wrongExtType: {`{{name}} 的文件扩展名不为`},</p>
								  <p>duplicated: {`已存在与文件 {{name}} 名字与大小都相同的文件，是否仍要添加此文件？`}</p>
							  </pre>;

const model = <pre>
							  <p>idField: "id",</p>
							  <p>nameField: "name",</p>
							  <p>urlField: "url",</p>
							  <p>timeField: "attachTs",</p>
							  <p>oprField: "owner"</p>
						  </pre>;

module.exports = [
	{
		title: "Upload 接收的参数",
		desc: "通过设置 Upload 的属性来产生不同的控件样式，推荐顺序为： shape -> type -> size -> loading -> disabled",
		columns: ["属性", "说明", "类型", "默认值"],
		data: [
			["prefixCls", "设置样式前缀", "string", "mt"],
      ["mode", "设置控件状态，可选值为 default|view 或者不设", "string", "default"],
      ["multiple", "是否可多选", "boolean", "true"],
      ["droppable", "是否可拖拽", "boolean", "false"],
      ["value", "设置当前的值, 传入的值需要与 model 中声明的值匹配", "array[object]", "-"],
      ["defaultValue", "设置初始的值, 传入的值需要与 model 中声明的值匹配", "array[object]", "-"],
      ["locale", <div>本地文本配置 <a href="#locale">查看属性</a></div>, "object", locale],
      ["model", <div>设置字段名的配置 <a href="#model">查看属性</a></div>, "object", model],
      ["size", "设置控件大小，可选值为 small|default 或者不设", "string", 'default'],
      ["disabled", "设置控件禁用状态", "boolean", 'false'],
      ["required", "设置控件是否必填", "boolean", 'false'],
      ["validation", "设置校验失败时的提示", "string", '-'],
      ["validator", <div>设置自定义校验规则</div>, "function(files)", '-'],
      ["fileType", "限制上传文件的类型, 可传函数, 或可选值为 document|image|archive, 或 传`.png.jpg`等使用`.`隔开的类型声明", "function or string", '-'],
      ["fileMaxSize", "限制上传的文件大小", "string or number", 'Infinity'],
      ["uploadParams", "会被原样传给 uploadAction 的参数", "object", '-'],
      ["headersConf", "设置请求头", "object", '-'],
      ["errToast", "设置是否上传失败后立即弹窗报错而非抛出错误", "boolean", 'false'],
      ["useFormData", "设置是否用 formData 封装交互时上传的参数", "boolean", 'true'],
      ["durationIfSucceed", "上传成功的文字显示的时间", "string or number", '500'],
      ["emptyLabel", "只读状态下无数据时显示的文本", "string", '-'],
      ["onUpload", "执行上传交互的函数", "function(file,uploadParams,headersConf)", '-'],
      ["onChange", "控件值改变的 handler, 包括上传成功/删除", "function(files)", '-'],
      ["onBeforeUploadAll", "上传选择的所有文件前的校验, 可用于文件个数的控制, 返回false则终止上传, 返回报错信息则终止上传并提示报错信息", "function(files)", '-'],
      ["onBeforeUpload", "上传单个文件前的校验 返回false则终止上传, 返回报错信息则终止上传并提示报错信息", "function(file)", '-'],
      ["onError", "失败的 handler", "function(file)", '-'],
      ["onSuccess", "成功的 handler", "function(file)", '-'],
      ["onDelete", "删除的 handler, 接收返回值为true, 则删除, false 不删除", "function(file)", '-'],
      ["domProps", "设置 input 原生的属性", "object", '{}']
		]
	},
	{
		title: "locale",
		desc: "",
		columns: ["属性", "说明", "类型", "默认值"],
		data: [
			["label", "上传按钮显示的文字", "string or node", "上传文件"],
      ["desc", "默认提示文字", "string or node", "请上传文件"],
      ["uploading", "上传中显示的文字", "string or node", "上传中..."],
      ["uploadSucceed", "上传成功显示的文字", "string or node", "上传成功"],
      ["uploadFailed", "上传失败显示的文字", "string or node", "上传失败"],
      ["delete", "删除按钮鼠标悬浮显示的title", "string or node", "删除"],
		]
	},
	{
		title: "model",
		desc: "",
		columns: ["属性", "说明", "类型", "默认值"],
		data: [
			["idField", "值键对应的字段名", "string", "-"],
      ["nameField", "文件名对应的字段名", "string or function(file) { return string or node}", "-"],
      ["urlField", "文件链接对应的字段名", "string", "-"],
      ["timeField", "上传时间对应的字段名", "string or function(file) { return string or node}", "-"],
      ["oprField", "上传人对应的字段名", "string or function(file) { return string or node}", "-"],
		]
	},
	{
		title: "Upload 提供的方法",
		desc: "",
		columns: ["方法", "方法说明", "参数说明", "返回值类型 | 返回值说明"],
		data: [
			["validate()", "校验控件的有效性", "-", "boolean型, 控件是否校验通过"],
      ["reset()", "重置,如果设置过默认的值得话,回到默认值的状态", "-", "-"],
      ["clear()", "清空异常状态,校验提示等", "-", "-"],
      ["getAllFiles()", "获取控件中已上传成功的有效的文件", "-", "-"],
		]
	}
];