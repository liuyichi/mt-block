import React, { Component } from 'react';
import Doc from '../../util/doc';
let api = require("../api");

/**
 * 表格的demo需要包含如下的
 * 1 表头自定义
 * 2 合并单元格
 * 3 表头搜索
 * 4 header & footer
 * 5 折叠
 * 6 表格树
 * 7 合并单元格
 * 8 定宽
 * 9 固定表头 和不固定表头
 * 10 分列
 * 11 行编辑
 * 12 表内容排序
 */

let conf = {
    "code":"table",
    "sub":{
        "title":"Table 表格",
        "desc":"展示行列数据"
    },
    "stage":{
        "title":"使用场景",
        "desc":<div>
            <p>当有大量结构化的数据需要展现时;</p>
            <p>当需要对数据进行排序、搜索、分页、自定义操作等复杂行为时。</p>
        </div>
    },
    demos:[
        {
            "code":"basic",
            "title":"基本用法",
            "desc": <div>
              <p>简单的表格,最后一列是各种操作。</p>
              <p>覆盖属性：Table的columns, dataSource</p>
            </div>,
            'element':require('./basic').default,
            "link":"basic.js"
        },
      {
        "code":"multiTh",
        "title":"multiTh",
        "desc": <div>
          <p>简单的表格,可进行表格合并。</p>
          <p>属性: multiTh</p>
        </div>,
        'element':require('./multiTh').default,
        "link":"multiTh.js"
      },
        {
            "code":"bordered",
            "title":"带边框",
            "desc": <div>
              <p>添加表格边框线，页头和页脚, 行合并。</p>
              <p>覆盖属性：Table的border,  columns的rowSpan</p>
            </div>,
            'element':require('./bordered').default,
            "link":"bordered.js"
        },
        {
            "code":"row-selection",
            "title":"可选择",
            "desc": <div>
              <p>第一列是联动的选择框，固定表头, 树型数据。</p>
              <p>覆盖属性：Table的rowSelection, scroll; rowSelection的selectedRowKeys, onChange, getCheckboxProps, onSelect, onSelectAll</p>
            </div>,
            'element':require('./row-selection').default,
            "link":"row-selection.js"
        },
        {
            "code":"row-search",
            "title":"行内搜索",
            "desc": <div>
              <p>行内搜索选择。</p>
              <p>覆盖属性：Table的rowSelection, columns; rowSelection的onChange, render; columns的colSpan</p>
            </div>,
            "element":require('./row-search').default,
            "link":"row-search.js"
        },
      {
        "code": "custom-header",
        "title": "自定义表头",
        "desc": <div>
          <p>支持表头筛选，搜索。</p>
          <p>覆盖属性：Table的pagination,dataSource,columns, onChange。column里的format,filters,onFilter,filterMultiple,sorter。</p>
        </div>,
        "element": require('./custom-header').default,
        "link": "custom-header.js"
      },
      {
        "code": "expanded-row",
        "title": "扩展行",
        "desc": "覆盖属性：Table的expandedRowRender, defaultExpandedRowKeys, onExpandedRowsChange, onExpand",
        "element": require('./expanded-row').default,
        "link": "expanded-row.js"
      },
      {
        "code": "edit-table",
        "title": "可编辑表格",
        "desc": "覆盖属性: columns的format",
        "element": require('./edit-table').default,
        "link": "edit-table.js"
      }
    ],
    api:api,
    other: <div>
      <h2>遇到的问题</h2>
      <div>
        <p>1.给Table的scroll.x一定要算对，不然fixed那一列就会跟其他列错行,如果给的scroll.x 不等于所有列的宽度，
        那么即使你给每个column设了width,column的宽度也不会按照你设置的宽度来，
        它会按比例调整每一列的宽度使得总的滚动宽度等于你设的scroll.x。
        继而带来问题：因为fixed的那一列,实际是又覆盖了一层，而这个覆盖的层的宽度是按照你的column的width设的，所以造成了上面的那一层没有完全覆盖下面的一层。</p>
        <p>2.场景：表格的title是后端返回的，title的字数是不确定所以title可能换行。并且这时用了某一列设了fixed：“right”</p>
        <p>问题说明：table对于fixed的列实际是在上面盖了一层fixed的那一列，而覆盖的那一层的表头高度默认是一行，就会造成覆盖高度不准确</p>
      </div>
    </div>
};

export default <Doc className="block-table-demo" {...conf}/>;




