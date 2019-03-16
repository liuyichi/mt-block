import React, { Component } from 'react';

export default class Api extends Component {
  render() {
    return (
      <div className="api">
        <h1>API</h1>
        <table>
          <caption>按钮的属性说明如下:</caption>
          <thead>
            <tr>
              <th>属性</th>
              <th>说明</th>
              <th>类型</th>
              <th>默认值</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>type</td>
              <td>类型，可选 <code>line</code><code>circle</code></td>
              <td>string</td>
              <td>line</td>
            </tr>
            <tr>
              <td>percent</td>
              <td>百分比</td>
              <td>Number</td>
              <td>0</td>
            </tr>
            <tr>
              <td>format</td>
              <td>内容的模板函数</td>
              <td>function(percent)</td>
              <td>percent=>percent+'%'</td>
            </tr>
            <tr>
              <td>status</td>
              <td>状态,可选:<code>success</code><code>exception</code><code>active</code></td>
              <td>string</td>
              <td>-</td>
            </tr>
            <tr>
              <td>showInfo</td>
              <td>是否现实进度数值或状态图标</td>
              <td>Boolean</td>
              <td>true</td>
            </tr>
            <tr>
              <td>strokeWidth(type=line)</td>
              <td>进度条数的宽度,单位 px</td>
              <td>Number</td>
              <td>10</td>
            </tr>
            <tr>
              <td>strokeWidth(type=circle)</td>
              <td>圆形进度条线的宽度,单位是进度条画布宽度的百分比</td>
              <td>Number</td>
              <td>6</td>
            </tr>
            <tr>
              <td>width(type=circle)</td>
              <td>圆形进度条画布宽度,单位 px</td>
              <td>Number</td>
              <td>132</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}