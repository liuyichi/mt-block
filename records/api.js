import React from "react";
/**
 * records api
 */
module.exports = [
  {
    title: "Records",
    desc: "数据记录展示和操作控制，支持的属性",
    columns: ["参数", "说明", "类型", "默认值"],
    data: [
      ["model", <div>
        <p>界面显示的配置数据,包含搜索条件、操作按钮、表格相关配置, <a href="#model">查看model支持的属性</a></p>
      </div>, "Object", "-"],
      ["Console", "操作面板对象，默认操作区域不满足时可以传入自定义的操作类来重新覆盖，要求传入的是一个React Class而不是实例", "React Component", "-"],
      ["fetchData", "获取数据的方法，支持异步获取数据", "Function", "-"],
      ["prefixCls", "设置样式前缀（仅限Records.Complex）", "String", "mt"],
      ["onSearchFieldsFilter", "model.search在mode为complex且filter为true时，当搜索条件变化时的回调（仅限Records.Complex）",
        "Function(currentFieldsList, allFields)", "-"],
      ["onColumnsFilter", "model.setting存在code为heading且没有传入action时，当列表变化时的回调（仅限Records.Complex）",
        "Function(currentFieldsList, allFields)", "-"],
      ["onInitFilter", "用于初始化搜索条件，传入的方法返回条件键值对（仅限Records.Complex）", "Function()", "-"],
      ["onFilterChange", "搜索条件改变时的回调（仅限Records.Complex）", "Function()", "-"],
    ]
  },
  {
    title: "model",
    desc: "records的model配置",
    columns: ["参数", "说明", "类型", "默认值"],
    data: [
      ["idField", "设置records中数据的当前的主键字段", "String", "-"],
      ["pageSize", "列表显示数据的默认行数", "Number|String", "20"],
      ["search",
        <div>设置搜索条件的配置，直接使用的是bill可以参考<a href="/bill/#model" target="_blank">bill的model配置</a>，我们对用于search的model配置进行了简化，<a
          href="#model.search">参考search推荐版本</a></div>, "Object", "-"],
      ["console", <div>提供操作区域按钮的配置<a href="#button">查看按钮的配置</a></div>, "Object", "-"],
      ["grid",
        <div>表格的配置，具体配置完全参考table的配置<a href="/table#Api" target="_blank">查看table的配置</a>。<br />
          增加了一些可配置的属性<a href="#model.grid.filterModel">配置表头筛选filterModel</a>。当传入scroll时，固定表头如果列没有对齐，请设置列宽。
          如果字段中的show显式设置为false时表示初始时不显示。（仅限Records.Complex）</div>, "Object", "-"],
      ["setting", <div>表格列表设置，具体配置参考<a href="#model.setting">查看setting配置</a>（仅限Records.Complex）</div>, "Array[Object]", "-"]
    ]
  },
  {
    title: "model.search",
    desc: "search的简单配置，对bill的model做了部分精简，只支持一个form，因此fields被提取出与events等字段平级",
    columns: ["参数", "说明", "类型", "默认值"],
    data: [
      ["column", "一行显示几列，支持 1|2|3（仅限Records）", "Number|String", "2"],
      ["alignment", "对齐方式，支持 right|left|top（仅限Records）", "String", "right"],
      ["mode", "搜索展示模式，支持simple|complex，simple模式下字段只支持bind事件（通过events传入或者onBind函数），也可直接传入data（仅限Records.Complex）", "String", "complex"],
      ["filter", "是否支持搜索条件过滤，排序、显示或隐藏（仅限Records.Complex）", "Bool", "false"],
      ["advanced", "是否支持高级搜索（仅限Records.Complex），高级搜索如果给字段传入onChange请主动调用参数中的onFieldChange", "Bool", "false"],
      ["fields", <div>搜索条件字段<a href="/bill/#field" target="_blank">参考bill的fields配置</a>。<br />
        当mode为complex以及filter为true时，如果字段中的show显式设置为false时表示初始时不显示（仅限Records.Complex）</div>, "Array[Object]", "-"],
      ["events",
        <div>搜索条件字段的事件配置<a href="/bill/#events" target="_blank">查看bill的events配置</a>
        注意：如果使用bind+params，需要自己写onBind，获取当前搜索条件的其他字段值</div>, "Array[Object]", "-"],
    ]
  },
  {
    title: "model.search.fields",
    desc: "search中fields的部分字段说明（仅限Records.Complex）",
    columns: ["参数", "说明", "类型", "默认值"],
    data: [
      ["show", "仅对mode为complex的标准搜索区生效", "Bool", "-"],
      ["onlyShowIn", "仅对mode为complex以及filter为true生效，" +
        "可接受值为'basic'|'advanced'，分别表示字段是仅显示在表格上方的标准搜索区还是仅显示在高级搜索区，" +
        "不配置时表示都显示", "String", "-"],
    ],
  },
  {
    title: "model.console.buttons -> button",
    desc: "console中按钮的配置",
    columns: ["参数", "说明", "类型", "默认值"],
    data: [
      ["code", "按钮的code,内置了 搜索(search)和重置(reset),其它的按钮需要绑定方法", "String", "-"],
      ["label", "按钮的名字", "String", "-"],
      ["style", "对应按钮的type", "String", "default"],
      ["hideIn", "控制是否在列表的每行显示该按钮,可选择值为'row'|'main'|'undefined',row表示在行内隐藏,main是在console中隐藏,undefined表示行内和console都显示", "String", "undefined"],
      ["linkTo", "如果是链节,传入链接的url", "String", "-"],
      ["linkTarget", "如果是链接传入的链接的打开方式,可选值:'_blank'|'_self'等a标签支持的target", "String", "_self"],
      ["requireData", "数据是否需要的:意思就是是否依赖数据来控制按钮是否可用,如果设置为true,不选择数据该按钮显示不可点击状态", "Bool", "false"],
      ["action", "按钮的事件,当code值为search和reset可以不传,使用records内置的搜索和重置方法", "Function(btn, e)", "-"]
    ]
  },
  {
    title: "model.grid.columns -> filterModel",
    desc: "表头筛选的简单配置，仅限Records.Complex",
    columns: ["参数", "说明", "类型", "默认值"],
    data: [
      ["type", "筛选类型，支持 text|select|multiSelect", "String", "-"],
      ["idField", "下拉类型的主键字段", "String", "-"],
      ["showField", "下拉类型的显示字段", "String", "-"],
      ["showSearch", "是否展示搜索框", "Bool", "false"],
      ["onFetchData", "获取后端的数据的方法，如果有传入，则与filterModel同级的filters不起作用", "Function(filter)", "-"],
      ["placeholder", "搜索框的默认显示", "String", "-"]
    ],
  },
  {
    title: "model.setting",
    desc: "setting的简单配置，仅限Records.Complex",
    columns: ["参数", "说明", "类型", "默认值"],
    data: [
      ["code", "唯一主键，code为heading而不传入action时默认行为是列表设置（排序、显隐）", "String", "-"],
      ["label", "文字，未传入icon时显示", "String", "-"],
      ["icon", "显示图标，传入字符串则从默认图标库中获取，支持传入React结点", "String|Node", "-"],
      ["action", "单击行为", "Function(settingInstance,columns,settingConfig,event)", "-"]
    ],
  },
  {
    title: "methods",
    desc: "对外提供的方法",
    columns: ["方法", "方法说明", "参数类型 | 参数说明", "返回值类型 | 返回值说明"],
    data: [
      ["search()", "重新搜索数据，页码会置为第一页", "-", "-"],
      ["reset()", "重置搜索条件", "-", "-"],
      ["getFilter()", "获取当前搜索条件，仅限Records.Complex", "-", "-"]
      ["doControl(control)", "按照规则控制字段的变化", "control[Object]: 控制的规则, 格式为:{show: ['${code1}',...], hide: [], editable: [], disabled: []}", "-"],
      ["setFieldsFilter(data)", "设置搜索条件", "data: { [code]: value }", "Promise"]
    ]
  },
];