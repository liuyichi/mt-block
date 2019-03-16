import React, { Component, PropTypes } from 'react';
import Radio from './Radio';
import classNames from 'classnames';
import _ from 'lodash-compat';
import { isEmptyString, getSafetyString, noop, getComponent } from '../util/data';

export default class RadioGroup extends Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    mode: PropTypes.oneOf(['default', 'view']),
    value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]),
    defaultValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]),
    size: PropTypes.oneOf(['small', 'default']),
    disabled: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    required: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    validator: PropTypes.func,
    validation: PropTypes.string,
    emptyLabel: PropTypes.string,
    model: PropTypes.array.isRequired,
    onChange: PropTypes.func,
  };
  static defaultProps = {
    prefixCls: 'mt',     // 样式前缀
    mode: "default",     // 控件状态，可选值为 default|view 或者不设
    defaultValue: '',    // 默认选中的选项
    size: 'default',     // 控件大小
    disabled: false,     // 是否禁用
    required: false,     // 是否必填
    validator: null,     // 自定义校验事件
    validation: '',      // 校验失败后的提示
    emptyLabel: '',      // 设置当前值为空时显示的文本, 只在 mode 为 view 的情况下有效
    model: [],           // 指定的可选项
    onChange: noop,      // 变化时的回调函数
  };
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      valid: true,
      explain: '',
      model: props.model || [],
    };
  }
  componentDidMount() {
    //只在这个时候来初始值
    if (!isEmptyString(this.props.defaultValue) && isEmptyString(this.state.value)) {
      var value = getSafetyString(this.props.defaultValue);
      this.setState({value});
    }
  }

  componentWillReceiveProps(nextProps) {
    let { value, model } = this.state;
    if ('value' in nextProps && nextProps.value !== undefined) {
      value = getSafetyString(nextProps.value);
    }
    if ('model' in nextProps) {
      model = nextProps.model || [];
    }
    this.setState({
      value,
      model
    });
  }

  /**
   * 当选中的值变化时
   * @param option
   * @param isCheck
   * @param e
   * @private
   */
  _changeHandle = (option, e) => {
    const value = option.value;
    // 如果是通过 value 传进来选中的值得话,直接外派触发变化 否则的话变化本身的 state
    if (!('value' in this.props)) {
      this.setState({
        value
      });
    }
    this.props.onChange(value, e);
    _.defer(this.validate);
  };

  render() {
    const props = this.props;
    const { prefixCls, className, style, disabled, mode, emptyLabel, size, name, format } = props;
    const groupClassName = classNames({
      [className]: !!className,
      [`${prefixCls}-radio-group`]: true,
      [`${prefixCls}-radio-group-view`]: mode === 'view',
      [`${prefixCls}-radio-group-sm`]: size === 'small',
      'has-error': !this.state.valid,
    });
    const model = this.getOptions();
    if (mode === 'view') {
      let value = '';
      if (!isEmptyString(props.value) && model && model.length > 0) {
        let selected = model.find(option => props.value === option.value) || {};
        if (format && _.isFunction(format)) {
          value = getComponent(format, selected);
        } else {
          value = selected.label;
        }
      }
      return (
        <div className={groupClassName} style={style}>
          <label className="radio-group-label">{isEmptyString(value) ? emptyLabel : value}</label>
        </div>
      )
    }
    return (
      <div className={groupClassName} style={style}>
        {
          (model || []).map((option, index) => {
            let ctx = option.label;
            if (format && _.isFunction(format)) {
              ctx = getComponent(format, {...option, index});
            }
            return (
              <Radio key={option.value}
                     name={name}
                     className={`${prefixCls}-radio-group-item`}
                     disabled={disabled || option.disabled || false}
                     checked={this.state.value === option.value}
                     onChange={this._changeHandle.bind(this, option)}
                     size={size}>
                {ctx}
              </Radio>
          )})
        }
        {!this.state.valid && <div className={`has-explain ${prefixCls}-explain`}>{this.state.explain}</div>}
      </div>
    );
  }

  /**
   * 获取当前展示的可选项
   * @returns {Array}
   */
  getOptions = () => {
    const { model } = this.state;
    return (model || []).map(option => {
      if (typeof option === 'string') {
        return {
          value: option,
          label: option,
        }
      }
      return option;
    });
  };

  /**
   * 校验 外部校验时所有的都触发
   */
  validate = () => {
    const { mode, required, validation, validator } = this.props;
    if (mode === 'view') {
      !this.state.valid && this.setState({valid: true});
      return true;
    }
    var flag = true, value = this.state.value, explain = '';
    //非空校验和自定义校验
    if (required && isEmptyString(value)) {
      explain = validation || '';
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
    if (this.props.mode !== 'view') {
      let resetValue = getSafetyString(this.props.defaultValue);
      this.setState({value: resetValue, valid: true, explain: ''}, () => {
        this.props.onChange(resetValue);
      });
    }
  };
  /**
   * 清空异常状态  校验提示等
   */
  clear = () => {
    this.setState({valid: true, explain: ''});
  };
};
