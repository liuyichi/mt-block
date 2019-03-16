import React from 'react';
import M from '../../util';
import { DatePicker, TimePicker, RangePicker } from '../index';

const format = '%Y-%m-%d %H:%M';
class EventDemo extends M.BaseComponent {
  render() {
    return (
      <div className="date-picker-event-demo">
        <div>
          <label>日期选择，禁止选择今天之前的日期</label>
          <div>
            <DatePicker disabledDate={this.disabledDate} />
          </div>
        </div>
        <div>
          <label>时间选择，只能选择 [9:00, 19:00)</label>
          <div>
            <TimePicker disabledHours={this.disabledHours} />
          </div>
        </div>
        <div>
          <label>时间段选择，每月1日不可选</label>
          <div>
            <RangePicker disabledTime={this.disabledTime} />
          </div>
        </div>
      </div>
    );
  }
  disabledDate(value) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return value < date.getTime();
  }
  disabledMonth(value) {
    const date = new Date();
    date.setMonth(4);
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return value < date.getTime();
  }
  disabledHours() {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 19, 20, 21, 22, 23];
  }
  disabledTime(value, type) {
    const ts = type === 'start' ? value[0] : value[1];
    const date = new Date(ts);
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    const start = date.getTime();
    date.setDate(2);
    const end = date.getTime();
    return ts >= start && ts < end;
  }
}

export default <EventDemo />;
