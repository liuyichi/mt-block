import React from 'react';
module.exports = [
    {
        title: "Table",
        desc: "以下为table支持的参数",
        columns: ["参数", "说明", "类型", "默认值"],
        data: [
            ["rowSelection", <span>列表项是否可选择<a href='#rowSelection'>配置项</a></span>, "Object", "null"],
            ["pagination", <span>分页器分页器，配置项参考<a href='/components/pagination'>pagination</a>,设为 false 时不展示和进行分页</span>, "Object", ""],
            ["size","正常或迷你类型，`default` or `small`","String","default"],
            ["dataSource","数据数组","Array","-"],
            ["columns","表格列的配置描述，具体项见下表","Array","-"],
            ["rowKey","表格行 key 的取值，可以是字符串或一个函数","String or Function(record):string","key"],
            ["rowClassName","表格行的类名","Function(record, index):string","-"],
            ["expandedRowRender","额外的展开行","Function","-"],
            ["defaultExpandedRowKeys","默认展开的行","Array","-"],
            ["expandedRowKeys","展开的行，控制属性","Array","-"],
            ["defaultExpandAllRows","初始时，是否展开所有行","Boolean","false"],
            ["onExpandedRowsChange","展开的行变化时触发","Function(expandedRows)",""],
            ["onExpand","点击展开图标时触发","Function(expanded, record)",""],
            ["onChange","分页、排序、筛选变化时触发","Function(pagination, filters, sorter)",""],
            ["loading","页面是否加载中","Boolean","false"],
            ["locale","默认文案设置，目前包括排序、过滤、空数据文案","Object",<span>filterConfirm: '确定' <br/> filterReset: '重置' <br/>emptyText: '暂无数据'</span>],
            ["indentSize","展示树形数据时，每层缩进的宽度，以 px 为单位","Number","15"],
            ["onRowClick","处理行点击事件","Function(record, index)","-"],
            ["columnsPageRange","从第几列到第几列做切换处理, 例如 [2, 14] 表示从第2列到第14列做分页","Array","-"],
            ["columnsPageSize","每一个切换页显示几列(不包括不参与切换的列)","number","-"],
            ["bordered","是否展示外边框和列边框。 warning:  带border的table 如果设 scroll: {{y:200}},border的对齐会有问题","Boolean","false"],
            ["showHeader","是否显示表头","Boolean","false"],
            ["hidePaginationIfOnePage","只有一页时是否不显示分页, 不建议在分页可进行条/页切换时使用","Boolean","false"],
            ["footer","表格尾部","Function(currentPageData)",""],
            ["title","表格标题","Function(currentPageData)",""],
            ["scroll","横向或纵向支持滚动，也可用于指定滚动区域的宽高度：`{{ x: true, y: 300 }}`","Object",""]
        ]
    },
    {
        title:"Column",
        desc:"列描述数据对象，是 columns 中的一项",
        columns: ["参数", "说明", "类型", "默认值"],
        data:[
            ["title", "列头显示文字", "String or React.Element", "-"],
            ["key","React 需要的 key，建议设置","String","-"],
            ["dataIndex","列数据在数据项中对应的 key，支持 `a.b.c` 的嵌套写法","String","-"],
            ["render","生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引，@return里面可以设置表格[行/列合并]","Function(text, record, index) {}","-"],
            ["filters","表头的筛选菜单项","Array","-"],
            ["onFilter","本地模式下，确定筛选的运行函数","Function","-"],
            ["filterMultiple","是否多选","Boolean","true"],
            ["filterDropdown","可以自定义筛选菜单，此函数只负责渲染图层，需要自行编写各种交互。warning: 不建议使用table的filterDropdown，默认下拉的计算位置是相对于整个页面的。当根据其他筛选条件 搜出来的结果多少不一样，整个页面的高度不一样的时候，下拉的位置就会计算不准确。不如写在label里。","React.Element","-"],
            ["sorter","排序函数，本地排序使用一个函数，需要服务端排序可设为 true","Function or Boolean","-"],
            ["colSpan","表头列合并,设置为 0 时，不渲染","Number",""],
            ["width","列宽度","String or Number",""],
            ["className","列的 className","String","-"],
            ["fixed","列是否固定，可选 `true`(等效于 left) `'left'` `'right'`","Boolean or String","false"],
            ["filteredValue","筛选的受控属性，外界可用此控制列的筛选状态，值为已筛选的 value 数组","Array","-"],
            ["sortOrder","排序的受控属性，外界可用此控制列的排序，可设置为 `'ascend'` `'descend'` `false`","Boolean or String","-"],
            ["filterWidth","筛选弹窗的宽度","number or string","auto"]
        ]
    },
    {
        title:"rowSelection",
        desc:"选择功能的配置",
        columns: ["参数", "说明", "类型", "默认值"],
        data:[
            ["type", "多选/单选，`checkbox` or `radio`", "String","checkbox"],
            ["selectedRowKeys","指定选中项的 key 数组，需要和 onChange 进行配合","Array","[]"],
            ["onChange","选中项发生变化的时的回调","Function(selectedRowKeys, selectedRows)","-"],
            ["getCheckboxProps","选择框的默认属性配置","Function(record)","-"],
            ["onSelect","用户手动选择/取消选择某列的回调 ","Function(record, selected, selectedRows)","-"],
            ["onSelectAll","用户手动选择/取消选择所有列的回调","Function(selected, selectedRows, changeRows)","-"],
            ["render", "勾选框渲染", "Function(row,index,expandIcon)"]
        ]
    }
];
