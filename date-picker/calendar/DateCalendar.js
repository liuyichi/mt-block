import React, { Component, PropTypes } from 'react';
import M from '../../util';
import { DatePanel, MonthPanel, YearPanel } from '../panel';
import strftime from 'strftime';
import { noop } from 'lodash-compat';
import { IconPrefixCls as iconPrefixCls } from '../../util/data';

//FIXME
let basicPrefixCls = 'date-calendar';
let getCls = (prefix, basic, suffix) => {
  return [`${prefix}-${basic}`, basic].map((item) => `${item}${suffix}`).join(' ');
};

/**
 * 日期日历，只能传日期禁用函数
 * props.value
 * props.showToday = true //是否显示今天
 * props.prefixCls = 'mt' //类前缀
 * props.onSelect = (v) => {} //选中日期时的回调
 * props.disabledDate = (ts) => { return true|false } //日期是否可用
 *
 */
class DateCalendar extends Component {
  static propTypes = {
    value: PropTypes.number,
    showToday: PropTypes.bool,
    prefixCls: PropTypes.string,
    onSelect: PropTypes.func,
    disabledDate: PropTypes.func,
  };

  static defaultProps = {
    showToday: true,
    prefixCls: 'mt',
    onSelect: noop,
    disabledDate: noop,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || this._clearHours(Date.now()),
      showPanel: 'date', // 'date'|'month'|'year'
    };
  }

  componentWillReceiveProps(nextProps) {
    let { value } = this.state;
    if (nextProps.hasOwnProperty('value')) {
      value = nextProps.value || this._clearHours(Date.now());
    }
    this.setState({ value });
  }

  render() {
    let { prefixCls, showToday, className, disabledDate } = this.props;
    let { showPanel } = this.state;

    //className
    let calendarCls = getCls(prefixCls, basicPrefixCls, '');
    let calendarContentCls = getCls(prefixCls, basicPrefixCls, '-content');
    let calendarHeaderCls = getCls(prefixCls, basicPrefixCls, '-header');
    let calendarPanelCls = getCls(prefixCls, basicPrefixCls, '-panel');
    let calendarFooterCls = getCls(prefixCls, basicPrefixCls, '-footer');
    let todayBtnCls = getCls(prefixCls, basicPrefixCls, '-today-btn');

    let isTodayBtnDisabled;
    if (showToday && showPanel == 'date') {
      isTodayBtnDisabled = disabledDate(this._clearHours(Date.now()));
    }

    //三个面板在DOM结构均存在，以防切面板的点击事件冒泡造成问题
    return (
      <div className={M.classNames(className, calendarCls)}>
        <div className={M.classNames(calendarContentCls, { 'active': showPanel == 'date' })}>
          <div className={calendarHeaderCls}>{this._getDateHeaderElement()}</div>
          <div className={calendarPanelCls}>{this._getDatePanelElement()}</div>
          {showToday && showPanel == 'date' && (
            <div className={calendarFooterCls}>
              <div onClick={!isTodayBtnDisabled && this._clickToday.bind(this)}
                   className={M.classNames(todayBtnCls, {
                   [`${basicPrefixCls}-today-btn-disabled`]: isTodayBtnDisabled,
                 })}>今天</div>
            </div>
          )}
        </div>
        <div className={M.classNames(calendarContentCls, { 'active': showPanel == 'month' })}>
          <div className={calendarHeaderCls}>{this._getMonthHeaderElement()}</div>
          <div className={calendarPanelCls}>{this._getMonthPanelElement()}</div>
        </div>
        <div className={M.classNames(calendarContentCls, { 'active': showPanel == 'year' })}>
          <div className={calendarHeaderCls}>{this._getYearHeaderElement()}</div>
          <div className={calendarPanelCls}>{this._getYearPanelElement()}</div>
        </div>
      </div>
    );
  }

  _getDateHeaderElement() {
    let { prefixCls } = this.props;
    let { value } = this.state;
    let formatted = strftime('%Y-%m', new Date(value)).split('-');
    return (
      <div className={`${prefixCls}-${basicPrefixCls}-date-header`}>
        {this._getYearSwitcher(-1)}
        {this._getMonthSwitcher(-1)}
        {this._getYearButton(formatted[0])}
        {this._getMonthButton(formatted[1])}
        {this._getMonthSwitcher(1)}
        {this._getYearSwitcher(1)}
      </div>
    );
  }

  _getMonthHeaderElement() {
    let { prefixCls } = this.props;
    let { value } = this.state;
    let formatted = strftime('%Y', new Date(value));
    return (
      <div className={`${prefixCls}-${basicPrefixCls}-month-header`}>
        {this._getYearSwitcher(-1)}
        {this._getYearButton(formatted)}
        {this._getYearSwitcher(1)}
      </div>
    );
  }

  _getYearHeaderElement() {
    let { prefixCls } = this.props;
    let { value } = this.state;
    let date = new Date(value);
    let year = date.getFullYear();
    let sYear = Number(Math.floor(year / 10) + '0');
    return (
      <div className={`${prefixCls}-${basicPrefixCls}-year-header`}>
        {this._getYearSwitcher(-1)}
        {`${sYear}-${sYear + 9}`}
        {this._getYearSwitcher(1)}
      </div>
    );
  }

  _getYearSwitcher(arg) {
    //className
    let { prefixCls } = this.props;
    let switcherCls = getCls(prefixCls, basicPrefixCls, '-year-switcher');
    let leftSwitcherCls = `${switcherCls} left-switcher`;
    let rightSwitcherCls = `${switcherCls} right-switcher`;

    let switchYear = (arg) => {
      let { value } = this.state;
      let date = new Date(value);
      this._selectYear(date.getFullYear() + arg);
    };
    let { showPanel } = this.state;
    switch (arg) {
      case -1:
        return <span className={M.classNames(leftSwitcherCls, `${iconPrefixCls} ${iconPrefixCls}-angle-double-left`)}
                     onClick={switchYear.bind(this, showPanel == 'year'? -10 : -1)} />;
      case 1:
        return <span className={M.classNames(rightSwitcherCls, `${iconPrefixCls} ${iconPrefixCls}-angle-double-right`)}
                     onClick={switchYear.bind(this, showPanel == 'year'? 10 : 1)} />;
    }
  }

  _getMonthSwitcher(arg) {
    //className
    let { prefixCls } = this.props;
    let switcherCls = getCls(prefixCls, basicPrefixCls, '-month-switcher');
    let leftSwitcherCls = `${switcherCls} left-switcher`;
    let rightSwitcherCls = `${switcherCls} right-switcher`;

    let switchMonth = (arg) => {
      let { value } = this.state;
      let date = new Date(value);
      this._selectMonth(date.getMonth() + arg);
    };
    switch (arg) {
      case -1:
        //FIXME 切换为icon
        return <span className={M.classNames(leftSwitcherCls, `${iconPrefixCls} ${iconPrefixCls}-angle-left`)}
                     onClick={switchMonth.bind(this, -1)} />;
      case 1:
        return <span className={M.classNames(rightSwitcherCls, `${iconPrefixCls} ${iconPrefixCls}-angle-right`)}
                     onClick={switchMonth.bind(this, 1)} />;
    }
  }

  _getYearButton(year) {
    //className
    let { prefixCls } = this.props;
    let yearBtnCls = getCls(prefixCls, basicPrefixCls, '-year-btn');

    let showYearPanel = () => {
      this.setState({
        showPanel: 'year',
      });
    };
    return (
      <span className={yearBtnCls} onClick={showYearPanel}>
        <span>{year}</span>
        <span>年</span>
      </span>
    );
  }

  _getMonthButton(month) {
    //className
    let { prefixCls } = this.props;
    let monthBtnCls = getCls(prefixCls, basicPrefixCls, '-month-btn');

    let showMonthPanel = () => {
      this.setState({
        showPanel: 'month',
      });
    };
    return (
      <span className={monthBtnCls} onClick={showMonthPanel}>
        <span>{month}</span>
        <span>月</span>
      </span>
    );
  }

  _getDatePanelElement() {
    let { disabledDate, prefixCls } = this.props;
    let { value } = this.state;
    let props = {
      prefixCls, value, disabledDate,
      onSelect: (value) => {
        this.setState({ value }, () => {
          let { onSelect } = this.props;
          onSelect(this.state.value);
        });
      }
    };
    return <DatePanel {...props} />;
  }

  _getMonthPanelElement() {
    let { prefixCls } = this.props;
    let { value } = this.state;
    let props = {
      prefixCls, value,
      onSelect: (month) => {
        this._selectMonth(month);
        this.setState({
          showPanel: 'date',
        });
      },
    };
    return <MonthPanel {...props} />;
  }

  _getYearPanelElement() {
    let { prefixCls } = this.props;
    let { value } = this.state;
    let props = {
      prefixCls, value,
      onSelect: (year) => {
        this._selectYear(year);
        this.setState({
          showPanel: 'date',
        });
      },
      onSwitch: (arg) => {
        let { value } = this.state;
        let date = new Date(value);
        this._selectYear(date.getFullYear() + (arg < 0? -10 : 10));
      },
    };
    return <YearPanel {...props} />;
  }

  _selectMonth(month) {
    let { value } = this.state;
    let date = new Date(value);
    let dateBefore = date.getDate();
    date.setMonth(month);
    //选择/切换月份时如果没有该日，例如5-31切换到4月
    if (date.getDate() !== dateBefore) {
      date.setMonth(month + 1, 1);
      date.setDate(date.getDate() - 1);
    }
    this.setState({
      value: date.getTime(),
    });
  }

  _selectYear(year) {
    let { value } = this.state;
    let date = new Date(value);
    let monthBefore = date.getMonth(), dateBefore = date.getDate();
    date.setFullYear(year);
    //切换年时如果没有该日，例如2016-2-29切换到2015年
    if (date.getMonth() !== monthBefore || date.getDate() !== dateBefore) {
      date.setMonth(monthBefore + 1, 1);
      date.setDate(date.getDate() - 1);
    }
    this.setState({
      value: date.getTime(),
    });
  }

  _clickToday() {
    let { value } = this.state;
    let date = new Date(value);
    let today = new Date();
    date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
    value = date.getTime();
    this.setState({ value }, () => {
      let { onSelect } = this.props;
      onSelect(this.state.value);
    });
  }

  /**
   * 清除 时 分 秒 信息
   * @param ts
   * @returns {number}
   * @private
   */
  _clearHours(ts) {
    let date = new Date(ts);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }
}

export default DateCalendar;
