import React, { Component } from 'react';
import Table from '../table';

// TODO: 分块显示 API
export default class Api extends Component {
  render() {
    // Tree API
    let
      cols = ["属性", "说明", "类型", "默认值"],
      data = [
        ["prefixCls", "设置样式前缀", "string", "mt"],

        ["type", "提示类型", "[info|success|warning|error]", "'info'"],
        ["title", "提示的标题", "string", "-"],
        ["content", "提示的内容", "string", "-"],
        ["onClose", "点击关闭按钮时的回调，不传会隐藏关闭按钮", "function(e)", "-"],
      ];

    return (
      <div className="api">
        <h1>Alert API</h1>
        <Table
          idField="col_0"
          pagination={false}
          columns={cols.map((v, k) => ({code: "col_" + k, label: v, width: k === 1 ? "auto" : 150}))}
          data={data.map(v => {
            let items = {};
            v.forEach((item, k) => {
              items["col_" + k] = item;
            });
            return items;
          })}
        />
      </div>
    );
  }
}
