import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import M from '../../util';
import { noop, isString, isFunction } from 'lodash-compat';
import strftime from 'strftime';
import { TimePanel } from '../panel';
import Trigger from '../../trigger';
import { IconPrefixCls as iconPrefixCls, isEmptyString } from '../../util/data';

//FIXME
let basicPrefixCls = 'time-picker';
let getCls = (prefix, basic, suffix) => {
  return [`${prefix}-${basic}`, basic].map((item) => `${item}${suffix}`).join(' ');
};
let fix2Digits = (s) => {
  return ('0' + s).slice(-2);
};

/**
 * 时间选择器
 * props.value
 * props.placeholder = ''
 * //显示的时间格式，基于strftime，'%H:%M'|'%H:%M:%S'
 * props.format = '%H:%M'
 * props.required = false //是否必须
 * props.disabled = false //是否不可用
 * props.disabledHours = () => { return [] } //禁用的 时 数组
 * props.disabledMinutes = (hour) => { return [] } //禁用的 分钟 数组
 * props.disabledSeconds = (hour, minute) => { return [] } //禁用的 秒 数组
 * props.hideDisabledOptions = false //是否隐藏禁止的选项
 * props.onChange
 * props.prefixCls = 'mt' //类前缀
 * props.getPopupContainer = () => document.body //弹出框的父级
 * props.validation = '' //必填校验时的提示
 * props.validator = (value) => { return '123'|others } //其他校验，如果返回有文本值的字符串，则校验不通过，该字符串为提示文本
 * props.mode = 'default' // 'default'|'view' 默认模式|查看模式
 * props.emptyLabel = '' //查看模式下值空时的显示
 *
 */
class TimePicker extends Component {
  static propTypes = {
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string,
    format: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    disabledHours: PropTypes.func,
    disabledMinutes: PropTypes.func,
    disabledSeconds: PropTypes.func,
    hideDisabledOptions: PropTypes.bool,
    onChange: PropTypes.func,
    prefixCls: PropTypes.string,
    getPopupContainer: PropTypes.func,
    validation: PropTypes.string,
    validator: PropTypes.func,
    mode: PropTypes.oneOf(['default', 'view']),
    emptyLabel: PropTypes.string,
    clearIcon: PropTypes.bool,
    size: PropTypes.oneOf(['default','small']),
    // 以下两种属性仅提供给Records.Complex使用，不对外开放，未来可能会去掉
    onFocus: PropTypes.func, //单击聚焦时，默认为单击输入框出现时间下拉时
    onBlur: PropTypes.func, //单击输入框之外的，默认为单击外部收起时间下拉时
  };

  static defaultProps = {
    placeholder: '',
    format: '%H:%M',
    required: false,
    disabled: false,
    disabledHours: noop,
    disabledMinutes: noop,
    disabledSeconds: noop,
    hideDisabledOptions: false,
    onChange: noop,
    prefixCls: 'mt',
    getPopupContainer: null,
    mode: 'default',
    emptyLabel: '',
    clearIcon: true,
    size: 'default',
  };

  constructor(props) {
    super(props);
    this.state = {
      value: this._formatTime(props.value || undefined),
      showList: false,
      valid: true,
    };
  }

  componentDidMount() {
    if (!isEmptyString(this.props.defaultValue) && isEmptyString(this.state.value)) {
      let value = this._formatTime(this.props.defaultValue || undefined);
      this.setState({ value: value });
    }
    this.hideList = (e) => {
      if (!this.state.showList) {
        return;
      }
      let $container = this.refs.container;
      let $trigger = this.refs.trigger && this.refs.trigger.getPopupDOMNode();
      if ($container && !$container.contains(e.target)
        && (!$trigger || !$trigger.contains(e.target))) {
        this._toggleList(false);
        //收起下拉时校验
        this._isValid();
      }
    };
    window.addEventListener('click', this.hideList);
  }

  componentWillReceiveProps(nextProps) {
    let { value } = this.state;
    if (nextProps.hasOwnProperty('value')) {
      value = nextProps.value || undefined;
    }
    this.setState({ value: this._formatTime(value) });
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.hideList);
  }

  render() {
    let { prefixCls, placeholder, required, disabled, className,
      format, disabledHours, disabledMinutes, disabledSeconds, hideDisabledOptions,
      mode, emptyLabel, getPopupContainer, clearIcon, size } = this.props;
    let { value, showList, valid, explain } = this.state;

    if (mode == 'view') {
      return (
        <div className={M.classNames(className, getCls(prefixCls, basicPrefixCls, ''), `${basicPrefixCls}-view`)}>
          {!value? emptyLabel : value}
        </div>
      );
    } else {
      //className
      let containerCls = getCls(prefixCls, basicPrefixCls, '');
      let showFieldCls = getCls(prefixCls, basicPrefixCls, '-show-field');
      let placeholderCls = getCls(prefixCls, basicPrefixCls, '-placeholder');
      let showValueCls = getCls(prefixCls, basicPrefixCls, '-show-value');
      let timeMarkCls = getCls(prefixCls, basicPrefixCls, '-time-mark');
      let clearBtnCls = getCls(prefixCls, basicPrefixCls, '-clear-btn');
      let explainCls = getCls(prefixCls, basicPrefixCls, '-explain');
      let selectionCls = getCls(prefixCls, basicPrefixCls, '-selection');

      let timePanelProps = {
        value, format, prefixCls, disabledHours,
        disabledMinutes, disabledSeconds, hideDisabledOptions,
        onSelect: this._selectTime.bind(this),
      };

      return (
        <div ref="container" className={M.classNames(className, containerCls, {
        [`${basicPrefixCls}-disabled`]: disabled,
        [`${basicPrefixCls}-required`]: required,
        [`${basicPrefixCls}-focused`]: showList,
        [`${basicPrefixCls}-sm`]: size === "small",
        [`${basicPrefixCls}-invalid`]: !valid,
        [`has-error`]: !valid,
      })}>
          <div className={showFieldCls}
               onClick={!disabled && this._toggleList.bind(this, true)}>
            {!value && placeholder && <div className={placeholderCls}>{placeholder}</div>}
            {value && <div className={showValueCls}>{value}</div>}
            <span className={M.classNames(timeMarkCls, `${iconPrefixCls} ${iconPrefixCls}-clock-o`)} />
            {!disabled && value && clearIcon && (
              <span className={M.classNames(clearBtnCls, `${iconPrefixCls} ${iconPrefixCls}-cross-circle`)}
                    onClick={this._deleteHandler.bind(this)} />
            )}
          </div>
          <Trigger ref="trigger"
                   prefixCls={prefixCls}
                   className={M.classNames(`${basicPrefixCls}__trigger`, {
                     'second-included': format.indexOf('%S') !== -1,
                   })}
                   visible={showList}
                   align={{
                     points: ['tl', 'bl'],
                     offset: [0, 2],
                     overflow: {
                       adjustX: 1,
                       adjustY: 1,
                     }
                   }}
                   equalTargetWidth={true}
                   getPopupContainer={getPopupContainer}
                   target={this._getRootTarget.bind(this)}>
            <div className={selectionCls}>
              <TimePanel {...timePanelProps} />
            </div>
          </Trigger>
          {!!explain && <div className={'has-explain ' + explainCls}>{explain}</div>}
        </div>
      );
    }
  }

  _onFocus() {
    let { onFocus } = this.props;
    onFocus && onFocus();
  }

  _onBlur() {
    let { onBlur } = this.props;
    onBlur && onBlur();
  }

  // 供Trigger使用, 获得当前DOM元素来定位弹框
  _getRootTarget() {
    return findDOMNode(this);
  };

  _selectTime(value) {
    this.setState({ value }, this._changeHandler);
  }

  _toggleList(on) {
    let { showList } = this.state;
    if (showList !== on) {
      this.setState({
        showList: on,
      });
    }
    if (on) {
      this.clear();
      this._onFocus();
    } else {
      this._onBlur();
    }
  }

  _deleteHandler(e) {
    this.setState({
      value: undefined,
      showList: false,
    }, this._isValid.bind(this, this._changeHandler));
    //阻止冒泡，防止触发点击事件
    e.stopPropagation();
  }

  _formatTime(value) {
    if (!value || value.length == 0) {
      return value;
    }
    return value.split(':').map(fix2Digits).join(':');
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
      let resetValue = this._formatTime(this.props.defaultValue || undefined);
      this.setState({
        value: resetValue,
        valid: true,
        explain: ""
      }, this._changeHandler);
    }
  }
}

export default TimePicker;
