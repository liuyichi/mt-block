let model = [
  {
    title: "Draggable",
    desc: "支持传入的属性",
    columns: ["参数", "说明", "类型", "默认值"],
    data: [
      ["prefixCls", "设置样式前缀", "string", "mt"],
      ["options", "sortablejs属性配置，详见options", "object", "{...}"],
      ["data", "数据", "array", "[]"],
      ["format", "数据模板化，返回React可渲染的任意数据", "function(item, key, index, array)", "null"],
      ["idField", "传入数据的主键属性名", "string", "''"],
      ["itemClass", "列表元素类名", "string or  function(item, key, index)", "''"],
    ],
  },
  {
    title: "options",
    desc: "传入sortablejs的参数",
    columns: ["参数", "说明", "类型", "默认值"],
    data: [
      ["group", "列表组信息，详见options.group", "string | object", "name"],
      ["sort", "列表内是否支持拖拽排序", "bool", "false"],
      ["delay", "拖拽开始的延迟毫秒数", "number", "0"],
      ["disabled", "是否禁用拖拽", "bool", "false"],
      ["animation", "拖拽效果动画的毫秒数，0表示无动画", "number", "150"],
      ["handle", "CSS选择器，选中的区域才允许拖拽", "string", "无"],
      ["filter", "CSS选择器，不允许拖拽的区域", "string | function", "无"],
      ["preventOnFilter", "调用filter为true时是否取消事件", "bool", "true"],
      ["ghostClass", "拖拽元素在放置区域上的镜像类名", "string", "mt-draggable__ghost"],
      ["chosenClass", "拖拽元素的类名", "string", "mt-draggable__chosen"],
      ["dragClass", "拖拽中的元素类名", "string", "mt-draggable__drag"],
      ["forceFallback", "如果设置为true，表示拖拽行为不基于Drag&Drop，目的是为了兼容老浏览器", "bool", "false"],
      ["fallbackClass", "当forceFallback为true时，拖拽中的元素类名", "string", "mt-draggable__fallback"],
      ["fallbackOnBody", "当forceFallback为true时，拖拽中的元素是否加在body上", "bool", "false"],
      ["fallbackTolerance", "当forceFallback为true时，被认为是拖拽时鼠标需要移动的像素数", "number", "0"],
      ["scroll", "当拖拽元素到边界时是否自动滚动区域", "bool", "true"],
      ["scrollFn", "推荐自定义滚动时使用", "function(offsetX, offsetY, originalEvent)", "无"],
      ["scrollSensitivity", "开始自动滚动时鼠标距离边界的像素", "number", "30"],
      ["scrollSpeed", "自动滚动时的速度，单位像素", "number", "10"],
      ["setData", "在拖拽元素上添加数据", "function(dataTransfer, dragEl)", "无"],
      ["onStart", "拖拽开始时触发", "function(dragInfo, event, instance)", "无"],
      ["onEnd", "拖拽结束时触发", "function(dragInfo, event, instance)", "无"],
      ["onAdd", "放置另一个列表的元素时触发", "function(dragInfo, event, instance)", "无"],
      ["onClone", "当创建了一个复制元素时触发", "function(dragInfo, event, instance)", "无"],
      ["onFilter", "与filter连用，当拖拽被过滤的元素时触发，触发时机是mousedown或tapstart", "function(dragInfo, event, instance)", "无"],
      ["onChoose", "选中被拖拽元素时触发，触发时机是mousedown或tapstart", "function(dragInfo, event)", "无"],
      ["onUpdate", "放置本列表的元素时触发", "function(dragInfo, event, instance)", "无"],
      ["onSort", "列表的增(Add)删(Remove)改(Update)时触发", "function(dragInfo, event, instance)", "无"],
      ["onRemove", "从列表中移出元素时触发", "function(dragInfo, event, instance)", "无"],
      ["onMove", "在列表内或列表间移动时触发，移动指的是位置改变", "function(dragInfo, event, instance)", "无"],
    ],
  },
  {
    title: "options.group",
    desc: "组配置，可接受的值解释",
    columns: ["值类型", "属性名", "属性类型", "说明"],
    data: [
      ["string", "", "", "组名称"],
      ["object", "name", "string", "组名称"],
      ["object", "pull", "bool | string | function",
        "true表示允许移出，false表示不允许移出, 'clone'表示复制。\n" +
        "function(to, from, dragEl, event) { return true | false | 'clone' } 函数条件判断移出方式。"],
      ["object", "put", "bool | array | function", "在组名称相同的情况下，true表示允许放置，false表示不允许放置。\n" +
        "传入数组和函数时，组名称不起作用。数组保存的是允许放置的组名称。\n" +
        "function(to, from, dragEl, event) { return true | false } 函数条件判断放置方式。"],
      ["object", "revertClone", "bool", "对于复制出去的元素是否保持其原来的位。"],
    ],
  },
  {
    title: "event.attribute",
    desc: "拖拽相关事件上的属性，在某些事件上可能只有部分属性",
    columns: ["名称", "类型", "说明"],
    data: [
      ["to", "HTMLElement", "目标列表"],
      ["from", "HTMLElement", "源列表，from.SortableXXXXXX.data表示移动的项目的数据"],
      ["item", "HTMLElement", "拖拽元素"],
      ["clone", "HTMLElement", "复制元素"],
      ["oldIndex", "Number|undefined", "拖拽元素的旧索引值"],
      ["newIndex", "Number|undefined", "拖拽元素的新索引值"],
      ["dragged", "HTMLElement", "拖拽元素"],
      ["draggedRect", "ClientRect", "拖拽元素的边框属性"],
      ["related", "HTMLElement", "拖拽元素移动时关联元素，比如交换位置的元素"],
      ["relatedRect", "ClientRect", "上述元素的边框属性"],
    ],
  },
  {
    title: "method",
    desc: "对外提供的方法",
    columns: ["方法", "方法说明", "参数类型 | 参数说明", "返回值类型 | 返回值说明"],
    data: [
      ["getInstance()", "获取Sortable实例", "无", "Object | Sortable实例"],
      ["setOption(name, value)", "设置Sortable实例的选项配置", "(name: String, value: Any) | name表示选项属性名，value的可接受值参考options", "无"],
      ["getOption(name)", "获取Sortable实例的选项配置", "(name: String) | name表示选项属性名", "Any | 返回值取决于该属性的可接受值"],
      ["toArray()", "获取Sortable实例的主键顺序", "无", "Array<String> | 返回值是主键数组"],
      ["sort(order)", "对Sortable实例重新排序", "(order: Array<String>) | 主键顺序", ""],
    ],
  },
];

export default model;