import React, { Component, PropTypes } from 'react';
import M from '../../util';
import { DatePanel, MonthPanel, YearPanel, TimePanel } from '../panel';
import strftime from 'strftime';
import { noop } from 'lodash-compat';
import { Button } from '../../index';
import { IconPrefixCls as iconPrefixCls } from '../../util/data';

//FIXME
let basicPrefixCls = 'date-time-calendar';
let getCls = (prefix, basic, suffix) => {
  return [`${prefix}-${basic}`, basic].map((item) => `${item}${suffix}`).join(' ');
};

/**
 * 日期时间日历，只能传日期禁用函数
 * props.value
 * props.format = '%Y-%m-%d %H:%S' // '%Y-%m-%d %H:%M'|'%Y-%m-%d %H:%M:%S'
 * props.showNow = true //是否显示【当前时间】按钮
 * props.prefixCls = 'mt' //类前缀
 * props.onSelect = () => {} //选中日期或时间时的回调
 * props.disabledDate = (ts) => { return true|false } //日期是否可用
 * props.onConfirm = () => {} //点击确认按钮的回调
 *
 */
class DateTimeCalendar extends Component {
  static propTypes = {
    value: PropTypes.number,
    showNow: PropTypes.bool,
    prefixCls: PropTypes.string,
    onSelect: PropTypes.func,
    disabledDate: PropTypes.func,
    format: PropTypes.string,
    onConfirm: PropTypes.func,
  };

  static defaultProps = {
    showNow: true,
    prefixCls: 'mt',
    format: '%Y-%m-%d %H:%M',
    onSelect: noop,
    disabledDate: noop,
    onConfirm: noop,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || this._initDateTime(Date.now(), props.format),
      showPanel: 'date', // 'date'|'month'|'year'|'time'
    };
  }

  componentWillReceiveProps(nextProps) {
    let { value } = this.state;
    if (nextProps.hasOwnProperty('value')) {
      value = nextProps.value || this._initDateTime(Date.now(), nextProps.format);
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
    let calendarFooterCls = getCls(prefixCls, basicPrefixCls, '-footer');

    //面板在DOM结构均存在，以防切面板的点击事件冒泡造成找不到目标节点
    return (
      <div className={M.classNames(className, calendarCls)}>
        <div className={M.classNames(calendarContentCls, { 'active': showPanel == 'time' })}>
          <div className={calendarHeaderCls}>{this._getTimeHeaderElement()}</div>
          <div className={calendarPanelCls}>{this._getTimePanelElement()}</div>
          <div className={calendarFooterCls}>{this._getTimeFooterElement()}</div>
        </div>
        <div className={M.classNames(calendarContentCls, { 'active': showPanel == 'date' })}>
          <div className={calendarHeaderCls}>{this._getDateHeaderElement()}</div>
          <div className={calendarPanelCls}>{this._getDatePanelElement()}</div>
          <div className={calendarFooterCls}>{this._getDateFooterElement()}</div>
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

  _getTimeHeaderElement() {
    let { prefixCls } = this.props;
    let { value } = this.state;
    let formatted = strftime('%Y-%m-%d', new Date(value)).split('-');
    return (
      <div className={`${prefixCls}-${basicPrefixCls}-time-header`}>
        {this._getYearButton(formatted[0], true)}
        {this._getMonthButton(formatted[1], true)}
        {this._getDateButton(formatted[2], true)}
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

  _getYearButton(year, disabled) {
    //className
    let { prefixCls } = this.props;
    let yearBtnCls = getCls(prefixCls, basicPrefixCls, '-year-btn');

    let showYearPanel = () => {
      this.setState({
        showPanel: 'year',
      });
    };
    return (
      <span className={M.classNames(yearBtnCls, {
        disabled,
      })} onClick={!disabled && showYearPanel}>
        <span>{year}</span>
        <span>年</span>
      </span>
    );
  }

  _getMonthButton(month, disabled) {
    //className
    let { prefixCls } = this.props;
    let monthBtnCls = getCls(prefixCls, basicPrefixCls, '-month-btn');

    let showMonthPanel = () => {
      this.setState({
        showPanel: 'month',
      });
    };
    return (
      <span className={M.classNames(monthBtnCls, {
        disabled,
      })} onClick={!disabled && showMonthPanel}>
        <span>{month}</span>
        <span>月</span>
      </span>
    );
  }

  /**
   * 没什么用处，为了和YearBtn/MonthBtn保持一致
   * @param date
   * @param disabled
   * @returns {XML}
   * @private
   */
  _getDateButton(date, disabled) {
    //className
    let { prefixCls } = this.props;
    let dateBtnCls = getCls(prefixCls, basicPrefixCls, '-date-btn');

    let showDatePanel = () => {
      this.setState({
        showPanel: 'date',
      });
    };
    return (
      <span className={M.classNames(dateBtnCls, {
        disabled,
      })} onClick={!disabled && showDatePanel}>
        <span>{date}</span>
        <span>日</span>
      </span>
    );
  }

  _getTimePanelElement() {
    let { prefixCls, format, disabledHours, disabledMinutes,
      disabledSeconds } = this.props;
    let { value } = this.state;

    let timeFormat = format.split(' ')[1];

    let props = {
      prefixCls,
      disabledHours, disabledMinutes, disabledSeconds,
      format: timeFormat,
      //处理value为时间字符串
      value: strftime(timeFormat, new Date(value)),
      onSelect: (v) => {
        let date = new Date(value);
        date.setHours(...v.split(':'));
        this.setState({
          value: date.getTime(),
        }, () => {
          let { onSelect } = this.props;
          onSelect(this.state.value);
        });
      },
    };

    return <TimePanel {...props} />;
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

  _getDateFooterElement() {
    let { prefixCls } = this.props;

    return (
      <div className={`${prefixCls}-${basicPrefixCls}-date-footer`}>
        {this._getNowButton()}
        {this._getConfirmButton()}
        {this._getDateTimeSwitcher()}
      </div>
    );
  }

  _getTimeFooterElement() {
    let { prefixCls } = this.props;

    return (
      <div className={`${prefixCls}-${basicPrefixCls}-time-footer`}>
        {this._getNowButton()}
        {this._getConfirmButton()}
        {this._getDateTimeSwitcher()}
      </div>
    );
  }

  _getDateTimeSwitcher() {
    let { prefixCls } = this.props;
    let { showPanel } = this.state;

    //className
    let switcherCls = getCls(prefixCls, basicPrefixCls, '-date-time-switcher');

    let switchPanel = (panel) => {
      this.setState({
        showPanel: panel,
      });
    };

    let content, panelToSwitch;

    switch(showPanel) {
      case 'date':
        content = '选择时间';
        panelToSwitch = 'time';
        break;
      case 'time':
        content = '选择日期';
        panelToSwitch = 'date';
        break;
    }

    return (
      <div className={switcherCls}
           onClick={switchPanel.bind(this, panelToSwitch)}>
        {content}
      </div>
    );
  }

  _getNowButton() {
    let { prefixCls, disabledDate, format } = this.props;
    //FIXME 当天是否禁用看format
    let now = new Date();
    if (format.indexOf('%S') == -1) {
      now.setSeconds(0, 0);
    } else {
      now.setMilliseconds(0);
    }
    let isDisabled = disabledDate(now.getTime());

    let clickToday = () => {
      let date = new Date();
      if (format.indexOf('%S') == -1) {
        date.setSeconds(0, 0);
      } else {
        date.setMilliseconds(0);
      }
      this.setState({
        value: date.getTime(),
      }, () => {
        let { onSelect } = this.props;
        onSelect(this.state.value);
      });
    };

    //className
    let nowBtnCls = getCls(prefixCls, basicPrefixCls, '-now-btn');

    return <div onClick={!isDisabled && clickToday.bind(this)}
                className={M.classNames(nowBtnCls, {
                  [`${basicPrefixCls}-now-btn-disabled`]: isDisabled,
                })}>现在</div>;
  }

  _getConfirmButton() {
    let { prefixCls } = this.props;
    //className
    let btnCls = getCls(prefixCls, basicPrefixCls, '-confirm-btn');

    let confirm = () => {
      let { onConfirm } = this.props;
      onConfirm(this.state.value);
    };
    return (
      <Button className={btnCls}
              type="primary" size="small"
              onClick={confirm.bind(this)}>确认</Button>
    );
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

  /**
   * 没有秒数的情况，清空秒和毫秒值
   * 有秒数的情况，清空毫秒值
   * @param ts
   * @param format
   * @returns {*}
   * @private
   */
  _initDateTime(ts, format) {
    let d = new Date(ts);
    if (format.indexOf('%S') == -1) {
      d.setSeconds(0, 0);
    } else {
      d.setMilliseconds(0);
    }
    return d.getTime();
  }
}

export default DateTimeCalendar;
