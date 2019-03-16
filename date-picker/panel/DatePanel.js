import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

let basicPrefixCls = 'date-panel';
let getCls = (prefix, basic, suffix) => {
  return [`${prefix}-${basic}`, basic].map((item) => `${item}${suffix}`).join(' ');
};

/**
 * 显示日期日历
 * props.value
 * props.prefixCls
 * props.onSelect
 * props.disabledDate
 *
 */
class DatePanel extends Component {
  static propTypes = {
    value: PropTypes.number,
    prefixCls: PropTypes.string,
    onSelect: PropTypes.func,
    disabledDate: PropTypes.func,
  };

  static defaultProps = {
    prefixCls: 'mt',
  };

  render() {
    //className
    let { prefixCls } = this.props;
    let panelCls = getCls(prefixCls, basicPrefixCls, '');

    return (
      <div className={panelCls}>
        {this._getDateHeader()}
        {this._getDateContent()}
      </div>
    );
  }

  _getDateHeader() {
    //className
    let { prefixCls } = this.props;
    let headerCls = getCls(prefixCls, basicPrefixCls, '-header');
    let dataWrapperCls = getCls(prefixCls, basicPrefixCls, '-data-wrapper');

    let weekNames = ['一', '二', '三', '四', '五', '六', '日'];

    return (
      <div className={headerCls}>
        {weekNames.map((item, i) => {
          return <div key={i} className={dataWrapperCls}>{item}</div>;
        })}
      </div>
    );
  }

  _getDateContent() {
    let { value, onSelect, disabledDate, prefixCls } = this.props;

    //className
    let contentCls = getCls(prefixCls, basicPrefixCls, '-content');
    let dataWrapperCls = getCls(prefixCls, basicPrefixCls, '-data-wrapper');
    let dataCls = getCls(prefixCls, basicPrefixCls, '-data');

    let date = new Date(value);

    // 设置为本月1日，得到星期几和本月月份
    date.setDate(1);
    let firstDayOfCurMonthInWeek = date.getDay();
    let curMonth = date.getMonth();
    let yearOfCurMonth = date.getFullYear();

    // 向前拨一天，得到上月最后一日、上月月份、上月年份
    date.setHours(date.getHours() - 24);
    let lastDateOfPrevMonth = date.getDate();
    let prevMonth = date.getMonth();
    let yearOfPrevMonth = date.getFullYear();

    // 设置为下月1日，得到下月月份、下月年份
    date.setDate(1);
    date.setMonth(date.getMonth() + 2);
    let nextMonth = date.getMonth();
    let yearOfNextMonth = date.getFullYear();

    // 向前拨一天，得到本月最后一日
    date.setHours(date.getHours() - 24);
    let lastDateOfCurMonth = date.getDate();

    let dates = [], dateIterator = lastDateOfPrevMonth;
    date.setFullYear(yearOfPrevMonth, prevMonth, dateIterator);
    //日历是从周一到周日，这里需要转换才能算出上月要补多少天
    let datesNumberOfPrevMonth = firstDayOfCurMonthInWeek == 0?
      firstDayOfCurMonthInWeek + 6 : firstDayOfCurMonthInWeek - 1;
    for (let i = datesNumberOfPrevMonth; i > 0; i--) { //补齐上月日期
      dates.unshift({
        current: false,
        year: date.getFullYear(),
        month: date.getMonth(),
        date: date.getDate(),
        ts: date.getTime(),
      });
      date.setDate(--dateIterator);
    }

    dateIterator = 1;
    date.setFullYear(yearOfCurMonth, curMonth, dateIterator);
    for (let i = 1; i <= lastDateOfCurMonth; i++) { //本月日期
      dates.push({
        current: true,
        year: date.getFullYear(),
        month: date.getMonth(),
        date: date.getDate(),
        ts: date.getTime(),
      });
      date.setDate(++dateIterator);
    }

    // 固定显示6行，每行7天
    let numberOfRows = 6;
    let numberOfColumns = 7;
    let daysToFixed = numberOfRows * numberOfColumns - dates.length;
    dateIterator = 1;
    date.setFullYear(yearOfNextMonth, nextMonth, dateIterator);
    for (let i = 1; i <= daysToFixed; i++) { //补齐下月日期
      dates.push({
        current: false,
        year: date.getFullYear(),
        month: date.getMonth(),
        date: date.getDate(),
        ts: date.getTime(),
      });
      date.setDate(++dateIterator);
    }

    let today = new Date();
    date.setTime(value);
    let rows = [];
    for (let i = 0; i < numberOfRows; i++) {
      let rowParts = dates.slice(
        i * numberOfColumns, (i + 1) * numberOfColumns);
      //记录同行上一个日期是否不可用
      let lastDisabled = false;
      let everyRow = rowParts.map((item, i) => {
        let isDisabled = !!(disabledDate && disabledDate(item.ts));
        let nextDisabled = !!(disabledDate && rowParts[i+1] && disabledDate(rowParts[i+1].ts));
        let content = (
          <div key={i}
               className={classNames(dataWrapperCls, {
                 'not-current-month': !item.current,
                 'is-today': item.year == today.getFullYear()
                   && item.month == today.getMonth() && item.date == today.getDate(),
                 'selected-date': item.year == date.getFullYear()
                   && item.month == date.getMonth() && item.date == date.getDate(),
                 'disabled-date': isDisabled,
                 'disabled-date-start': isDisabled && !lastDisabled,
                 'disabled-date-end': isDisabled && !nextDisabled,
               })}>
            <div className={dataCls}
                 onClick={!isDisabled && onSelect.bind(this, item.ts)}>{item.date}</div>
          </div>
        );
        lastDisabled = isDisabled;
        return content;
      });
      rows.push(everyRow);
    }

    let dateContent = rows.map((row, i) => {
      return <div key={i} className={`${prefixCls}-${basicPrefixCls}-row`}>{row}</div>;
    });

    return (
      <div className={contentCls}>
        {dateContent}
      </div>
    );
  }
}

export default DatePanel;
