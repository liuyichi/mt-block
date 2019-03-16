import React from 'react';

let model = [
  {
    title: "ComplexRecords",
    desc: "数据记录展示和操作控制，扩展版Records",
    columns: ["参数", "说明", "类型", "默认值"],
    data: [
      ["prefixCls", "设置样式前缀", "String", "mt"],
      ["model",<div>
        <p>界面显示的配置数据，包含搜索条件、操作按钮、表格等相关配置，<a href="#model">查看model支持的属性</a></p>
      </div>,"Object","-"],
      ["onSearchFieldsFilter", "model.search在mode为complex且filter为true时，当搜索条件变化时的回调",
        "Function(currentFieldsList,allFields)", "-"],
      ["onColumnsFilter", "model.setting存在code为heading且没有传入action时，当列表变化时的回调",
        "Function(currentFieldsList,allFields)", "-"],
        
    ],
  },
  {
    title: "model",
    desc: "ComplexRecords的model配置",
    columns: ["参数", "说明", "类型", "默认值"],
    data: [
      ["idField", "设置records中数据的当前主键字段", "String", "-"],
      ["pageSize", "列表显示数据的默认行数", "Number|String","20"],
      ["search", <div>设置搜索条件的配置，直接使用的是bill可以参考<a href="/bill/#model" target="_blank">bill的model配置</a>，我们对用于search的model配置进行了简化<a href="#model.search">参考search推荐版本</a></div>, "Object", "-"],
      ["console", <div>提供操作区域按钮的配置<a href="/records/#button">查看Records按钮的配置</a></div>, "Object", "-"],
      ["grid", <div>表格的配置，具体配置完全参考table的配置<a href="/table#Api" target="_blank">查看table的配置</a>，
        增加了一些可配置的属性<a href="#model.grid.filterModel">配置表头筛选filterModel</a>。当传入scroll时，固定表头如果列没有对齐，请设置列宽。
        如果字段中的show显式设置为false时表示初始时不显示</div>, "Object", "-"],
      ["setting", <div>表格列表设置，具体配置参考<a href="#model.setting">查看setting配置</a></div>, "Array[Object]", "-"]
    ],
  },
  {
    title: "model.search",
    desc: "search的简单配置",
    columns: ["参数", "说明", "类型", "默认值"],
    data: [
      ["mode", "搜索模式，支持simple|complex，simple模式下字段只支持bind事件（通过events传入或者onBind函数），也可直接传入data", "String", "complex"],
      ["fields", <div>搜索条件字段<a href="/bill/#field" target="_blank">参考bill的fields配置</a>，
        当mode为complex以及filter为true时，如果字段中的show显式设置为false时表示初始时不显示</div>, "Array[Object]", "-"],
      ["events", <div>搜索条件字段的事件配置<a href="/bill/#events" target="_blank" >查看bill的events配置</a></div>, "Array[Object]", "-"],
      ["filter", "是否支持搜索条件过滤，排序、显示或隐藏", "Bool", "false"],
      ["advanced", "是否支持高级搜索", "Bool", "false"]
    ],
  },
  {
    title: "model.grid.columns -> filterModel",
    desc: "表头筛选的简单配置",
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
    desc: "setting的简单配置",
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
      ["reset()", "重置搜索条件", "-", "-"]
    ]
  },
];

export default model;
