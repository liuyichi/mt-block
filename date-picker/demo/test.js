import React, { Component } from 'react';
import { DateCalendar, DatePicker, Button,
  MonthCalendar, TimePicker, RangePicker, DateTimeCalendar } from '../../index';

import { TimePanel } from '../panel';

import './index.scss';

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: Date.now(),
    };
  }
  render() {
    let date1 = new Date(2016, 1, 29);
    let date2 = new Date(2016, 10, 3);
    let { value } = this.state;
    return (
      <div className="date-picker-test">
        <section>
          <header>日期日历</header>
          <article>
            <DateCalendar />
            <DateCalendar value={date1.getTime()} />
            <DateCalendar value={date2.getTime()} showToday={false}
                          disabledDate={this._disabledDate.bind(this)}/>
          </article>
        </section>
        <section>
          <header>月份日历</header>
          <article>
            <MonthCalendar disabledMonth={this._disabledMonth.bind(this)} />
            <MonthCalendar value={date1.getTime()} />
          </article>
        </section>
        <section>
          <header>时间面板</header>
          <article>
            <TimePanel onChange={this._selectTime.bind(this)} />
            <TimePanel format="%H:%M:%S" onChange={this._selectTime.bind(this)} />
          </article>
        </section>
        <section>
          <header>日期时间日历</header>
          <article>
            <DateTimeCalendar />
            <DateTimeCalendar format="%Y-%m-%d %H:%M:%S" />
          </article>
        </section>
        <section>
          <header>日期选择器，禁用模式，有placeholder无value|无placeholder有value|无placeholder无value</header>
          <article>
            <DatePicker ref="1" placeholder="我被禁用了" disabled={true} />
            <DatePicker ref="2" value={1473955200000} disabled={true} />
            <DatePicker ref="3" disabled={true} />
          </article>
        </section>
        <section>
          <header>日期选择器，普通模式，很长的placeholder|必填项|其他校验方法</header>
          <article>
            <DatePicker ref="4" placeholder="请选择日期，随便选吧随便选吧随便选吧随便选吧随便选吧" />
            <DatePicker ref="5" placeholder="我是必须的" required={true} validation="必填项，请表无视我" />
            <DatePicker ref="6" placeholder="我是必须的"
                          required={true}
                          validation="必填项，请表无视我"
                          validator={this._validateDate.bind(this)} />
          </article>
        </section>
        <section>
          <header>
            日期选择器，onChange，内部值的改变通知父组件，并且父组件处理为下一天
          </header>
          <article>
            <DatePicker ref="7" value={value}
                          onChange={this._dateChangeHandler.bind(this)}
                          placeholder="请选择日期，随便选吧随便选吧随便选吧随便选吧随便选吧" />
          </article>
        </section>
        <section>
          <header>日期选择器，月份日历，普通模式|禁用模式</header>
          <article>
            <DatePicker ref="8" format="%Y-%m" placeholder="这里只能选择月份哦" />
            <DatePicker ref="9" format="%Y-%m" value={1473955200000} disabled={true} />
          </article>
        </section>
        <section>
          <header>日期时间选择器</header>
          <article>
            <DatePicker ref="10" format="%Y-%m-%d %H:%M" />
            <DatePicker ref="11" format="%Y-%m-%d %H:%M:%S" />
          </article>
        </section>
        <section>
          <header>时间选择器，禁用模式，有placeholder无value|无placeholder有value|无placeholder无value</header>
          <article>
            <TimePicker ref="12" placeholder="不能选时间啦" disabled={true} />
            <TimePicker ref="13" value="12:45" disabled={true} />
            <TimePicker ref="14" disabled={true} />
          </article>
        </section>
        <section>
          <header>时间选择器，时-分，普通/禁用显示/禁用不显示</header>
          <article>
            <TimePicker ref="15" placeholder="选择一个确切的会议时间" />
            <TimePicker ref="16" placeholder="只能在9:00~18:59之间，禁用显示"
                          disabledHours={() => { return [0,1,2,3,4,5,6,7,8,19,20,21,22,23]}} />
            <TimePicker ref="17"
                          placeholder="只能在9:00~18:59之间，禁用不显示"
                          hideDisabledOptions={true}
                          disabledHours={() => { return [0,1,2,3,4,5,6,7,8,19,20,21,22,23]}} />
          </article>
        </section>
        <section>
          <header>时间选择器，时-分-秒，普通/时分禁用联动/时分秒禁用联动</header>
          <article>
            <TimePicker ref="18" format="%H:%M:%S" placeholder="选择一个确切的时间，精确到秒" />
            <TimePicker ref="19" placeholder="选择时间，时分秒联动，不能选择10:24~11:47"
                          disabledMinutes={(hour) => {
                            if (hour == 10) {
                              return new Array(36).fill(0).map((item, i) => i + 24);
                            } else if (hour == 11) {
                              return new Array(48).fill(0).map((item, i) => i);
                            }
                          }} />
            <TimePicker ref="20" format="%H:%M:%S"
                          placeholder="选择时间，时分秒联动，不能选择13:44:20~13:57:45"
                          disabledMinutes={(hour) => {
                            if (hour == 13) {
                              return [45,46,47,48,49,50,51,52,53,54,55,56];
                            }
                          }}
                          disabledSeconds={(hour, minute) => {
                            if (hour == 13) {
                              if (minute == 44) {
                                return new Array(40).fill(0).map((item, i) => i + 20);
                              } else if (minute == 57) {
                                return new Array(46).fill(0).map((item, i) => i);
                              }
                            }
                          }} />

          </article>
        </section>
        <section>
          <header>时间选择器，必填项/其他校验</header>
          <article>
            <TimePicker ref="21" value="3:23" placeholder="必填项校验" required={true} validation="必填项" />
            <TimePicker ref="22" placeholder="必填项" required={true}
                          validation="必填项" validator={this._validateTime.bind(this)}/>
          </article>
        </section>
        <section>
          <header>日期范围选择器，年-月/年-月-日/至今</header>
          <article>
            <RangePicker ref="23" format="%Y-%m" placeholder={['开始月份', '结束月份']}
                         disabledMonth={this._disabledMonth.bind(this)} />
            <RangePicker ref="24" placeholder={['开始日期', '结束日期']}
                         disabledDate={this._disabledDate.bind(this)} />
            <RangePicker ref="25" showUpToNow={true} placeholder={['开始日期', '结束日期']}
                           onChange={this._rangeChangeHandler.bind(this)}/>
          </article>
        </section>
        <section>
          <header>日期范围选择器，禁用/必填校验/其他校验</header>
          <article>
            <RangePicker ref="26" disabled={true}
                         placeholder={['开始日期', '结束日期']} />
            <RangePicker ref="27" required={true}
                         validation={['必须填开始', '结束必须填']}
                         placeholder={['开始日期', '结束日期']} />
            <RangePicker ref="28" required={true} showUpToNow={true}
                         validation={['必须填开始', '结束必须填']}
                         placeholder={['开始日期', '结束日期']}
                         validator={this._validateRange.bind(this)} />
          </article>
        </section>
        <section>
          <header>日期范围选择器，年月日时分/年月日时分秒</header>
          <article>
            <RangePicker ref="29" format="%Y-%m-%d %H:%M" />
            <RangePicker ref="30" format="%Y-%m-%d %H:%M:%S" />
          </article>
        </section>
        <section>
          <header>查看模式</header>
          <article>
            <DatePicker mode="view" emptyLabel="-" />
            <DatePicker mode="view" value={Date.now()} format="%Y-%m-%d %H:%M:%S" />
            <TimePicker mode="view" emptyLabel="无" />
            <TimePicker mode="view" value="22:40" format="%H:%M:%S" />
            <RangePicker mode="view" emptyLabel="-" />
            <RangePicker mode="view" value={[1474016400000, 1474020000000]} format="%Y-%m-%d %H:%M" />
            <RangePicker mode="view" value={[1474016400000, undefined, true]} format="%Y-%m" />
          </article>
        </section>
        <Button label="检查有效性" onClick={this._validate.bind(this)} />
      </div>
    );
  }
  _disabledDate(value) {
    let date = new Date(2016, 10, 1);
    return value < date.getTime() || value == 1480435200000;
  }
  _validate() {
    for (let prop in this.refs) {
      this.refs[prop].validate();
    }
  }
  _dateChangeHandler(value) {
    let d = new Date(value);
    d.setDate(d.getDate() + 1);
    this.setState({
      value: d.getTime(),
    });
  }
  _rangeChangeHandler(value) {
    console.log(value);
  }
  _validateDate(value) {
    if (value < new Date(2016, 7, 31).getTime()) {
      return '日期不得小于2016年8月31日';
    }
  }
  _validateTime(value) {
    let split = value.split(':');
    if (split[0] < 15) {
      return '不得小于15点';
    }
  }
  _disabledMonth(year, month) {
    return year < 2016 || (year == 2016 && month < 5);
  }
  _validateRange(value) {
    console.log(value);
    return '我是外部传入的校验结果';
  }
  _selectTime(value) {
    console.log(value);
  }
}

export default <Demo />;
