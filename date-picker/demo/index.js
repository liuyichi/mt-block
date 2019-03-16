import React, { Component } from 'react';
import Doc from '../../util/doc';
import Api from '../api';
import { DateCalendar, DatePicker, Button,
  MonthCalendar, TimePicker, RangePicker, DateTimeCalendar } from '../../index';
import Test from './test';

import './index.scss';

class Demo extends Component {
  render() {
    return (
      <div className="date-picker-demo">
        <h1>Date-Picker API</h1>
        <ul className="category">
          <li><a href="javascript: scrollToCode('button')">Calendar 接收的参数</a></li>
          <li><a href="javascript: scrollToCode('button')">Date-Picker 接收的参数</a></li>
          <li><a href="javascript: scrollToCode('button')">Time-Picker 接收的参数</a></li>
          <li><a href="javascript: scrollToCode('button')">Range-Picker 接收的参数</a></li>
          <li><a href="javascript: scrollToCode('function')">Button 提供的方法</a></li>
          <li><a href="javascript: scrollToCode('group')">Button.Group 接收的参数</a></li>
        </ul>
        <h1>类型</h1>
        <p>基于使用场景的不同，日期选择样式共分为<em>选择日期(DatePicker)</em>、<em>选择具体时间(TimePicker)</em>、
          <em>选择日期时间段(RangePicker)</em>三个样式；</p>
        <h4>时间输入框样式</h4>
        <div className="base-demo">
          <table>
            <tbody>
            <tr>
              <td>无数据</td>
              <td>
                <label className="required">选择日期</label>
                <DatePicker />
              </td>
            </tr>
            <tr>
              <td>有数据</td>
              <td>
                <label className="required">选择日期</label>
                <DatePicker value={Date.now()} />
              </td>
            </tr>
            </tbody>
          </table>
          <table>
            <tbody>
            <tr>
              <td>无数据</td>
              <td>
                <label className="required">选择日期</label>
                <DatePicker />
              </td>
            </tr>
            <tr>
              <td>有数据</td>
              <td>
                <label className="required">选择日期</label>
                <DatePicker value={Date.now()} />
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <section>
          <header><h1>Demo: Calendar</h1></header>
          <article>
            <MonthCalendar disabledDate={this._disabledMonth.bind(this)} />
            <DateCalendar disabledDate={this._disabledDate.bind(this)} />
            <DateTimeCalendar />
          </article>
        </section>
        <section>
          <header><h1>Demo: TimePicker</h1></header>
          <article>支持格式:【时:分:秒】【时:分】</article>
          <article>
            <TimePicker placeholder="时:分，选择范围 9:00~18:59"
                        disabledHours={() => { return [0,1,2,3,4,5,6,7,8,19,20,21,22,23]}} />
            <TimePicker format="%H:%M:%S" placeholder="时:分:秒" />
          </article>
        </section>
        <section>
          <header><h1>Demo: DatePicker</h1></header>
          <article>支持格式:【年-月】【年-月-日】【年-月-日 时:分】【年-月-日 时:分:秒】</article>
          <article>
            <DatePicker format="%Y-%m-%d" placeholder="年-月-日" />
            <DatePicker format="%Y-%m-%d %H:%M" placeholder="年-月-日 时:分" />
          </article>
        </section>
        <section>
          <header><h1>Demo: RangePicker</h1></header>
          <article>支持格式同DatePicker</article>
          <article>
            <RangePicker format="%Y-%m-%d" placeholder={["开始日期", "结束日期"]} />
            <RangePicker format="%Y-%m" showUpToNow={true} placeholder={["开始月份", "结束月份"]} />
          </article>
        </section>
        <section>
          <header><h1>禁用模式</h1></header>
          <article>
            <TimePicker disabled={true} placeholder="无数据时的提示信息"/>
            <DatePicker disabled={true} format="%Y-%m-%d %H:%M:%S" value={Date.now()} />
            <RangePicker disabled={true} format="%Y-%m"
                         value={[1477929600000, undefined, true]} showUpToNow={true} />
          </article>
        </section>
        <section>
          <header><h1>查看模式</h1></header>
          <article>
            <DatePicker mode="view" value={Date.now()} format="%Y-%m-%d %H:%M:%S" />
            <TimePicker mode="view" value="22:40" format="%H:%M:%S" />
            <RangePicker mode="view" value={[1474016400000, 1474020000000, false]} format="%Y-%m-%d %H:%M" />
          </article>
        </section>
        <section>
          <header><h1>必填校验</h1></header>
          <article>
            <TimePicker ref="1" required={true} placeholder="必填项" />
            <DatePicker ref="2" required={true} validation="请选择日期" />
            <RangePicker ref="3" required={true}
                         validation={["开始日期必填", "结束日期必填"]} showUpToNow={true} />
          </article>
        </section>
        <section>
          <header><h1>自定义校验</h1></header>
          <article>
            <TimePicker ref="4" value="14:38" validator={this._validateTime.bind(this)} />
            <DatePicker ref="5" value={1469980800000} validator={this._validateDate.bind(this)}/>
            <RangePicker ref="6" value={[1462032000000, 1469980799000, false]}
                         validator={this._validateRange.bind(this)} />
            <RangePicker ref="7" validation="统一的必填校验提示" required={true} />
          </article>
        </section>
        <Button onClick={this._validate.bind(this)}>检验有效性</Button>
        <Button onClick={this._clear.bind(this)}>清除异常状态</Button>
        <Api />
      </div>
    );
  }
  _disabledDate(value) {
    //let date = new Date(2016, 9, 1);
    //小于2016年10月1日或等于2016年10月31日时 禁用
    return value < 1475251200000 || value == 1477843200000;
  }
  _disabledMonth(ts) {
    //2016年2月之前 禁用
    return ts < new Date(2016, 1, 1).getTime();
  }
  _validateTime(value) {
    let split = value.split(':');
    if (split[0] < 15) {
      return '不得小于15点';
    }
  }
  _validateDate(value) {
    if (value < new Date(2016, 7, 31).getTime()) {
      return '日期不得小于2016年8月31日';
    }
  }
  _validateRange(value) {
    return '外部校验失败';
  }
  _validate() {
    for (let prop in this.refs) {
      this.refs[prop].validate();
    }
  }
  _clear() {
    for (let prop in this.refs) {
      this.refs[prop].clear();
    }
  }
}

let conf = {
  "code": "date-picker",
  "sub": {
    "title": "DatePicker",
    "desc": "包含 日期组件(DatePicker)，时间组件(TimePicker)，时间段组件(RangePicker)"
  },
  "stage": {
    "title": "使用场景",
    "desc": "当用户需要输入一个日期/时间/时间段时"
  },
  demos:[
    {
      "code": "basic",
      "title": "基本用法",
      "desc": "点击标准输入框，弹出面板进行选择，有两种尺寸【size: default | small】。",
      'element': require('./basic').default,
      "link": "basic.js"
    },
    {
      "code": "fieldmode",
      "title": "字段状态",
      "desc": "组件的常用状态有三种：默认【mode: default】、显示【mode: view】和禁用【disabled: true】。",
      'element': require('./field-mode').default,
      "link": "field-mode.js"
    },
    {
      "code": "validate",
      "title": "校验场景",
      "desc": "支持的校验方式，【required：true】必填校验，【validator：() => {}】自定义校验。",
      'element': require('./validate').default,
      "link": "validate.js"
    },
    {
      "code": "calendar",
      "title": "日期面板",
      "desc": "当需要自定义选择组件时，可以直接使用日期面板。",
      'element': require('./calendar').default,
      "link": "calendar.js"
    },
    {
      "code": "event",
      "title": "事件回调",
      "desc": "支持一些事件的回调函数，例如【disabledDate】禁用某些日期，【disabledTime】禁用某些时间等",
      'element': require('./event').default,
      "link": "event.js"
    }
  ],
  api: Api,
};

export default <Doc className="block-date-picker-demo" {...conf} />;
// export default Test;
