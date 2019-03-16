import React from 'react';
const model = `{
  "code":"bill",
  "idField":"id",
  "column":2,
  "alignment":"right",
  "forms":[
    {
      "code": "baseInfo",
      "label": "基本信息",
      "fields":[
        {
          "code":"id",
          "label":"ID",
          "type":"text",
          "show":false,
          "conf":{
            "disabled":true,
            "mode":"view",
          }
        },
        {
          "code":"name",
          "label":"用户名",
          "show":true,
          "type":"text",
          "conf":{
              "pattern":"^[0-9a-zA-Z_]{1,30}$",
              "required":true,
              "placeholder":"只能是5位以上的数字字母",
              "validation":"不能为空，只能使用5-30个下划线、字母和数字"
          }
        },
        {
          "code":"nick",
          "label":"昵称",
          "type":"text",
          "show":true,
          "showHeader":true,
          "alignment":"right",
          "conf":{
            "trigger":"onBlur",
            "disabled":false,
            "mode":"default",
            "placeholder":"请输入8个字符以内的昵称",
            "maxLength": "8",
            "overLengthValidation": "最多只能输入8个字符",
            "validator":{
              "onBlur":[
                {"required":true,"whitespace":true,"message":"必填项必须输入"},
                {"pattern":"^[a-zA-Z1-9_]{1,8}$","message":"特殊字符不认识哦"}
              ],
              "onChange":[
                {"validator":true}
              ]
            }
          },
          "onFocus": (bill,value,e)=>{
            console.log("这里去处理相关的逻辑");
          }
        },
        {
          "code":"address",
          "label":"地址",
          "type":"autoText",
          "conf":{
            "placeholder":"输入地址"
          }
        }
      ]
    }
  ],
  "events":[
    {
      "code":"address",
      "type":"bind",
      "params":["name"],
      "noClear": true,
      "url":"/service/dataset/address"
    },
    {
      "code":"address",
      "type":"fetch",
      "params":[],
      "fields": ["name"],
      "url":"/service/fetch/address"
    }
  ]
}`;
let conf = `{
              emptyLabel:"-",
              domProps:{...}
           }`;
let confInput = `{
              trigger:'onChange',
              clearIcon:false,
              focusAfterClear:true,
              showCount:3,
              maxLength:300,
              validator:function(bill,value){...},
              overLengthValidation:'最多只能输入300字',
              cutIfOverLength:false
           }`;
let uploadDefault = `[{
    {'$idField:1'},
    {'$nameField:"附件"'},
    {'$urlField:"http//.."'}
},...]`;
const fieldType = <pre>
  <p><a href="/input" target="_blank">text</a></p>
  <p><a href="/input" target="_blank">number</a></p>
  <p><a href="/input" target="_blank">password</a></p>
  <p><a href="/input" target="_blank">textarea</a></p>
  <p><a href="/date-picker" target="_blank">time</a></p>
  <p><a href="/date-picker" target="_blank">date</a></p>
  <p><a href="/date-picker" target="_blank">rangeDate</a></p>
  <p><a href="/select" target="_blank">autoText</a></p>
  <p><a href="/select" target="_blank">select</a></p>
  <p><a href="/select" target="_blank">multiSelect</a></p>
  <p><a href="/tree-select" target="_blank">treeSelect</a></p>
  <p><a href="/tree-select" target="_blank">treeMultiSelect</a></p>
  <p><a href="/radio" target="_blank">radio</a></p>
  <p><a href="/checkbox" target="_blank">checkbox</a></p>
  <p><a href="/upload" target="_blank">upload</a></p>
  <p>custom</p>
</pre>;
const eventType = <pre className="inline" style={{"whiteSpace":"pre-wrap"}}>
  <p>bind: select/multiSelect/treeSelect/treeMultiSelect 来获取下拉数据的请求事件, 被 field 中的 onBind 事件覆盖</p>
  <p>bindNode: treeSelect/treeMultiSelect 来获取子节点数据的请求事件, 会被 field 中的 onBindNode 事件覆盖</p>
  <p>fetch: 当组件的值改变时去请求后端的数据来更新当前表单的值, 可以使用 fields 来指定更新哪些字段, 会被 field 中的 onFetch 事件覆盖</p>
  <p>control: 当组件的值改变时, 根据 event 中的 process 去控制某些字段的 ['show', 'hide', 'editable', 'disable', 'view', 'require',
    'option'], 会被 field 中的 onControl 事件覆盖</p>
  <p>upload: upload 来上传附件时的交互事件的配置, 会被 field 中的 onUpload 事件覆盖</p>
</pre>;
module.exports = [
  {
    title: "Bill",
    desc: "表单支持的属性",
    columns: ["参数", "说明", "类型", "默认值"],
    widths: [140, , 260, 80],
    data: [
      ["prefixCls", "设置样式前缀", "string", "mt"],
      ["mode", "设置Bill的状态", "string", 'default'],
      ["size", "设置Bill中所有空间的大小, 可选值为 default|small", "string", 'default'],
      ["model", <div>设置Bill的显示模板, 只接受一次, 后续请用setModel修改 <a href="#model">查看属性</a> <br/>举个栗子:
        <pre>{model}</pre>
      </div>, "object", '-'],
      ["initModel", "设置Bill的初始显示模板", "object", '-'],
      ["data", "设置Bill的显示数据, 只接受一次, 后续请用setData修改", "object", '-'],
      ["initData", "设置Bill的初始显示数据", "object", '-'],
      ["notice", "设置Bill中有值改变时是否要通知出去", "boolean", 'true'],
      ["onFieldChange", "设置Bill中有值改变时", "function(code,value,bill)", '-'],
      ["parent", "设置Bill的父组件, 在events事件中用以params的{parentCode}.{fieldCode}表示法来获取, parentCode又是由model中的code来设置的", "reactElement", '-']
    ]
  },
  {
    title: "model",
    desc: "bill的配置文件model的属性列表",
    columns: ["参数", "说明", "类型", "默认值"],
    data: [
      ["code", "设置Bill的标识,", "string", "-"],
      ["idField", "设置Bill当前的主键", "string", "-"],
      ["column", "设置Bill每行显示的列数", "string or number", "2"],
      ["forms", <div>设置显示的模板, 是多个 Object 组成的数组, <a href="#form">查看form支持的属性</a></div>, "array[Object]", "-"],
      ["events", <div>申明事件, 是多个 Object 组成的数组, <a href="#events">查看event支持的属性</a></div>, "array[Object]", "-"],
    ]
  },
  {
    title: "form",
    desc: "model中单个form的具体配置",
    columns: ["参数", "说明", "类型", "默认值"],
    data: [
      ["code", "模块的标识", "string", "-"],
      ["label", "模块的说明", "string or jsx or function({bill, model, index}) or ReactClass", "-"],
      ["hideIfNoFieldVisible", "配置是否在模块中的 fields 为空或者都不显示时隐藏该模块", "boolean", "false"],
      ["fields", <div>模块内包含的控件集合, <a href="#field">查看field支持的属性</a></div>, "array[Object]", "-"]
    ]
  },
  {
    title: "field",
    desc: "form中单个字段的具体配置",
    columns: ["参数", "说明", "类型", "默认值"],
    widths: [140, , 260, 60],
    data: [
      ["code", "必须设置, 控件的标识", "string", "-"],
      ["label", "控件的说明", "string or jsx or function({bill, model, value, index}) or ReactClass", "-"],
      ["type", <div>
        必须设置,控件的类型, 支持的类型有:
        <br/>
        {fieldType}
      </div>, "string", <em>list/multiList/treeList/treeMultiList 类型值建议改为 <br />
        select/multiSelect/treeSelect/treeMultiSelect</em>],
      ["show", "控件是否可见", "boolean", "true"],
      ["full", "控件是否撑满一行", "boolean", "false"],
      ["alignment", "说明文字的对齐方式, 可选值为 left|right|top", "string", "right"],
      ["showHeader", "是否显示说明文字", "boolean", "true"],
      ["showCode", "控件显示字段的键, 只对 `select|treeSelect` 有效", "string", "-"],
      ["addonBefore", "显示的前缀", "string or jsx or function({bill, model, value, index}) or ReactClass", "-"],
      ["addonAfter", "显示的后缀", "string or jsx or function({bill, model, value, index}) or ReactClass", "-"],
      ["idsOnlyToServer", "控制 getData 方法对该字段传出主键的数组, 对 `multiSelect/treeMultiSelect` 有效", "boolean", "false"],
      ["objToServer", "控制 getData 方法对该字段传出数据对象, 对 `select/treeSelect` 有效", "boolean", "false"],
      ["conf", <div>field还提供一些高级配置<a href="#field.conf">查看高级配置</a></div>, "object", "-"],
      ["Component", "自定义显示的控件, 只对 `custom` 类型的控件有效", "node or ReactClass", "-"],
      ["onChange", <div>
        当控件的值改变时的回调, 覆盖掉 Bill 监听字段改变时的所有处理, <br />
        onFieldChange 是 Bill 接收的 onFieldChange 属性, <br />
        doAction 指定走Bill内部处理数据变化的逻辑(字段值的改变,control/级联等事件的处理,调用onFieldChange) <br/>
        e.g:<br />
        c.onChange: function (value, bill, onFieldChange, doAction) {`{`} <br />
          ...doSth speical <br />
          doAction(); c 的值变化后, 调用doAction去更新Bill 中 c 的数据, 并执行 control/级联等, 也会调用 onFieldChange; <br />
          或者 {`doAction({a: 1, b: 2})`}; 除了做上述事情(即更新 c 的数据)之外,还去更新 a, b 的数据;<br />
        {`}`}<br />
      </div>, "function(value,bill,onFieldChange,doAction)", ""],
      ["onBind", "当 select/treeSelect/multiSelect/treeMultiSelect/autoText 中要去获取下拉数据的回调, 会覆盖掉 events 中给该字段声明的 bind 内置事件", "function(bill,code,filter,callback,errCallback)", ""],
      ["onBindNode", "当 treeSelect/treeMultiSelect 中父节点要去获取子数据时的回调, 会覆盖掉 events 中给该字段声明的 bindNode 内置事件", "function(bill,code,node,callback)", ""],
      ["onFetch", "当控件的值改变时的回调, 会覆盖掉 events 中给该字段声明的 control 内置事件", "function(bill,code,value,callback)", ""],
      ["onControl", "当控件的值改变时的回调, 会覆盖掉 events 中给该字段声明的 control 内置事件", "function(bill,code,value)", ""],
      ["其它方法", <div>不同的控件支持的事件是不一样的 <a href="#field.method">查看支持的事件</a></div>]
    ]
  },
  {
    title: "field.model",
    desc: "对应字段中的model配置",
    columns: ["type", "示例"],
    data: [
      ["autoText", ""],
      ["select、multiSelect", ""],
      ["treeSelect、treeMultiSelect", ""],
      ["upload", ""]
    ]
  },
  {
    title: "field.conf",
    desc: "对应字段中的高级设置",
    columns: ["type", "说明", "示例"],
    data: [
      ["公共的", <div>prefixCls(string: 组件的样式前缀, 默认'mt'), <br/>
        defaultValue, 控件的默认值, 不同的控件支持的默认值类型不一样 <a href="#field.defaultValue">查看默认值</a><br/>
        emptyLabel(string: 组件无值的情况下只读时显示的文本, 默认''), <br/>,
        domProps(obj: 原声组件的props')</div>, <pre>{conf}</pre>],
      [<span>
                text|password<br/>
                |number|textarea
            </span>, <span>
                'trigger', <br/>
                'clearIcon',<br/>
                'focusAfterClear',<br/>
                'showCount',<br/>
                'maxLength',<br/>
                'validator(bill,value)',<br/>
                'overLengthValidation',<br/>
                'cutIfOverLength',<br/>
                'domProps'<br/>
                <a href="/input#Api" target="_blank">参考input api</a>
                </span>, <pre>{confInput}</pre>],
      ["time", <span>
                'format', <br/>
                'disabledHours':function(bill){}<br/>
                'disabledMinutes':function(bill){}<br/>
                'disabledSeconds':function(bill){}<br/>
                'hideDisabledOptions', <br/>
                <a href="/date-picker#Api" target="_blank">参考date api</a><br/></span>,
        <span>
                format:"%H:%M"<br/>
                hideDisabledOptions:false</span>],
      ["date|rangeDate", <span>
                'format', <br/>
                'disabledDate:function(bill,ts){}', <br/>
                'showUpToNow', <br/>
                <a href="/date-picker#Api" target="_blank">参考date api</a><br/></span>,
        <span>
                format:"%Y-%m-%d"<br/>
                showUpToNow:false</span>],
      ["autoText", <span>
                'trigger', <br/>
                'clearIcon', <br/>
                'validator',<br/>
                'notFoundContent',<br/>
                'noSearchIfNoKeyword',<br/>
                'defaultActiveFirstOption',<br/>
                'delay',<br/>
                <a href="/select#Api" target="_blank">参考select api</a>
                </span>, "-"],
      ["select|treeSelect", <span>
                'clearIcon', <br/>
                'notFoundContent',<br/>
                'noSearchIfNoKeyword',<br/>
                'defaultActiveFirstOption',<br/>
                'delay',<br/>
                <a href="/select#Api" target="_blank">参考select api</a>
                <br/>
                <a href="/treeSelect#Api" target="_blank">参考treeSelect api</a>
                </span>, "-"],
      ["multiSelect|treeMultiSelect", <span>
                'clearIcon',<br/>
                'notFoundContent',<br/>
                'noSearchIfNoKeyword',<br/>
                'defaultActiveFirstOption',<br/>
                'delay',<br/>
                'checkbox',<br/>
                'allCheck',<br/>
                <a href="/select#Api" target="_blank">参考select api</a>
                <br/>
                <a href="/treeSelect#Api" target="_blank">参考treeSelect api</a>
                </span>, "-"],
      ["checkbox", <span>
                'name', <br/>
                'showCheckall', <br/>
                <a href="/checkbox#Api" target="_blank">参考checkbox api</a>
                </span>, "-"],
      ["radio", <span>
                'name', <br/>
                <a href="/radio#Api" target="_blank">参考radio api</a>
                </span>, "-"],
      ["upload", <span>
                'locale',<br/>
                'multiple',<br/>
                'droppable',<br/>
                'fileType',<br/>
                'fileMaxSize',<br/>
                'uploadParams',<br/>
                'headersConf',<br/>
                'useFormData',<br/>
                'durationIfSucceed',<br/>
                <a href="/upload#Api" target="_blank">参考upload api</a>
                </span>, "-"],
    ]
  },
  {
    title: "field.method",
    desc: "字段不同类型可用的方法",
    columns: ["type", "方法"],
    data: [
      ["text|password|number|textarea", <span>
                onFocus(bill, e)<br/>
                onBlur(bill, e)<br/>
                onClear(bill, e)<br/>
                onFetch(bill,code,value,callback)<br/>
                onControl(bill,code,value)<br/></span>],
      ["autoText|select|multiSelect", <span>
                onFocus(bill, e)<br/>
                onBlur(bill, e)<br/>
                onClear(bill, e)<br/>
                onSelect(bill, option, e)<br/>
                onKeyDown(bill, e, activeItem)<br/>
                onBind(bill,code,filter,callback)<br/>
                onFetch(bill,code,value,callback)<br/>
                onControl(bill,code,value)<br/></span>],
      ["treeSelect|treeMultiSelect", <span>
                onFocus(bill, e)<br/>
                onBlur(bill, e)<br/>
                onClear(bill, e)<br/>
                onSelect(bill, option, e)<br/>
                onKeyDown(bill, e, activeItem)<br/>
                onBind(bill,code,filter,callback)<br/>
                onBindNode(bill,code,node,callback)<br/>
                onFetch(bill,code,value,callback)<br/>
                onControl(bill,code,value)<br/></span>],
      ["upload", <span>
                onBeforeUpload(bill,file)<br/>
                onBeforeUploadAll(bill,files)<br/>
                onError(bill,file,response)<br/>
                onSuccess(bill,file,response)<br/>
                onUpload(bill,code,file,uploadParams,headersConf)<br/></span>]
    ]
  },
  {
    title: "field.defaultValue",
    desc: "不同类型字段的默认值,select的key和value对应其model中配置的idField和showField",
    columns: ["type", "类型", "示例"],
    data: [
      ["text|password|number|textarea", "String", "-"],
      ["autoText", "string", "abc"],
      ["time", "string", "11:00"],
      ["date", "int|string", "1484904327575"],
      ["rangeDate", "Array", "[1484904327575,1487904237575]"],
      ["select|treeSelect", "Object", "{key:'12',value:'企业平台'}"],
      ["multiSelect|treeMultiSelect", "Object", "[{key:'12',value:'企业平台'},...]"],
      ["checkbox", "Array", "[1,2]"],
      ["radio", "string", "Y"],
      ["upload", "Array", <pre>{uploadDefault}</pre>],
    ]
  },
  {
    title: "events",
    desc: "bill中字段交互间的事件配置",
    columns: ["参数", "说明", "类型", "默认值"],
    widths: [60, 400, 160, 60],
    data: [
      ["code", "需要绑定事件的控件标识", "string", "-"],
      ["type", <div>
        事件的类型及说明:
        <br/>
        {eventType}
      </div>, "string", "-"],
      ["params", "与服务器进行交互时传递的参数除了当前字段外, 还有params中指定的字段, 对 `control` 事件无效", "array[${code} or {`mapCode`: ${code}}]", "-"],
      ["url", "与服务器进行交互时的请求路径, 对 `control` 无效", "string", "-"],
      ["filterField", "与服务器进行交互时的传递的搜索条件, 只对 `bind` `fetch` 有效", "string", "filter"],
      ["process", <div>字段值改变时控制某些字段的状态, 值对 `control` 有效 <a href="#events.control">查看属性</a></div>, "array[Object]", "-"],
      ["noClear", "bind 事件去获取下拉数据时发送 params 里指定的参数, 当 params 里指定的任一参数值变化时, 默认会将当前控件的值清空, 此属性来控制是否不清空, 只对 `bind` 事件有效", "boolean", "false"],
      ["fields", "当前 code 标识的字段值改变时, 指定去触发哪几个字段的改变, 只对 `fetch` 事件有效", "array[${code} or {`mapCode`: ${code}}]", "-"]
    ]
  },
  {
    title: "events.control",
    desc: "events中control支持控制的类型",
    columns: ["参数", "说明", "类型", "默认值"],
    data: [
      ["condition", "匹配这条规则需要满足的条件", "string", "-"],
      ["show", "满足条件后控制哪些字段显示", "array[${code}]", "-"],
      ["hide", "满足条件后控制哪些字段隐藏", "array[${code}]", "-"],
      ["editable", "满足条件后控制哪些字段可编辑", "array[${code}]", "-"],
      ["disable", "满足条件后控制哪些字段禁用", "array[${code}]", "-"],
      ["view", "满足条件后控制哪些字段只读", "array[${code}]", "-"],
      ["require", "满足条件后控制哪些字段必填", "array[${code}]", "-"],
      ["option", "满足条件后控制哪些字段不必填", "array[${code}]", "-"]
    ]
  },
  {
    title: "method",
    desc: "bill对外提供的方法",
    columns: ["方法", "方法说明", "参数类型 | 参数说明", "返回值类型 | 返回值说明"],
    data: [
      ["getModel()", "获取Bill当前的模板", "-", "model[Object]: 当前的模板"],
      ["setModel(model, callback)", "更新Bill的model", "model[Object]: 要更新的model; callback[function]: 更新完成后的回调", "-"],
      ["setFieldModel(code, model)", "更新某一个field的model", "code[string]: 要更新的field的code值; model[object]: 更新的model", "-"],
      ["getFieldModel(code)", "获得某一个field的model", "code[string]: 要获取的field的code值", "model[Object]: code对应的model"],
      ["setData(data, callback)", "更新Bill的整体的data", "data[Object]: 要更新的data; callback[function]: 更新完成后的回调", '-'],
      ["setFieldsData(data, callback, notNowUpdate)", "更新Bill某个或者某些字段的值", "data[Object]: 要更新的data; callback[function]: 更新完成后的回调; notNowUpdate: 是否现在不立即渲染", '-'],
      ["getData()", "获取Bill当前的数据(以传给后端的格式)", "-", "data[Object]: 当前的数据"],
      ["getField(code)", "获取指定的element", "code[string]: 要获得的element的code", "element[ReactElement]: code对应的控件的引用"],
      ["getIdField()", "获取Bill当前的主键, 即model中定义的idField", "-", "idField[string]: 当前的主键"],
      ["validate()", "校验单据", "-", "valid[Boolean]: 是否校验成功"],
      ["clear()", "清空单据,把能操作的单据数据和状态都清除掉", "-", "-"],
      ["reset()", "把数据还原成默认值,把其他状态都清除掉", "-", "-"],
      ["doFieldValidate(code)", "单独校验某个字段", "-", "valid[Boolean]: 是否校验成功"],
      ["doControl(control)", "按照control的规则来控制某些字段", "control[Object]: 控制的规则, 格式为:{show: ['${code1}',...], hide: [], editable: [], disable: [], view: [], require: [], optional: []}", "-"]
    ]
  }
];
