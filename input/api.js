import React from 'react';
const validator = `{
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
      "pattern": "^[\\\\s\\\\S]{0,20}$",
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
      "pattern": "^[\\\\s\\\\S]{0,20}$",
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
}`, autozize = `
autosize = true;
autozie = {
  minRows: 3,
  maxRows: 6
}
`;
module.exports = [
    {
        title: "Input 接收的参数",
        desc: "通过设置 Input 的属性来产生不同的控件样式，推荐顺序为： type -> size -> disabled",
        columns: ["参数", "说明", "类型", "默认值"],
        data: [
            ["prefixCls", "设置样式前缀", "string", "mt"],
            ["mode", "设置控件状态，可选值为 default|view 或者不设", "string", "default"],
            ["type", "设置控件类型，可选值为 text|number|password|textarea 或者不设", "string", "text"],
            ["value", "设置当前的值", "string", "-"],
            ["defaultValue", "设置初始的值", "string", "-"],
            ["size", "设置控件大小，可选值为 small|default 或者不设", "string", 'default'],
            ["trigger", "设置控件触发 onChange 的时机, 可选值为 onBlur|onChange", "string", 'onBlur'],
            ["placeholder", "设置默认提示", "string", '-'],
            ["disabled", "设置控件禁用状态", "boolean", 'false'],
            ["required", "设置控件是否必填", "boolean", 'false'],
            ["pattern", "设置正则校验", "string or RegExp", '-'],
            ["validation", "设置校验失败时的提示", "string", '-'],
            ["validator", <div>设置自定义校验规则 <a href="#validator">查看属性</a> 举个栗子: <pre>{validator}</pre> </div>, "object", '{}'],
            ["addonBefore", "在输入框前面添加的标签", "node or function(value) or ReactClass", '-'],
            ["addonAfter", "在输入框后面添加的标签", "node or function(value) or ReactClass", '-'],
            ["clearIcon", "当前值不为空并且聚焦状态下，显示清空按钮，对 `type='textarea'` 无效", "boolean", 'true'],
            ["focusAfterClear", "清空后是否使输入框获得焦点", "boolean", 'true'],
            ["rows", "默认显示的行数, 对 `type='textarea'` 有效", "string or number", '2'],
            ["rowsIfView", "只读时收起状态下显示的行数, 可以收起展开, 配合 `showUnfold` 使用，只对 `type='textarea'` 有效", "string or number", '如果不设, 默认使用 rows'],
            ["showUnfold", "只读时是否显示展开收起, 如果设置的行数大于真实数据的行数, 则直接展开, 并不显示收起展开，只对 `type='textarea'` 有效", "boolean", 'false'],
            ["defaultUnfold", "只读时是否默认展开, 如果设置的行数大于真实数据的行数, 则直接展开, 并不显示收起展开，只对 `type='textarea'` 有效", "boolean", 'false'],
            ["showCount", "是否显示长度限制,配合'maxLength'使用,只对 `type='textarea'` 有效", "boolean", 'false'],
            ["maxLength", "最大长度，不会截断文本，但会在校验出错时报错", "string or number", 'Infinity'],
            ["numberToEn", "是否只读时插入千分符，只对 `type='number'` 且只读时有效", "boolean", 'false'],
            ["toFixed", "精确到小数点后几位，只对 `type='number'` 有效", "string or number or function(value) { return newValue }", '0'],
            ["overLengthValidation", "与'maxLength'配合使用,超过最大字符时的提示", "string", '超过最大字符数'],
            ["cutIfOverLength", "与'maxLength'配合使用,是否截断超过最大字符后的输入", "boolean", 'false'],
            ["cutIfDisMatchPattern", "与'pattern'配合使用,是否截断不符合校验的字符", "boolean", 'false'],
            ["autosize", <div>自适应内容高度，只对 `type='textarea'` 有效, 可以是对象 <a href="#autosize">查看属性</a> 举个栗子: <pre>{autozize}</pre></div>, "boolean or object", 'false'],
            ["emptyLabel", "mode 为 view 而 value 无值时, 显示的文本", "string", '-'],
            ["onChange", "控件值改变的 handler", "function(value,e)", '-'],
            ["onFocus", "输入框获得焦点的 handler", "function(e)", '-'],
            ["onBlur", "输入框失去焦点的 handler", "function(e)", '-'],
            ["onClear", "点击清空按钮去清空当前值时的 handler", "function(e)", '-'],
            ["domProps", "设置 Input 原生的属性", "object", '{}'],
        ]
    },
    {
        title:"validator",
        desc:"",
        columns: ["参数", "说明", "类型", "默认值"],
        data:[
            ["onBlur", <div>设置在输入框失去焦点时的校验规则, 如果当前校验通过了, 那么记忆上一次 onChange 时校验的结果 <a href="#validatorProp">查看属性</a>
            </div>, "object", "-"],
            ["onChange", <div>设置在输入框的值改变时的校验规则 <a href="#validatorProp">查看属性</a></div>, "object", "-"]
        ]
    },
    {
        title:"validatorProp",
        desc:"",
        columns: ["参数", "说明", "类型", "默认值"],
        data:[
            ["required", "设置是否必填", "boolean", "-"],
            ["whitespace", "设置不能全输入空字符", "boolean", "-"],
            ["pattern", "设置校验规则", "string or RegExp", "-"],
            ["maxLength", "设置最长字符限制", "string or number", "-"],
            ["validator", "设置自定义的校验规则", "function(value)", "-"],
            ["message", "当校验不通过时, 提示的文案", "string", "-"],
        ]
    },
    {
        title: "autosize",
        desc: "",
        columns: ["参数", "说明", "类型", "默认值"],
        data:[
            ["minRows", "设置最低行数", "string or number", "-"],
            ["maxRows", "设置最高行数", "string or number", "-"]
        ]
    },
    {
        title: "Input 提供的方法",
        desc: "",
        columns: ["方法名", "说明", "参数", "返回值类型|返回值说明"],
        data:[
            ["validate(type)", "校验控件", "type, 可选值为 onBlur|onChange 或者不传, 会通过 type 去校验相应的 validator 中声明的规则", "boolean型, 控件是否校验通过"],
            ["doValidate(type, rules)", "校验控件", "type, 可选值为 onBlur|onChange; rules, 需要校验的规则数组. 如果传入的是onBlur, 当前校验通过后去记忆上次 onChange 的校验结果", "-"],
            ["reset()", "重置,如果设置过默认的值得话,回到默认值的状态", "-", "-"],
            ["clear()", "清空异常状态,校验提示等", "-", "-"],
            ["resizeTextarea()", "重新计算 textarea 的高度, 只对 `textarea` 有效", "-", "-"],
            ["focus()", "使输入框获得焦点", "-", "-"],
            ["blur()", "使输入框失去焦点", "-", "-"],
        ]
    },
    {
        title: "Input.Group API",
        desc: "",
        columns: ["参数", "说明", "类型", "默认值"],
        data:[
            ["prefixCls", "设置样式前缀", "string", "mt"],
            ["className", "设置className", "string", "-"],
            ["size", "Input.Group 中所有的 Input 的大小，可选值为 small|default 或者不设", "string", "default"],
            ["style", "设置 div 标签的内联样式", "object", "{}"],
            ["domProps", "设置 div 标签原生的属性", "object", "{}"]
        ]
    }
];