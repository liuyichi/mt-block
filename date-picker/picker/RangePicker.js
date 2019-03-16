import React, { Component, PropTypes } from 'react';
import M from '../../util';
import _ from 'lodash-compat';
import { noop, isFunction, isString, isArray } from 'lodash-compat';
import DatePicker from './DatePicker';
import { Checkbox } from '../../checkbox';
import strftime from 'strftime';

let basicPrefixCls = 'range-picker';
let getCls = (prefix, basic, suffix) => {
  return [`${prefix}-${basic}`, basic].map((item) => `${item}${suffix}`).join(' ');
};

/**
 * 日期范围选择器
 * props.value
 * props.placeholder = ['', '']
 * //显示的时间格式，基于strftime，分隔符不限，'%Y-%m'|'%Y-%m-%d'
 * props.format = '%Y-%m-%d'
 * props.required = false //是否必须
 * props.disabled = false //是否不可用
 * props.showUpToNow = false //是否显示【至今】
 * props.onChange
 * props.prefixCls = 'mt' //类前缀
 * props.getPopupContainer = () => document.body //弹出框的父级
 * props.validation = ['', ''] //必填校验时的提示
 * props.validator = (value) => { return '123'|others } //其他校验，如果返回false或者有文本值的字符串，则校验不通过，该字符串为提示文本
 * props.disabledTime = ([startTs, endTs, isUpToNow], 'start'|'end') => { return true|false }
 * props.mode = 'default' // 'default'|'view' 默认模式|查看模式
 * props.emptyLabel = '' //查看模式下值空时的显示
 *
 */
class RangePicker extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    defaultValue: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    placeholder: PropTypes.arrayOf(PropTypes.string),
    format: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    showUpToNow: PropTypes.bool,
    onChange: PropTypes.func,
    prefixCls: PropTypes.string,
    size: PropTypes.oneOf(['default', 'small']),
    getPopupContainer: PropTypes.func,
    validator: PropTypes.func,
    validation: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    disabledTime: PropTypes.func,
    mode: PropTypes.oneOf(['default', 'view']),
    emptyLabel: PropTypes.string,
    clearIcon: PropTypes.bool,
  };

  static defaultProps = {
    placeholder: ['', ''],
    validation: ['', ''],
    format: '%Y-%m-%d',
    required: false,
    disabled: false,
    showUpToNow: false,
    onChange: noop,
    prefixCls: 'mt',
    size: 'default',
    getPopupContainer: null,
    mode: 'default',
    emptyLabel: '',
    clearIcon: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      value: this._formatValue(props.value) || this._getDefaultValue(props),
      valid: true,
    };
  }
  componentDidMount() {
    if (!_.isEmpty(this.props.defaultValue) && _.isEmpty(this.state.value)) {
      var value = this._formatValue(this.props.defaultValue) || this._getDefaultValue(this.props);
      this.setState({value: value});
    }
  }

  componentWillReceiveProps(nextProps) {
    let { value } = this.state;
    if(nextProps.hasOwnProperty('value') && nextProps.value !== undefined){
      value = this._formatValue(nextProps.value) || this._getDefaultValue(nextProps);
    }
    this.setState({ value });
  }

  render() {
    let { prefixCls, size, disabled, required, format, placeholder,
      showUpToNow, className, validation, mode, emptyLabel, getPopupContainer, clearIcon } = this.props;
    let { valid, value, explain } = this.state;

    if (mode == 'view') {
      let result = '';
      if (value[0]) {
        result += strftime(format, new Date(value[0]));
      }
      if (value[1]) {
        result += ' - ' + strftime(format, new Date(value[1]));
      } else if (value[2]) {
        result += ' - ' + '至今';
      }
      return (
        <div className={M.classNames(className, getCls(prefixCls, basicPrefixCls, ''), `${basicPrefixCls}-view`, size === "small" && `${basicPrefixCls}-sm`)}>
          {!result? emptyLabel : result}
        </div>
      );
    } else {
      //className
      let containerCls = getCls(prefixCls, basicPrefixCls, '');
      let datePartCls = getCls(prefixCls, basicPrefixCls, '-date-part');
      let pickerWrapperCls = getCls(prefixCls, basicPrefixCls, '-date-picker-wrapper');
      let delimiterCls = getCls(prefixCls, basicPrefixCls, '-delimiter');
      let upToNowCls = getCls(prefixCls, basicPrefixCls, '-up-to-now-part');
      let explainCls = getCls(prefixCls, basicPrefixCls, '-explain');

      let sPlaceholder = placeholder[0] || '';
      let ePlaceholder = placeholder[1] || '';

      let sValidation, eValidation;

      if (isString(validation)) {
        sValidation = eValidation = validation;
      } else {
        sValidation = validation[0] || '';
        eValidation = validation[1] || '';
      }

      let sValue = value[0] || undefined;
      let eValue = value[1] || undefined;

      return (
        <div ref="container" className={M.classNames(className, containerCls, {
        [`${basicPrefixCls}-disabled`]: disabled,
        [`${basicPrefixCls}-required`]: required,
        [`${basicPrefixCls}-sm`]: size === "small",
        [`${basicPrefixCls}-invalid`]: !valid && explain,
        [`has-error`]: !valid && explain,
        [`${prefixCls}-${basicPrefixCls}-up-to-now ${basicPrefixCls}-up-to-now`]: showUpToNow,
        [`${basicPrefixCls}-up-to-now--on`]: showUpToNow && value[2],
      })}>
          <div className={datePartCls}>
            <div className={`${pickerWrapperCls} start-date-picker-wrapper`}>
              <DatePicker ref="sDate" format={format}
                          size={size}
                          mode={mode} emptyLabel={emptyLabel}
                          clearIcon={clearIcon}
                          value={sValue}
                          required={required}
                          validation={sValidation}
                          disabled={disabled}
                          placeholder={sPlaceholder}
                          getPopupContainer={getPopupContainer}
                          onChange={this._selectStartDate.bind(this)}
                          disabledDate={format.indexOf('%d') == -1? this._disabledStartMonth.bind(this)
                            : this._disabledStartDate.bind(this)} />
            </div>
            <div className={delimiterCls}>-</div>
            <div className={`${pickerWrapperCls} end-date-picker-wrapper`}>
              <DatePicker ref="eDate" format={format}
                          size={size}
                          mode={mode} emptyLabel={emptyLabel}
                          clearIcon={clearIcon}
                          value={eValue}
                          required={!value[2] && required}
                          validation={eValidation}
                          disabled={!!value[2] || disabled}
                          placeholder={ePlaceholder}
                          getPopupContainer={getPopupContainer}
                          onChange={this._selectEndDate.bind(this)}
                          disabledDate={format.indexOf('%d') == -1? this._disabledEndMonth.bind(this)
                            : this._disabledEndDate.bind(this)} />
            </div>
          </div>
          {showUpToNow && <Checkbox className={upToNowCls}
                                    checked={value[2]}
                                    disabled={disabled}
                                    onChange={this._toggleUpToNow.bind(this)}>至今</Checkbox>}
          {!!explain && <div className={'has-explain ' + explainCls}>{explain}</div>}
        </div>
      );
    }
  }

  _toggleUpToNow(e) {
    let { value } = this.state;
    let v = e.target.checked;
    if (v) {
      value[1] = undefined;
    }
    value[2] = v;
    this.setState({ value }, () => {
      this._isValid(this._changeHandler.bind(this));
    });
  }

  _selectStartDate(v) {
    let { format } = this.props;
    let { value } = this.state;

    let newV = v;
    //处理年月的情况
    if (v && format.indexOf('%d') == -1) {
      let date = new Date(v);
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      newV = date.getTime();
    }

    value[0] = newV;
    this.setState({ value }, () => {
      this._isValid(this._changeHandler.bind(this));
    });
  }

  _selectEndDate(v) {
    let { format } = this.props;
    let { value } = this.state;

    if (v) {
      let date = new Date(v);
      //处理年月的情况
      if (format.indexOf('%H') == -1) {
        if (format.indexOf('%d') == -1) {
          //FIXME 处理为下月1日，再向前拨一秒
          date.setMonth(date.getMonth() + 1, 1);
          date.setHours(0, 0, 0, 0);
          date.setSeconds(date.getSeconds() - 1);
        } else {
          //FIXME 处理为翌日0点，再向前拨一秒
          date.setDate(date.getDate() + 1);
          date.setHours(0, 0, 0, 0);
          date.setSeconds(date.getSeconds() - 1);
        }
      }
      value[1] = date.getTime();
    } else {
      value[1] = v;
    }

    this.setState({ value }, () => {
      this._isValid(this._changeHandler.bind(this));
    });
  }

  _disabledStartDate(v) {
    let { disabledTime, format } = this.props;
    let { value } = this.state;

    let isDisabled = false;
    //如果计算日期比结束日期更大则禁用
    if (value[1]) {
      let eDate = new Date(value[1]);

      //消除不显示的时间后缀的影响
      if (format.endsWith('%S')) {
        eDate.setMilliseconds(0);
      } else if (format.endsWith('%M')) {
        eDate.setSeconds(0, 0);
      } else if (format.endsWith('%H')) {
        eDate.setMinutes(0, 0, 0);
      } else if (format.endsWith('%d')) {
        eDate.setHours(0, 0, 0, 0);
      }

      isDisabled = v > eDate.getTime();
    }

    return (!!disabledTime && disabledTime([v, value[1], value[2]], 'start')) || isDisabled;
  }

  _disabledEndDate(v) {
    let { disabledTime, format } = this.props;
    let { value } = this.state;

    let isDisabled = false;
    //如果计算日期比开始日期更小则禁用
    if (value[0]) {
      let sDate = new Date(value[0]);

      //消除不显示的时间后缀的影响
      if (format.endsWith('%S')) {
        sDate.setMilliseconds(0);
      } else if (format.endsWith('%M')) {
        sDate.setSeconds(0, 0);
      } else if (format.endsWith('%H')) {
        sDate.setMinutes(0, 0, 0);
      } else if (format.endsWith('%d')) {
        sDate.setHours(0, 0, 0, 0);
      }

      isDisabled = v < sDate.getTime();
    }

    return (!!disabledTime && disabledTime([value[0], v, value[2]], 'end')) || isDisabled;
  }

  _disabledStartMonth(v) {
    let { disabledTime } = this.props;
    let { value } = this.state;

    let isDisabled = false;
    if (value[1]) {
      let eDate = new Date(value[1]);
      let eYear = eDate.getFullYear(), eMonth = eDate.getMonth();
      let sDate = new Date(v);
      let sYear = sDate.getFullYear(), sMonth = sDate.getMonth();
      isDisabled = sYear > eYear || (sYear == eYear && sMonth > eMonth)
        || isDisabled;
    }

    return (!!disabledTime && disabledTime([v, value[1], value[2]], 'start')) || isDisabled;
  }

  _disabledEndMonth(v) {
    let { disabledTime } = this.props;
    let { value } = this.state;

    let isDisabled = false;
    if (value[0]) {
      let date = new Date(value[0]);
      let sYear = date.getFullYear(), sMonth = date.getMonth();
      let eDate = new Date(v);
      let eYear = eDate.getFullYear(), eMonth = eDate.getMonth();
      isDisabled = eYear < sYear || (eYear == sYear && eMonth < sMonth)
        || isDisabled;
    }

    return (!!disabledTime && disabledTime([value[0], v, value[2]], 'end')) || isDisabled;
  }

  _changeHandler() {
    let { onChange, showUpToNow } = this.props;
    let { value } = this.state;
    //根据是否显示至今，决定传入外部onChange事件的参数
    let filterValue = showUpToNow? value : value.slice(0, 2);
    //FIXME 是否应该对值做处理，空值就传空数组
    onChange(filterValue);
  }

  _isValid(callback) {
    let { sDate, eDate } = this.refs;

    let valid = true, explain = '';

    //确定DatePicker是否通过校验
    let isSDateValid = sDate.validate();
    valid = valid && isSDateValid;
    let isEDateValid = eDate.validate();
    valid = valid && isEDateValid;

    //通过了DatePicker自身的校验后，再校验整体。
    //FIXME 整体校验时，点击开始/结束时间并不会清除校验状态，如果需要和其他组件保持一致的话需要想办法处理
    if (valid) {
      let { validator } = this.props;
      let { value } = this.state;
      if (isFunction(validator)) {
        let result = validator(value);
        if (result === false || (isString(result) && result.length > 0)) {
          valid = false;
          explain = result || '';
        }
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
    let { sDate, eDate } = this.refs;
    sDate.clear();
    eDate.clear();
    this.setState({ valid: true, explain: '' });
  }
  /**
   * 重置控件，清空数据并清空校验状态
   */
  reset() {
    if (this.props.mode !== "view") {
      let resetValue = this._formatValue(this.props.defaultValue) || this._getDefaultValue(this.props);
      this.setState({value: resetValue, valid: true, explain: ""}, () => {
        this.props.onChange(resetValue);
      });
    }
  }

  /**
   * 默认值，如果有显示至今
   * @returns {*}
   * @private
   */
  _getDefaultValue(props) {
    if (props.showUpToNow) {
      return [undefined, undefined, false];
    } else {
      return [undefined, undefined];
    }
  }

  /**
   * 数组复制
   * @param v
   * @returns {*}
   * @private
   */
  _formatValue(v) {
    return isArray(v)? v.slice().map(item => parseInt(item)) : v;
  }
}

export default RangePicker;
