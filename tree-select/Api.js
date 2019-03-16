import React from 'react';
const value = `{
  value: "PH",
  label: "酸碱程度"
}`,
    model = `{
    idField: "mis",
    showField: "name",
    tpl: "{{name}}({{mis}})",
    height: 200
  }`,
    validator = `{
  "onBlur": [ // 失去焦点时去校验的规则
    {
      "required": true,
      "message": "required, 必须填写",
    },
    {
      "whitespace": true,
      "message": "whitespace, 不能全为空"
    },
    {
      "pattern": "^[\\s\\S]{0,20}$",
      "message": "pattern, 不能超过20个字符"
    },
    {
      "validator": function (value) {
        if (value.indexOf("a") !== -1) {
          return "validator, 不能包含a字符"
        }
      }
    }
  ],
  "onChange": [ // 输入过程中实时校验的规则
    {
      "required": true,
      "message": "required, 必须填写",
    },
    {
      "whitespace": true,
      "message": "whitespace, 不能全为空"
    },
    {
      "pattern": "^[\\s\\S]{0,20}$",
      "message": "pattern, 不能超过20个字符"
    },
    {
      "validator": function (value) {
        if (value.indexOf("a") !== -1) {
          return "validator, 不能包含a字符"
        }
      }
    }
  ]
}`;
module.exports = [
    {
        title: "TreeSelect 接收的参数",
        desc: "",
        columns: ["参数", "说明", "类型", "默认值"],
        data: [
            ["prefixCls", "设置样式前缀", "string", "mt"],
            ["mode", "设置控件状态，可选值为 default|view 或者不设", "string", "default"],
            ["multiple", "是否可多选", "boolean", "false"],
            ["value", <div>设置当前的值 <a href="#value">查看属性</a> 举个栗子: <pre>{value}</pre></div>, "object or array[object]", "-"],
            ["defaultValue", <div>设置初始的值 <a href="#value">查看属性</a> 举个栗子: <pre>{value}</pre></div>, "string", "-"],
            ["model", <div>必须设置, 设置显示的配置, 对 `combobox` 无效 <a href="#model">查看属性</a> 举个栗子: <pre>{model}</pre></div>, "object", "-"],
            ["size", "设置控件大小，可选值为 small|default 或者不设", "string", 'default'],
            ["trigger", "设置控件触发 onChange 的时机, 可选值为 onBlur|onChange, 只对 `combobox` 生效", "string", 'onBlur'],
            ["placeholder", "设置默认提示", "string", '-'],
            ["disabled", "设置控件禁用状态", "boolean", 'false'],
            ["required", "设置控件是否必填", "boolean", 'false'],
            ["pattern", "设置正则校验", "string or regexp", '-'],
            ["validation", "设置校验失败时的提示", "string", '-'],
            ["overLengthValidation", "超过最大字符限制时的提示, 只对 `combobox` 有效", "string", '-'],
            ["validator", <div>设置自定义校验规则, 对于 combobox 可以传入一个 object <a href="#validatorPropData">查看属性</a> 举个栗子:<pre>{validator}</pre></div>, "function(value) or object", '{}'],
            ["clearIcon", "当前值不为空并且聚焦状态下，显示清空按钮，对 `type='textarea'` 无效", "boolean", 'true'],
            ["maxLength", "对 `multiple` 而言是指最大可选个数, 对 `combobox` 而言是指最大字符数", "string or number", 'Infinity'],
            ["notFoundContent", "下拉列表中无数据显示的提示文字", "string", '无数据'],
            ["clearSearchwordAfterSelect", "设置是否在选中一项后清空搜索值, 只对 `multiple` 有效", "boolean", 'false'],
            ["noSearchIfNoKeyword", "设置是否在搜索关键字为空时不发搜索请求", "boolean", 'false'],
            ["defaultActiveFirstOption", "是否默认高亮第一条", "boolean", 'false'],
            ["delay", "延迟搜索", "string", '500'],
            ["allCheck", "是否显示全选框, 只对 `multiple` 有效", "boolean", 'false'],
            ["emptyLabel", "mode 为 view 而 value 无值时, 显示的文本", "string", '-'],
            ["getPopupContainer", <div>弹出框要弹出到的父节点 需要返回一个dom节点 <em>必须弹到跟随页面滚动的元素上,否则的话弹出框就不会跟随页面滚动</em></div>, "function()", '-'],
            ["onFetchData", "搜索时的请求函数", "function(searchword,callback)", '-'],
            ["onFetchNodeData", "加载树节点时的请求函数", "function(node,callback)", '-'],
            ["onChange", "控件值改变的 handler", "function(value,e)", '-'],
            ["onFocus", "输入框获得焦点的 handler", "function(value,e)", '-'],
            ["onBlur", "输入框失去焦点的 handler", "function(value,e)", '-'],
            ["onSelect", "选择一项时的 handler", "function(node,e)", '-'],
            ["onDeSelect", "取消选中时 handler, 只对 `multiple` 有效", "function(option,node,e)", '-'],
            ["onSearch", "搜索时触发的 handler", "function(searchword, e)", '-'],
            ["onClear", "点击清空按钮去清空当前值时的 handler", "function(e)", '-'],
            ["onKeyDown", "响应键盘事件的 handler", "function(value, activeItem, e)", '-'],
            ["domProps", "设置 Select 原生的属性", "object", '{}'],
        ]
    },
    {
        title:"value",
        desc:"",
        columns: ["参数", "说明", "类型", "默认值"],
        data:[
            ["label", "显示文字", "string", "-"],
            ["value", "键", "string", "-"]
        ]
    },
    {
        title:"model",
        desc:"",
        columns: ["参数", "说明", "类型", "默认值"],
        data:[
            ["idField", "值键对应的字段名", "string", "-"],
            ["parentIdField", "父节点对应的字段名", "string", "-"],
            ["leafField", "子节点对应的字段名", "string", "-"],
            ["showField", "显示键对应的字段名", "string", "-"],
            ["showTpl", "当前值的显示的配置, 可用 `{{}}` 来表达", "string", '-'],
            ["tpl", "选择项显示的配置, 可以使用 `{{}}` 来表达", "string", "-"],
            ["height", "弹窗的最大高度", "string or number", "-"],
        ]
    },
    {
        title: "validatorPropData",
        desc: "",
        columns: ["参数", "说明", "类型", "默认值"],
        data:[
            ["required", "设置是否必填", "boolean", "-"],
            ["whitespace", "设置不能全输入空字符", "boolean", "-"],
            ["pattern", "设置校验规则", "string or regexp", "-"],
            ["maxLength", "设置最长字符限制", "string or number", "-"],
            ["validator", "设置自定义的校验规则", "function(value)", "-"],
        ]
    },
    {
        title: "TreeSelect 提供的方法",
        desc: "",
        columns: ["方法名", "说明", "参数", "返回值类型|返回值说明"],
        data:[
            ["validate(type)", "校验控件", "type, 可选值为 onBlur|onChange 或者不传, 会通过 type 去校验相应的 validator 中声明的规则", "boolean型, 控件是否校验通过"],
            ["doValidate(type, rules)", "校验控件", "type, 可选值为 onBlur|onChange; rules, 需要校验的规则数组. 如果传入的是onBlur, 当前校验通过后去记忆上次 onChange 的校验结果", "-"],
            ["reset()", "重置,如果设置过默认的值得话,回到默认值的状态", "-", "-"],
            ["clear()", "清空异常状态,校验提示等", "-", "-"],
            ["clearOption()", "清空当前的可选值", "-", "-"],
            ["fillOptions(data, callback)", "填充当前的可选值", "data, 需要填充的条目数组; callback 为填充后的回调函数", "-"],
            ["focusInput()", "使输入框获得焦点", "-", "-"],
            ["blurInput()", "使输入框失去焦点", "-", "-"],
            ["hideDropdown()", "隐藏弹出框", "-", "-"],
        ]
    }
];