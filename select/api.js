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
}`, align = `{
  equalTargetWidth: false, //是否与参照物同宽
  points: ['tl', 'bl'],   //固定元素在弹出容器的位置
  offset: [0, 2],   //偏移量
  overflow: {     //浏览器窗口变动时是否显示
    adjustX: false,
    adjustY: true,  
  }
}`, codesToShowFetchError = `[400, 0, {"errorCode": ["500"]}]
指当获取下拉数据失败传回的 code 为 400 或 0, 或 errorCode 为 "500" 时显示失败的 message 信息
}`;

module.exports = [
    {
        title: "Select 接收的参数",
        desc: "通过设置 Select 的属性来产生不同的控件样式，推荐顺序为： shape -> type -> size -> loading -> disabled",
        columns: ["参数", "说明", "类型", "默认值"],
        data: [
            ["prefixCls", "设置样式前缀", "string", "mt"],
            ["triggerClassName", "直接传给 trigger 的样式名称", "string", ""],
            ["mode", "设置控件状态，可选值为 default|view 或者不设", "string", "default"],
            ["multiple", "是否可多选", "boolean", "false"],
            ["combobox", "是否可以输入", "boolean", "false"],
            ["unsearchable", "是否不支持搜索", "boolean", "false"],
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
            ["maxLength", "对 `multiple` 而言是指最大可选个数, 对 `combobox` 而言是指最大字符数", "string or number", 'Infinity'],
            ["showCount", "是否显示长度限制，只对 `combobox` 有效", "boolean", 'false'],
            ["cutIfOverLength", "是否截断超过最大字符后的输入，只对 `combobox` 有效", "boolean", 'false'],
            ["cutIfDisMatchPattern", "是否不符合校验的字符截断，只对 `combobox` 有效", "boolean", 'false'],
            ["overLengthValidation", "超过最大字符限制时的提示, 只对 `combobox` 有效", "string", '-'],
            ["validator", <div>设置自定义校验规则, 对于 combobox 可以传入一个 object <a href="#validatorProp">查看属性</a> 举个栗子:<pre>{validator}</pre></div>, "function(value) or object", '{}'],
            ["clearIcon", "当前值不为空并且聚焦状态下，显示清空按钮，对 `type='textarea'` 无效", "boolean", 'true'],
            ["selectOnlyOptionAtBeginning", "是否一开始就去获取数据, 并在只有一条时选中它，只对单选有效", "boolean", 'false'],
            ["selectFirstOptionAtBeginning", "是否一开始就去获取数据, 并选中第一条，只对单选有效", "boolean", 'false'],
            ["focusAfterClear", "清空后是否使输入框获得焦点", "boolean", 'true'],
            ["focusAfterSelect", "选择一项后是否使输入框获得焦点", "boolean", 'true'],
            ["clearSearchwordAfterSelect", "设置是否在选中一项后清空搜索值, 只对 `multiple` 有效", "boolean", 'false'],
            ["notFoundContent", "下拉列表中无数据显示的提示文字", "string", '无数据'],
            ["codesToShowFetchError", <div>
                当搜索失败时结果中在此配置中时, 弹框中显示出请求返回的 message<br/>
                举个栗子:<pre>{codesToShowFetchError}</pre>
            </div>, "array", '-'],
            ["noCache", "设置是否不缓存, 每一次展开都重新获取", "boolean", 'false'],
            ["noChangeIfDuplicated", "设置是否选择同一项时不触发 onChange", "boolean", 'true'],
            ["noSearchIfNoKeyword", "设置是否在搜索关键字为空时不发搜索请求, 并在关键字为空时不显示下拉框", "boolean", 'false'],
            ["defaultActiveFirstOption", "是否默认高亮第一条", "boolean", 'false'],
            ["delay", "延迟搜索", "string", '500'],
            ["separator", "只读时的分隔符, 只对 `multiple` 有效", "string", ','],
            ["checkbox", "是否显示选择框, 只对 `multiple` 有效", "boolean", 'true'],
            ["allCheck", "是否显示全选框, 只对 `multiple` 有效", "boolean", 'false'],
            ["emptyLabel", "mode 为 view 而 value 无值时, 显示的文本", "string", '-'],
            ["getPopupContainer", <div>弹出框要弹出到的父节点 需要返回一个dom节点 <em>必须弹到跟随页面滚动的元素上,否则的话弹出框就不会跟随页面滚动</em></div>, "function()", '默认弹出到实例化 Select 的地方'],
            ["align", "设置弹出框的定位配置", "object", <pre>{align}</pre>],
            ["onFetchData", "搜索时的请求函数", "function(searchword,callback,errorCallback)", '-'],
            ["onChange", "控件值改变的 handler", "function(value,e)", '-'],
            ["onFocus", "输入框获得焦点的 handler", "function(e)", '-'],
            ["onBlur", "输入框失去焦点的 handler", "function(e)", '-'],
            ["onSelect", "选择一项时的 handler", "function(option,e)", '-'],
            ["onDeselect", "取消选中时 handler, 只对 `multiple` 有效", "function(option,e)", '-'],
            ["onClear", "点击清空按钮去清空当前值时的 handler", "function(e)", '-'],
            ["onKeyDown", "响应键盘事件的 handler", "function(e, activeItem)", '-'],
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
            ["showField", "显示键对应的字段名", "string", "-"],
            ["format", "选择框中的数据来渲染规则", "function(option) || ReactElement", "-"],
            ["tpl", "选择项显示的配置, 可以使用 `{{}}` 来表达", "string", "-"],
            ["showTpl", "选择某一项后输入框中显示的配置, 可以使用 `{{}}` 来表达", "string", "默认显示 showField 定义的键对应的值"],
            ["height", "弹窗的最大高度", "string or number", "-"],
        ]
    },
    {
        title: "validatorProp",
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
        title: "Select 提供的方法",
        desc: "",
        columns: ["方法名", "说明", "参数", "返回值类型|返回值说明"],
        data:[
            ["validate(type)", "校验控件", "type, 可选值为 onBlur|onChange 或者不传, 会通过 type 去校验相应的 validator 中声明的规则", "boolean型, 控件是否校验通过"],
            ["doValidate(type, rules)", "校验控件", "type, 可选值为 onBlur|onChange; rules, 需要校验的规则数组. 如果传入的是onBlur, 当前校验通过后去记忆上次 onChange 的校验结果", "-"],
            ["reset()", "重置,如果设置过默认的值得话,回到默认值的状态", "-", "-"],
            ["clear()", "清空异常状态,校验提示等", "-", "-"],
            ["clearOption()", "清空当前的可选值", "-", "-"],
            ["fillOptions(data, callback)", "填充当前的可选值", "data, 需要填充的条目数组; callback 为填充后的回调函数", "-"],
            ["getOptions()", "获取当前的可选值", "", "array 型, 当前可选项"],
            ["focusInput()", "使输入框获得焦点", "-", "-"],
            ["blurInput()", "使输入框失去焦点", "-", "-"],
            ["hideDropdown()", "隐藏弹出框", "-", "-"],
            ["resizeCalc()", "某些情况下(比如异步获取数据后,出现占位的滚动条), 需要手动去计算下 multiSelect 的宽度时可调用此方法", "-", "-"],
        ]
    }
];