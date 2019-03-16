import React, { Component } from 'react';
const checkboxModel = `[
  {"label": "1人", value: 1},
  {"label": "2人", value: 2},
  {"label": "3人", value: 3}
]`;

let model = [
  {
    title: "DatePicker的props",
    desc: "日期选择组件支持的属性",
    columns: ["参数", "说明", "类型", "默认值"],
    data: [
      ["prefixCls", "设置样式前缀", "string", "mt"],
      ["value", "组件的当前值，时间戳", "number", "-"],
      ["defaultValue", "组件的初始值，时间戳", "number", "-"],
      ["mode", "设置组件的状态，可选值为 default|view 或者不设", "string", "default"],
      ["placeholder", "指定组件无值时的显示内容", "string", "-"],
      ["format", "日期的显示格式，支持 '%Y-%m'|'%Y-%m-%d'|'%Y-%m-%d %H:%M'|'%Y-%m-%d %H:%M:%S'，基于 strftime ，分隔符不限", "string", "%Y-%m-%d"],
      ["size", "设置日期组件大小，可选值为 default|small 或者不设", "string", 'default'],
      ["disabled", "设置禁用状态", "boolean", "false"],
      ["required", "设置是否必填", "boolean", "false"],
      ["emptyLabel", "设置当前值为空时显示的文本，只在 mode 为 view 的情况下有效", "string", "-"],
      ["clearIcon", "是否在有值时显示清除按钮", "bool", "true"],
      ["validator", "设置校验规则", "function(value)", "-"],
      ["validation", "设置必填校验不通过时的提示文字", "string", "-"],
      ["disabledDate", "设置某些日期是否可选，对于月份选择来说 ts 是当月1日的0点", "function(ts)", "-"],
      ["onChange", "组件选择的内容改变时的回调函数", "function(value)", "-"],
      ["getPopupContainer", "弹出面板所属父级 dom 元素", "function()", "() => document.body"],
      ["onFocus", "单击聚焦时的回调函数，默认为单击输入框出现日历下拉时", "function()", "-"],
      ["onBlur", "单击输入框之外时的回调函数，包括选中、单击外部等收起日历下拉时", "function()", "-"],
      ["trigger", "触发onChange的时机，只对带时间的日历有效", "string", "onSelect"],
    ],
  },
  {
    title: "TimePicker的props",
    desc: "时间选择组件支持的属性",
    columns: ["参数", "说明", "类型", "默认值"],
    data: [
      ["prefixCls", "设置样式前缀", "string", "mt"],
      ["value", "组件的当前值，例如'11:00'", "string", "-"],
      ["defaultValue", "组件的初始值", "string", "-"],
      ["mode", "设置组件的状态，可选值为 default|view 或者不设", "string", "default"],
      ["placeholder", "指定组件无值时的显示内容", "string", "-"],
      ["format", "时间的显示格式，支持 '%H:%M'|'%H:%M:%S'，基于 strftime", "string", "%H:%M"],
      ["disabled", "设置禁用状态", "boolean", 'false'],
      ["required", "设置是否必填", "boolean", "false"],
      ["emptyLabel", "设置当前值为空时显示的文本，只在 mode 为 view 的情况下有效", "string", "-"],
      ["clearIcon", "是否在有值时显示清除按钮", "bool", 'true'],
      ["validator", "设置校验规则", "function(value)", "-"],
      ["validation", "设置必填校验不通过时的提示文字", "string", "-"],
      ["disabledHours", "设置某些小时是否可选，函数返回值为禁用的 时 数组", "function()", '-'],
      ["disabledMinutes", "设置某些分钟是否可选，函数返回值为禁用的 分 数组", "function(hour)", '-'],
      ["disabledSeconds", "设置某些秒是否可选，函数返回值为禁用的 秒 数组", "function(hour, minute)", '-'],
      ["hideDisabledOptions", "设置是否隐藏禁用的选项", "bool", 'false'],
      ["onChange", "组件选择的内容改变时的回调函数", "function(value)", '-'],
      ["getPopupContainer", "弹出面板所属父级 dom 元素", "function()", '() => document.body'],
      ["onFocus", "单击聚焦时的回调函数，默认为单击输入框出现时间下拉时", "function()", "-"],
      ["onBlur", "单击输入框之外的回调函数，默认为单击外部收起时间下拉时时", "function()", "-"],
    ],
  },
  {
    title: "RangePicker的props",
    desc: "日期时间选择组件支持的属性",
    columns: ["参数", "说明", "类型", "默认值"],
    data: [
      ["prefixCls", "设置样式前缀", "string", "mt"],
      ["value", "组件的当前值，形式为[开始时间戳, 结束时间戳, 是否选中至今]", "array", "[undefined, undefined, false]"],
      ["defaultValue", "组件的初始值，形式为[开始时间戳, 结束时间戳, 是否选中至今]", "array", "-"],
      ["mode", "设置组件的状态，可选值为 default|view 或者不设", "string", "default"],
      ["placeholder", "指定组件无值时的显示内容，形式为[开始时间的placeholder, 结束时间的placeholder]", "array", "['', '']"],
      ["format", "日期时间段的显示格式，同 DatePicker，支持 '%Y-%m'|'%Y-%m-%d'|'%Y-%m-%d %H:%M'|'%Y-%m-%d %H:%M:%S'", "string", "%Y-%m-%d"],
      ["size", "设置组件大小，可选值为 default|small 或者不设", "string", 'default'],
      ["disabled", "设置禁用状态", "boolean", 'false'],
      ["required", "设置是否必填", "boolean", "false"],
      ["showUpToNow", "设置是否显示至今", "boolean", "false"],
      ["emptyLabel", "设置当前值为空时显示的文本，只在 mode 为 view 的情况下有效", "string", "-"],
      ["clearIcon", "是否在有值时显示清除按钮", "bool", 'true'],
      ["validator", "设置校验规则", "function(value)", "-"],
      ["validation", "设置必填校验不通过时的提示文字，形式为[开始时间的validation, 结束时间的validation]", "string", "['', '']"],
      ["disabledTime", "设置某些日期是否可选。对于月份选择来说，开始时间是当月1日的0点，结束时间是当月最后一天的23:59:59",
        "function([startTs, endTs, isUpToNow], 'start'|'end')", '-'],
      ["onChange", "组件选择的内容改变时的回调函数", "function(value)", '-'],
      ["getPopupContainer", "弹出面板所属父级 dom 元素", "function()", '() => document.body'],
    ],
  },
  {
    title: "DatePicker，TimePicker，RangePicker的method",
    desc: "日期选择组件、时间选择器、日期时间段选择组件对外提供的方法",
    columns: ["方法名", "方法说明", "参数", "返回值类型 | 返回值说明"],
    data: [
      ["validate()", "校验，外部校验时触发预设校验，如必填或设置过 validator 属性等", "-", "bool|当前值是否有效"],
      ["reset()", "重置，如果设置过默认值，则回到默认值的状态", "-", "-"],
      ["clear()", "清空异常状态，校验提示等", "-", "-"],
    ],
  },
  {
    title: "DateCalendar的props",
    desc: "日期面板支持的属性",
    columns: ["参数", "说明", "类型", "默认值"],
    data: [
      ["prefixCls", "设置样式前缀", "string", "mt"],
      ["value", "组件的当前值，时间戳", "number", "-"],
      ["showToday", "是否显示今天", "bool", "true"],
      ["disabledDate", "设置某些日期是否可选", "function(ts)", '-'],
      ["onSelect", "选中日期时的回调函数", "function(value)", '-'],
    ]
  },
  {
    title: "MonthCalendar的props",
    desc: "月份面板支持的属性",
    columns: ["参数", "说明", "类型", "默认值"],
    data: [
      ["prefixCls", "设置样式前缀", "string", "mt"],
      ["value", "组件的当前值，时间戳，表示当月1日0点", "number", "-"],
      ["disabledDate", "设置某些月份是否可选", "function(ts)", '-'],
      ["onSelect", "选中月份时的回调函数", "function(value)", '-'],
    ]
  },
  {
    title: "DateTimeCalendar的props",
    desc: "日期时间面板支持的属性",
    columns: ["参数", "说明", "类型", "默认值"],
    data: [
      ["prefixCls", "设置样式前缀", "string", "mt"],
      ["value", "组件的当前值，时间戳", "number", "-"],
      ["format", "日期时间格式，只支持'%Y-%m-%d %H:%M'|'%Y-%m-%d %H:%M:%S'", "string", "%Y-%m-%d %H:%M"],
      ["showNow", "是否显示【当前时间】按钮", "bool", "true"],
      ["disabledDate", "设置某些日期是否可选", "function(ts)", '-'],
      ["onSelect", "选中日期或时间时的回调函数", "function(value)", '-'],
      ["onConfirm", "点击确认按钮的回调函数", "function(value)", '-'],
    ]
  }
];

export default model;
