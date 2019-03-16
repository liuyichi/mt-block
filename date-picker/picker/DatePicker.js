import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import M from '../../util';
import strftime from 'strftime';
import { DateCalendar, MonthCalendar, DateTimeCalendar } from '../calendar';
import { noop, isFunction, isString } from 'lodash-compat';
import Trigger from '../../trigger';
import { IconPrefixCls as iconPrefixCls, isEmptyString } from '../../util/data';

//FIXME css里的前缀，之后可能会改
let basicPrefixCls = 'date-picker';
let getCls = (prefix, basic, suffix) => {
  return [`${prefix}-${basic}`, basic].map((item) => `${item}${suffix}`).join(' ');
};

/**
 * 日期选择器
 * props.value
 * props.placeholder = ''
 * //显示的时间格式，基于strftime，分隔符不限，'%Y-%m'|'%Y-%m-%d'|'%Y-%m-%d %H:%M'|'%Y-%m-%d %H:%M:%S'
 * props.format = '%Y-%m-%d'
 * props.required = false //是否必须
 * props.disabled = false //是否不可用
 * props.disabledDate = (ts) => { return true|false } //日期是否可用，对于月份选择来说ts是当月1日0点
 * props.onChange
 * props.prefixCls = 'mt' //类前缀
 * props.getPopupContainer = () => document.body //弹出框的父级
 * props.validation = '' //必填校验时的提示
 * props.validator = (value) => { return '123'|others } //其他校验，如果返回有文本值的字符串，则校验不通过，该字符串为提示文本
 * props.mode = 'default' // 'default'|'view' 默认模式|查看模式
 * props.emptyLabel = '' //查看模式下值空时的显示
 *
 */
class DatePicker extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    placeholder: PropTypes.string,
    format: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    disabledDate: PropTypes.func,
    onChange: PropTypes.func,
    prefixCls: PropTypes.string,
    size: PropTypes.oneOf(['default','small']),
    getPopupContainer: PropTypes.func,
    validation: PropTypes.string,
    validator: PropTypes.func,
    mode: PropTypes.oneOf(['default', 'view']),
    emptyLabel: PropTypes.string,
    clearIcon: PropTypes.bool,
    // 以下三种属性仅提供给Records.Complex使用，不对外开放，未来可能会去掉
    onFocus: PropTypes.func, //单击聚焦时，默认为单击输入框出现日历下拉时
    onBlur: PropTypes.func, //单击输入框之外的，包括选中、单击外部等收起日历下拉时
    trigger: PropTypes.oneOf(['onSelect', 'onConfirm']), //何时触发onChange，只对带时间的日历有效
  };

  static defaultProps = {
    placeholder: '',
    format: '%Y-%m-%d',
    required: false,
    disabled: false,
    onChange: noop,
    prefixCls: 'mt',
    size: 'default',
    getPopupContainer: null,
    mode: 'default',
    emptyLabel: '',
    clearIcon: true,
    trigger: 'onSelect',
  };

  constructor(props) {
    super(props);

    this.state = {
      value: this._formatValue(props.value),
      showCalendar: false,
      valid: true,
      explain: '',
    };
  }

  componentDidMount() {
    if (!isEmptyString(this.props.defaultValue) && isEmptyString(this.state.value)) {
      var value = this._formatValue(this.props.defaultValue);
      this.setState({value: value});
    }
    this.hideCalendar = (e) => {
      if (!this.state.showCalendar) {
        return;
      }
      let $container = this.refs.container;
      let $trigger = this.refs.trigger && this.refs.trigger.getPopupDOMNode();
      if ($container && !$container.contains(e.target)
        && (!$trigger || !$trigger.contains(e.target))) {
        this._toggleCalendar(false);
        this._isValid();
      }
    };
    window.addEventListener('click', this.hideCalendar);
  }

  componentWillReceiveProps(nextProps) {
    let { value } = this.state;
    if (nextProps.hasOwnProperty('value')) {
      value = this._formatValue(nextProps.value);
    }
    this.setState({ value });
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.hideCalendar);
  }

  render() {
    let { prefixCls, size, format, placeholder, required, disabled,
      disabledDate, className, mode, emptyLabel, getPopupContainer, clearIcon, trigger } = this.props;
    let { value, showCalendar, valid, explain } = this.state;

    if (mode == 'view') {
      return (
        <div className={M.classNames(className, getCls(prefixCls, basicPrefixCls, ''), `${basicPrefixCls}-view`, size === "small" && `${basicPrefixCls}-sm`)}>
          {!value? emptyLabel : strftime(format, new Date(value))}
        </div>
      );
    } else {
      //className FIXME 每次render都会算一遍
      let containerCls = getCls(prefixCls, basicPrefixCls, '');
      let showFieldCls = getCls(prefixCls, basicPrefixCls, '-show-field');
      let placeholderCls = getCls(prefixCls, basicPrefixCls, '-placeholder');
      let showValueCls = getCls(prefixCls, basicPrefixCls, '-show-value');
      let calendarMarkCls = getCls(prefixCls, basicPrefixCls, '-calendar-mark');
      let clearBtnCls = getCls(prefixCls, basicPrefixCls, '-clear-btn');
      let explainCls = getCls(prefixCls, basicPrefixCls, '-explain');
      let calendarCls = getCls(prefixCls, basicPrefixCls, '-calendar');

      let calendarContent;
      let calendarProps = {
        value, prefixCls, disabledDate,
        onSelect: (v) => {
          this._selectHandler(v,
            this._toggleCalendar.bind(this, false));
        },
      };
      if (format.indexOf('%H') != -1) {
        Object.assign(calendarProps, {
          format,
          disabledDate: this._disabledDate.bind(this),
          disabledHours: this._disabledHours.bind(this),
          disabledMinutes: this._disabledMinutes.bind(this),
          disabledSeconds: this._disabledSeconds.bind(this),
          //确认时触发onChange并收起下拉
          onConfirm: (v) => {
            this._selectHandler(v,
              this._toggleCalendar.bind(this, false));
          },
        });
        switch(trigger) {
          case 'onSelect':
            //如果是选择时触发，则选择和确认时都触发
            Object.assign(calendarProps, {
              onSelect: this._selectHandler.bind(this),
            });
            break;
          case 'onConfirm':
            //如果是确认时触发，则选择时什么都不发生
            Object.assign(calendarProps, {
              onSelect: undefined,
            });
            break;
        }
        calendarContent = <DateTimeCalendar {...calendarProps} />;
      } else {
        if (format.indexOf('%d') == -1) {
          calendarContent = <MonthCalendar {...calendarProps} />;
        } else {
          calendarContent = <DateCalendar {...calendarProps} />;
        }
      }

      return (
        <div ref="container" className={M.classNames(className, containerCls, {
        [`${basicPrefixCls}-disabled`]: disabled,
        [`${basicPrefixCls}-required`]: required,
        [`${basicPrefixCls}-focused`]: showCalendar,
        [`${basicPrefixCls}-sm`]: size === "small",
        [`${basicPrefixCls}-invalid`]: !valid,
        [`has-error`]: !valid,
      })}>
          <div className={showFieldCls}
               onClick={!disabled && this._toggleCalendar.bind(this, true)}>
            {!value && placeholder && <div className={placeholderCls}>{placeholder}</div>}
            {value && <div className={showValueCls}>
              {strftime(format, new Date(value))}</div>}
            <span className={M.classNames(calendarMarkCls, `${iconPrefixCls} ${iconPrefixCls}-calendar`)} />
            {!disabled && value && clearIcon && (
              <span className={M.classNames(clearBtnCls, `${iconPrefixCls} ${iconPrefixCls}-cross-circle`)}
                    onClick={this._deleteHandler.bind(this)} />
            )}
          </div>
          <Trigger ref="trigger"
                   prefixCls={prefixCls}
                   className={`${basicPrefixCls}__trigger`}
                   visible={showCalendar}
                   align={{
                     points: ['tl', 'bl'],
                     offset: [0, 2],
                     overflow: {
                       adjustX: 1,
                       adjustY: 1,
                     }
                   }}
                   equalTargetWidth={false}
                   getPopupContainer={getPopupContainer}
                   target={this._getRootTarget.bind(this)}>
            <div className={calendarCls}>
              {calendarContent}
            </div>
          </Trigger>
          {!!explain && <div className={'has-explain ' + explainCls}>{explain}</div>}
        </div>
      );
    }
  }

  _formatValue(v) {
    if (!v) return undefined;
    return parseInt(v);
  }
  _onFocus() {
    let { onFocus } = this.props;
    onFocus && onFocus();
  }

  _onBlur() {
    let { onBlur } = this.props;
    onBlur && onBlur();
  }

  /**
   * 传入DateTimeCalendar
   * 用于日期面板的禁用展示
   * @param ts
   * @private
   */
  _disabledDate(ts) {
    let { disabledDate } = this.props;
    if (!disabledDate) {
      return false;
    }

    //如果这个时间戳当天都被禁用，这个日期才真的被禁用
    let date = new Date(ts);
    let isStartDayDisabled = false, isEndDayDisabled = false;
    date.setHours(0, 0, 0, 0);
    isStartDayDisabled = disabledDate(date.getTime());
    date.setHours(23, 59, 59, 0);
    isEndDayDisabled = disabledDate(date.getTime());

    return isStartDayDisabled && isEndDayDisabled;
  }

  /**
   * 传入DateTimeCalendar
   * 用于时间面板的禁用展示
   * @private
   */
  _disabledHours() {
    let { disabledDate, format } = this.props;
    if (!disabledDate) {
      return [];
    }
    let { value } = this.state;
    let date = new Date(value);

    let disabledHours = [];
    let hours = Array.from(new Array(24).keys());
    let minutes = Array.from(new Array(60).keys());
    let seconds = Array.from(new Array(60).keys());

    if (format.endsWith('%S')) {
      //时:分:秒，如果某个小时所有的分钟和秒数都被禁用，则该小时被禁用
      hours.forEach(h => {
        let enabled = minutes.some(m => {
          let secEnabled = seconds.some((t, s) => {
            date.setHours(h, m, s, 0);
            return !disabledDate(date.getTime());
          });
          return secEnabled;
        });
        if (!enabled) {
          disabledHours.push(h);
        }
      });
    } else if (format.endsWith('%M')) {
      //时:分，如果某个小时所有的分钟都被禁用，则该小时被禁用
      hours.forEach(h => {
        let enabled = minutes.some(m => {
          date.setHours(h, m, 0, 0);
          return !disabledDate(date.getTime());
        });
        if (!enabled) {
          disabledHours.push(h);
        }
      });
    } else {
      //时，如果某个小时被禁用
      hours.forEach(h => {
        date.setHours(h, 0, 0, 0);
        if (disabledDate(date.getTime())) {
          disabledHours.push(h);
        }
      });
    }

    return disabledHours;
  }

  /**
   * 传入DateTimeCalendar
   * 用于时间面板的禁用展示
   * @private
   */
  _disabledMinutes(hour) {
    let { disabledDate, format } = this.props;
    if (!disabledDate) {
      return [];
    }
    let { value } = this.state;
    let date = new Date(value);
    let minutes = Array.from(new Array(60).keys());
    let seconds = Array.from(new Array(60).keys());

    let disabledMinutes = [];
    if (format.endsWith('%S')) {
      //时:分:秒，如果某个分钟所有的秒数都被禁用，则该分钟被禁用
      minutes.forEach(m => {
        let enabled = seconds.some(s => {
          date.setHours(hour, m, s, 0);
          return !disabledDate(date.getTime());
        });
        if (!enabled) {
          disabledMinutes.push(m);
        }
      });
    } else {
      //时:分，如果某个分钟被禁用
      minutes.forEach(m => {
        date.setHours(hour, m, 0, 0);
        if (disabledDate(date.getTime())) {
          disabledMinutes.push(m);
        }
      });
    }

    return disabledMinutes;
  }

  /**
   * 传入DateTimeCalendar
   * 用于时间面板的禁用展示
   * @private
   */
  _disabledSeconds(hour, minute) {
    let { disabledDate } = this.props;
    if (!disabledDate) {
      return [];
    }
    let { value } = this.state;
    let date = new Date(value);
    let seconds = Array.from(new Array(60).keys());

    let disabledSeconds = [];
    //时:分:秒，如果某个秒数被禁用
    seconds.forEach(s => {
      date.setHours(hour, minute, s, 0);
      if (disabledDate(date.getTime())) {
        disabledSeconds.push(s);
      }
    });

    return disabledSeconds;
  }

  // 供Trigger使用, 获得当前DOM元素来定位弹框
  _getRootTarget() {
    return findDOMNode(this);
  };

  _toggleCalendar(on) {
    let { showCalendar } = this.state;
    if (showCalendar !== on) {
      this.setState({
        showCalendar: on,
      });
    }
    if (on) {
      this.clear();
      this._onFocus();
    } else {
      this._onBlur();
    }
  }

  _selectHandler(value, cb) {
    let { disabledDate, format } = this.props;
    if (disabledDate) {
      //如果选中的是被禁用的时间，则从当前日期0点开始向后查找到第一个没被禁用的时间点
      let date = new Date(value);
      if (disabledDate(date.getTime())) {
        let hours = Array.from(new Array(24).keys());
        let minutes = Array.from(new Array(60).keys());
        let seconds = Array.from(new Array(60).keys());
        let enabledHour, enabledMinute = 0, enabledSecond = 0;
        if (format.endsWith('%S')) {
          hours.find(h => {
            let hIndex = minutes.findIndex(m => {
              let mIndex = seconds.findIndex(s => {
                date.setHours(h, m, s, 0);
                let enabled = !disabledDate(date.getTime());
                if (enabled) {
                  enabledHour = h;
                  enabledMinute = m;
                  enabledSecond = s;
                }
                return enabled;
              });
              return mIndex != -1;
            });
            return hIndex != -1;
          });
        } else if (format.endsWith('%M')) {
          hours.find(h => {
            let hIndex = minutes.findIndex(m => {
              date.setHours(h, m, 0, 0);
              let enabled = !disabledDate(date.getTime());
              if (enabled) {
                enabledHour = h;
                enabledMinute = m;
              }
              return enabled;
            });
            return hIndex != -1;
          });
        } else {
          enabledHour = hours.find(h => {
            date.setHours(h, 0, 0, 0);
            return !disabledDate(date.getTime());
          });
        }
        date.setHours(enabledHour, enabledMinute, enabledSecond, 0);
        value = date.getTime();
      }
    }

    this.setState({
      value,
    }, this._isValid.bind(this, () => {
      this._changeHandler();
      cb && cb();
    }));
  }

  _deleteHandler(e) {
    this.setState({
      value: undefined,
      showCalendar: false,
    }, this._isValid.bind(this, this._changeHandler));
    //阻止冒泡，防止触发点击事件
    e.stopPropagation();
  }

  _changeHandler() {
    let { onChange } = this.props;
    onChange(this.state.value);
  }

  _isValid(callback) {
    let { required, validation, validator } = this.props;
    let { value } = this.state;

    let valid = true, explain = '';
    if (required && !value) {
      valid = false;
      explain = validation;
    } else if (isFunction(validator)) {
      let result = validator(value);
      if (result === false || (isString(result) && result.length > 0)) {
        valid = false;
        explain = result || '';
      }
    }
    this.setState({ valid, explain }, callback);

    return valid;
  }

  /**
   * 调用本组件的校验
   * @returns {*}
   */
  validate() {
    return this._isValid();
  }

  /**
   * 清空异常状态  校验提示等
   */
  clear() {
    this.setState({ valid: true, explain: '' });
  }

  /**
   * 重置控件，清空数据并清空校验状态
   */
  reset() {
    if (this.props.mode !== "view") {
      let resetValue = this._formatValue(this.props.defaultValue);
      this.setState({value: resetValue, valid: true, explain: ""}, () => {
        this.props.onChange(resetValue);
      });
    }
  }
}

export default DatePicker;
