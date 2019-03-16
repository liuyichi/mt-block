import React from 'react';
import M from '../../util';
import { DateCalendar, MonthCalendar, DateTimeCalendar } from '../index';

const format = '%Y-%m-%d %H:%M';
class PanelDemo extends M.BaseComponent {
  constructor(props) {
    super(props);
    const now = Date.now();
    Object.assign(this.state, {
      date1: now,
      date2: now,
      date3: now,
    });
  }
  render() {
    const { date1, date2, date3 } = this.state;
    return (
      <div className="date-picker-calendar-demo">
        <table>
          <tbody>
          <tr>
            <td>日期面板</td>
            <td>月份面板</td>
            <td>日期时间面板</td>
          </tr>
          <tr>
            <td>
              <DateCalendar
                value={date1}
                disabledDate={this.disabledDate}
                onSelect={this.onChangeDate1}
              />
            </td>
            <td>
              <MonthCalendar
                value={date2}
                disabledDate={this.disabledMonth}
                onSelect={this.onChangeDate2}
              />
            </td>
            <td>
              <DateTimeCalendar
                value={date3}
                format={format}
                onConfirm={this.onChangeDate3}
              />
            </td>
          </tr>
          <tr>
            <td>{M.formatDatetime(date1, '%Y-%m-%d')}</td>
            <td>{M.formatDatetime(date2, '%Y-%m')}</td>
            <td>单击确认修改时间<br />{M.formatDatetime(date3, format)}</td>
          </tr>
          </tbody>
        </table>
      </div>
    );
  }
  onChangeDate1(date1) {
    this.setState({ date1 });
  }
  onChangeDate2(date2) {
    this.setState({ date2 });
  }
  onChangeDate3(date3) {
    this.setState({ date3 });
  }
}

export default <PanelDemo />;
