import React, { Component, PropTypes } from 'react';
import Checkbox from './Checkbox';
import classNames from 'classnames';
import _ from 'lodash-compat';
import { isEmptyString, noop, toArray, getSafetyString, getComponent } from '../util/data';

export default class CheckboxGroup extends Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    mode: PropTypes.oneOf(['default', 'view']),
    value: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.number,
      PropTypes.string,
      PropTypes.bool,
    ]),
    defaultValue: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.number,
      PropTypes.string,
      PropTypes.bool,
    ]),
    disabled: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    required: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    validator: PropTypes.func,
    validation: PropTypes.string,
    showCheckall: PropTypes.bool,
    returnStringIfOnlyChild: PropTypes.bool,
    emptyLabel: PropTypes.string,
    model: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    maxLength: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    overLengthValidation: PropTypes.string,
    minLength: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    lessLengthValidation: PropTypes.string,
    disableIfOverLength: PropTypes.bool,
  };
  static defaultProps = {
    prefixCls: 'mt',     // 样式前缀
    mode: "default",     // 控件状态，可选值为 default|view 或者不设
    defaultValue: [],    // 默认选中的选项
    disabled: false,     // 是否禁用
    required: false,     // 是否必填
    validator: null,     // 自定义校验事件
    validation: '',      // 校验失败后的提示
    showCheckall: false, // 是否显示全选
    returnStringIfOnlyChild: true, // 如果只有一条可选项,那么返回 string 而不是 array
    emptyLabel: '',      // mode 为 view 的情况下, 当前值为空时显示的文本
    model: [],         // 指定的可选项
    onChange: noop,      // 变化时的回调函数
    maxLength: Infinity, // 最大可选个数
    minLength: 0, // 最小需要选择多少个
    lessLengthValidation: "低于最少需选个数",  // 少于最小需选个数时的报错信息
    overLengthValidation: "超过最大可选个数",  // 超过最大可选个数时的报错信息
    disableIfOverLength: false, // 超过最大个数后是否禁用未选中的项
  };
  constructor(props) {
    super(props);
    let model = this.getOptions(props.model);
    this.state = {
      model,
      value: this._getRenderValue(props.value, model),
      valid: true,
      explain: '',
    };
  }

  componentDidMount() {
    //只在这个时候来初始值
    let { defaultValue } = this.props;
    if (!isEmptyString(defaultValue) && this.state.value.length === 0) {
      var value = this._getRenderValue(defaultValue);
      this.setState({value});
    }
  }

  componentWillReceiveProps(nextProps) {
    let { value, model } = this.state;
    if ('value' in nextProps && nextProps.value !== undefined) {
      value = this._getRenderValue(nextProps.value);
    }
    if ('model' in nextProps) {
      model = this.getOptions(nextProps.model);
    }
    this.setState({
      value,
      model
    });
  }

  /**
   * 当选中的值变化时
   * @param option 操作的条目
   * @param isCheck
   * @param e
   * @private
   */
  _changeHandle = (option, e) => {
    let { onChange, returnStringIfOnlyChild, maxLength, disableIfOverLength } = this.props;
    let value = Array.from(toArray(this.state.value));
    const optionIndex = value.indexOf(option.value);
    if (optionIndex === - 1) {
      value.push(option.value);
    } else {
      value.splice(optionIndex, 1);
    }
    if (value.length > maxLength && disableIfOverLength) {
      return;
    }
    // 如果是通过 value 传进来选中的值得话,直接外派触发变化 否则的话变化本身的 state
    if (!('value' in this.props)) {
      this.setState({
        value
      });
    }
    // 只有一项时回传的数据
    if (returnStringIfOnlyChild && this.state.model.length === 1) {
      value = getSafetyString(value[0]);
    }
    onChange(value, e);
    _.defer(this.validate);
  };

  /**
   * 全选/全不选
   * @param isCheck 是否全选
   * @param e
   */
  _checkallHandler = (e) => {
    let { onChange, returnStringIfOnlyChild, maxLength, disableIfOverLength } = this.props;
    var isCheck = e.target.checked;
    let value = isCheck ? this.state.model.map(item => item.value) : [];
    // 如果是通过 value 传进来选中的值得话,直接外派触发变化 否则的话变化本身的 state
    if (!('value' in this.props)) {
      this.setState({
        value
      });
    }
    if (value.length > maxLength && disableIfOverLength) {
      return;
    }
    // 只有一项时回传的数据
    if (returnStringIfOnlyChild && this.state.model.length === 1) {
      value = getSafetyString(value[0]);
    }
    onChange(value, e);
    _.defer(this.validate);
  };

  // 返回一个数组, 筛选出有效的选中值
  _getRenderValue = (value, model) => {
    model = model || this.state.model || [];
    if (this._isReturnString(model) && !Array.isArray(value)) {
      // 如果说没有存在在可选项中, 那么置空
      value = [value];
    }
    if (!Array.isArray(value)) {
      value = [];
    }
    value = value.filter(v => model.some(x => x.value === v));
    return value;
  };
  // 是否符合返回字符串的条件
  _isReturnString = (model) => {
    model = model || this.state.model || [];
    return this.props.returnStringIfOnlyChild && model.length === 1;
  };

  render() {
    const props = this.props;
    const { prefixCls, className, style, disabled, mode, emptyLabel, size, name, showCheckall, disableIfOverLength, maxLength, format } = props;
    let { value, valid, model } = this.state;
    const groupClassName = classNames({
      [className]: !!className,
      [`${prefixCls}-checkbox-group`]: true,
      [`${prefixCls}-checkbox-group-sm`]: size === 'small',
      [`${prefixCls}-checkbox-group-view`]: mode === 'view',
      'has-error': !valid,
    });
    if (mode === 'view') {
      let showLabel = [];
      if (value && model.length > 0) {
        if (format && _.isFunction(format)) {
          showLabel = <div>
            {(model.filter(option => value.indexOf(option.value) !== -1) || []).map((v, k) => {
              return <div className={`${prefixCls}-checkbox-group-format`} key={k}>
                {getComponent(format, {...v, index: k})}
              </div>
            })}
          </div>
        } else {
          showLabel = (model.filter(option => value.indexOf(option.value) !== -1) || []).map(v => v.label).join();
        }
      }
      return (
        <div className={groupClassName} style={style}>
          <label className="checkbox-group-label">{_.isEmpty(showLabel) ? emptyLabel : showLabel}</label>
        </div>
      )
    }
    let disableUnSelectedItems = disableIfOverLength && value.length >= maxLength;
    let checkallContent;
    if (showCheckall) {
      const isCheckedAll = model.every(item => value.some(v => v === item.value));
      checkallContent = <Checkbox size={size}
                                  className={`${prefixCls}-checkbox-group-item ${prefixCls}-checkbox-checkall`}
                                  disabled={disabled || (!isCheckedAll && disableUnSelectedItems) || false}
                                  checked={isCheckedAll}
                                  onChange={this._checkallHandler}
                                  label="全选"
      />
    }
    return (
      <div className={groupClassName} style={style}>
        {checkallContent}
        {
          (model || []).map((option, index) => {
            let isSelected = (value || []).indexOf(option.value) !== -1, ctx = option.label;
            if (format && _.isFunction(format)) {
              ctx = getComponent(format, {...option, index});
            }
            return <Checkbox key={option.value}
                             size={size}
                             name={name}
                             className={`${prefixCls}-checkbox-group-item`}
                             disabled={disabled || (!isSelected && disableUnSelectedItems) || option.disabled || false}
                             checked={isSelected}
                             onChange={this._changeHandle.bind(this, option)}>
              {ctx}
              </Checkbox>
          })
        }
        {!this.state.valid && <div className={`has-explain ${prefixCls}-explain`}>{this.state.explain}</div>}
      </div>
    );
  }

  /**
   * 获取当前展示的可选项
   * @returns {Array}
   */
  getOptions = (model) => {
    return (model || this.state.model || []).map(option => {
      if (typeof option === 'string') {
        return {
          label: option,
          value: option,
        }
      }
      return option;
    });
  };

  /**
   * 校验 外部校验时所有的都触发
   */
  validate = () => {
    const { mode, required, validation, validator, maxLength, overLengthValidation, minLength, lessLengthValidation } = this.props;
    let { model = [], value = [] } = this.state;
    if (mode === 'view') {
      !this.state.valid && this.setState({valid: true});
      return true;
    }
    var flag = true, explain = '';
    //非空校验和自定义校验
    if (required && _.isEmpty(value)) {
      explain = validation || '';
      flag = false;
    }
    if (flag && value && model.length >= minLength && value.length < minLength) { // 低于最少需选
      explain = lessLengthValidation || '';
      flag = false;
    }
    if (flag && value && value.length > maxLength) { // 高于最多可选
      explain = overLengthValidation || '';
      flag = false;
    }
    //自定义校验
    if (flag && validator) {
      //自定义校验
      if (_.isFunction(validator)) {
        explain = validator(value);
        //返回字符串 不为空表示校验没通过 且返回错误提示
        if (!isEmptyString(explain)) {
          flag = false;
        } else {
          explain = '';
        }
      }
    }
    this.state.explain = explain;
    this.state.valid = flag;
    this.forceUpdate();
    return flag;
  };

  /**
   * 重置 如果设置过默认的值得话,回到默认值的状态
   */
  reset = () => {
    //清空数据 并清空校验状态
    let { mode, defaultValue, onChange } = this.props;
    let resetValue = this._getRenderValue(defaultValue);
    this._isReturnString(resetValue) && resetValue.length === 0 && (resetValue = '');
    if (mode !== 'view') {
      this.setState({value: resetValue, valid: true, explain: ''}, () => {
        onChange(resetValue);
      });
    }
  };
  /**
   * 清空异常状态  校验提示等
   */
  clear = () => {
    this.setState({valid: true, explain: ''});
  };
}
