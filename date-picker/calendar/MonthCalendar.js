import React, { Component, PropTypes } from 'react';
import M from '../../util';
import { MonthPanel, YearPanel } from '../panel';
import strftime from 'strftime';
import { noop } from 'lodash-compat';
import { IconPrefixCls as iconPrefixCls } from '../../util/data';

//FIXME
let basicPrefixCls = 'month-calendar';
let getCls = (prefix, basic, suffix) => {
  return [`${prefix}-${basic}`, basic].map((item) => `${item}${suffix}`).join(' ');
};

/**
 * 月份日历，只能传月份禁用函数
 * props.value
 * props.prefixCls = 'mt' //类前缀
 * props.onSelect = (v) => {} //选中月份时的回调
 * props.disabledDate = (ts) => { return true|false } //ts约定为当月1日0点
 *
 */
class MonthCalendar extends Component {
  static propTypes = {
    value: PropTypes.number,
    prefixCls: PropTypes.string,
    onSelect: PropTypes.func,
    disabledDate: PropTypes.func,
  };

  static defaultProps = {
    prefixCls: 'mt',
    onSelect: noop,
    disabledDate: noop,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || this._clearDates(Date.now()),
      showPanel: 'month', // 'month'|'year'
    };
  }

  componentWillReceiveProps(nextProps) {
    let { value } = this.state;
    if (nextProps.hasOwnProperty('value')) {
      value = nextProps.value || this._clearDates(Date.now());
    }
    this.setState({ value });
  }

  render() {
    let { prefixCls, className } = this.props;
    let { showPanel } = this.state;

    //className
    let calendarCls = getCls(prefixCls, basicPrefixCls, '');
    let calendarContentCls = getCls(prefixCls, basicPrefixCls, '-content');
    let calendarHeaderCls = getCls(prefixCls, basicPrefixCls, '-header');
    let calendarPanelCls = getCls(prefixCls, basicPrefixCls, '-panel');

    return (
      <div className={M.classNames(className, calendarCls)}>
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

  _getMonthPanelElement() {
    let { prefixCls } = this.props;
    let { value } = this.state;
    let props = {
      prefixCls, value,
      disabledMonth: this._disabledMonth.bind(this),
      onSelect: this._selectMonth.bind(this),
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
          showPanel: 'month',
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
    }, () => {
      let { onSelect } = this.props;
      onSelect(this.state.value);
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

  /**
   * 清除 时 分 秒 信息，设为当月1日
   * @param ts
   * @returns {number}
   * @private
   */
  _clearDates(ts) {
    let date = new Date(ts);
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }

  _disabledMonth(month) {
    let { disabledDate } = this.props;

    let { value } = this.state;
    let date = new Date(value);
    date.setMonth(month);

    return !!disabledDate && disabledDate(date.getTime());
  }
}

export default MonthCalendar;
