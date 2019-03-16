import React, { Component } from 'react';

const locale = <pre>
  <p>// 跳页及切条数部分</p>
  <p>items_per_page: '/页',</p>
  <p>jump_to: '跳至',</p>
  <p>jump_to_unit: '页',</p>
  <p>jump_submit: '确定',</p>

  <p>// 页码部分</p>
  <p>current: '第',</p>
  <p>first_page: '第一页',</p>
  <p>last_page: '最后一页',</p>
  <p>prev_page: '上一页',</p>
  <p>next_page: '下一页',</p>
  <p>prev_5: '向前 5 页',</p>
  <p>next_5: '向后 5 页',</p>
</pre>;

let model = [
    {
        title: "Pagination",
        desc: "分页组件支持的属性",
        columns: ["参数", "说明", "类型", "默认值"],
        data: [
            ["prefixCls", "设置样式前缀", "string", "mt"],
            ["current", "当前页码", "number", "-"],
            ["defaultCurrent", "初始页码", "number", "1"],
            ["total", "总共的条数", "number", "0"],
            ["pageSize", "每页显示的条数", "number", "-"],
            ["defaultPageSize", "初始每10显示的条数", "number", "-"],
            ["onChange", "选择的页码改变时的 handler", "function(current)", '-'],
            ["showSizeChanger", "设置是否显示条数选择框", "boolean", 'false'],
            ["selectPrefixCls", "设置页数选择框的样式前缀", "string", "mt"],
            ["onShowSizeChange", "切换条数时的 handler", "function(current, pageSize)", "-"],
            ["selectComponentClass", "渲染条数选择框的组件", "function()", "Select 组件"],
            ["selectAlign", "定位条数选择框", "object", "详情请查看 Select 组件的 demo"],
            ["pageSizeOptions", "条数选择框的可选项", "array", "-"],
            ["showQuickJumper", "设置是否显示跳页输入框", "boolean", "false"],
            ["quickJumperSubmit", "设置是否显示跳页确定按钮", "boolean", "false"],
            ["showTotal", "总条数的渲染", "function(total, current, pageSize)", "false"],
            ["locale", "显示文本文案", "object", locale],
            ["size", "设置控件大小，可选值为 small|default 或者不设", "string", 'default'],
        ],
    }
];

export default model;
