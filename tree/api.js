import React from "react";
/**
 * tree api
 */
export default [
    {
        title: "Tree",
        desc: "目录，组织结构，国家等层级展开、折叠",
        columns: ["属性", "说明", "类型", "默认值"],
        widths:["100px","300px","100px","100px"],
        data:[
            ["prefixCls", "设置样式前缀", "string", "mt"],
            ["iconFormat", "自定义树节点左侧的图标，接收一个对象如 {open, close, leaf}", "string or jsx or function(node) or ReactClass", "-"],

            ["data", "节点数据", "object[]", "-"],
            ["useTreeData", "使用树状数据", "boolean[]", "false"],
            ["idField", "节点数据中节点 id 对应的字段名", "string", "'id'"],
            ["parentIdField", "节点数据中父节点 id 对应的字段名", "string", "'parentId'"],
            ["childrenField", "当 useTreeData 为 true 时, 节点数据中子节点集合对应的字段名", "string", "'children'"],
            ["leafField", "节点数据中是否为叶子节点的标识对应的字段名", "string", "'leaf'"],
            ["showField", "节点数据中是显示内容对应的字段名", "string", "'label'"],
            ["format", "自定义字段渲染，优先级高于 showField", "function(node, tree)", "-"],
            ["resolveRelationship", "自定义解析树结构的方法，会覆盖 Tree 自己的同名方法", "function(props)", "-"],
            ["loadData", "异步加载数据", "function(nodeId)", "-"],
            ["filterTreeNode", "按需筛选树节点（高亮），返回true", "function(node)", "-"],

            ["defaultExpandAll", "默认展开所有树节点", "bool", "false"],
            ["defaultExpandedIds", "默认展开指定的树节点", "string[]|number[]", "[]"],
            ["expandedIds", "（受控）展开指定的树节点", "string[]|number[]", "[]"],
            ["autoExpandParent", "是否自动展开父节点", "bool", "true"],
            ["onExpand", "展开/收起节点时触发", "function(expandedIds, {expanded: bool, nodeId})", "-"],

            ["multiple", "支持点选多个节点（节点本身）", "bool", "false"],
            ["defaultSelectedIds", "默认选中的树节点", "string[]|number[]", "[]"],
            ["selectedIds", "（受控）设置选中的树节点", "string[]|number[]", "-"],
            ["selectFolderable", "是否可选择非叶子节点", "bool", "true"],
            ["onSelect", "点击树节点触发", "function(selectedIds, e:{selected: bool, selectedNodes, nodeId, event})", "-"],

            ["checkable", "节点前添加 Checkbox 复选框", "bool", "false"],
            ["checkHalfable", "节点前 Checkbox 复选框是否显示半选状态", "bool", "true"],
            ["defaultCheckedIds", "默认选中复选框的树节点", "string[]|number[]", "[]"],
            ["checkedIds", "（受控）选中复选框的树节点（注意：父子节点有关联，如果传入父节点key，则子节点自动选中；相应当子节点key都传入，父节点也自动选中。当设置checkable和checkStrictly，它是一个有checked和halfChecked属性的对象，并且父子节点的选中与否不再关联", "string[]|number[]/{checked:Array,halfChecked:Array}", "[]"],
            ["checkStrictly", "checkable状态下节点选择完全受控（父子节点选中状态不再关联）", "bool", "[]"],
            ["onCheck", "点击复选框触发", "function(checkedIds, e:{checked: bool, checkedNodes, node, event})", "-"],

            ["onRightClick", "响应右键点击", "function({event,nodeId})", "-"],
            ["draggable", "设置节点可拖拽（IE>8）", "bool", "false"],
            ["onDragStart", "开始拖拽时调用", "function({event,nodeId})", "-"],
            ["onDragEnter", "dragenter 触发时调用", "function({event,nodeId,expandedIds})", "-"],
            ["onDragOver", "dragover 触发时调用", "function({event,nodeId})", "-"],
            ["onDragLeave", "dragleave 触发时调用", "function({event,nodeId})", "-"],
            ["onDragEnd", "dragend 触发时调用", "function({event,nodeId})", "-"],
            ["onDrop", "drop 触发时调用", "function({event, nodeId, dragNode, dragNodesIds})", "-"],
        ]
    },
    {
        title: "method",
        desc: "Tree对外提供的方法",
        columns: ["方法名", "方法说明", "参数", "返回值类型 | 返回值说明"],
        data: [
            ["getNode(nodeId)", "根据 nodeId 获取节点的数据", "节点 id", "对应节点的数据"],
            ["getRootIds()", "获取所有根节点", "-", "根节点 id 的数组"],
            ["getChildIds(nodeId)", "获取一个节点的子节点", "节点 id", "子节点 id 的数组"],
            ["getParentId(nodeId)", "获取一个节点的父节点", "节点 id", "父节点 id"]
        ]
    }
];