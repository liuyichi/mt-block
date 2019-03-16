import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class Checkbox extends Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    checked: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    defaultChecked: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    indeterminate: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'default']),
    label: PropTypes.any,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    domProps: PropTypes.object,
  };
  static defaultProps = {
    prefixCls: 'mt',        // 样式前缀
    type: 'checkbox',       // 默认的类型, 可选值为 checkbox|radio
    disabled: false,  // 是否被禁用
    defaultChecked: false,  // 初始是否被选中
    indeterminate: false,   // 只用来控制样式
    size: 'default',        // 控件大小
    label: '',              // 说明文字
    onChange() {},         // 变化时回调函数
    onClick: null,          // 点击时的回调函数
    onFocus: null,          // 获得焦点时的回调函数
    onBlur: null,           // 失去焦点时的回调函数
    domProps: {},           // 设置原生 input 的属性
  };
  constructor(props) {
    super(props);
    this.state = {
      checked: props.checked,
      focus: false
    };
  }
  componentDidMount() {
    //只在这个时候来初始值
    if (this.props.defaultChecked && !this.state.checked) {
      var checked = this.props.defaultChecked;
      this.setState({checked, focus: false});
    }
  }

  componentWillReceiveProps(nextProps) {
    if ('checked' in nextProps) {
      this.setState({
        checked: nextProps.checked,
      });
    }
  }

  // 当值改变时触发, 此时也是告知外层组件值变化的时机
  _changeHandle = (e) => {
    const checked = e.target.checked;
    this.setState({checked});
    this.props.onChange(e);
  };

  // 当点击时触发
  _clickHandle = (e) => {
    this.props.onClick && this.props.onClick(e);
  };

  // 当获得焦点时触发
  _focusHandle = (e) => {
    this.props.onFocus && this.props.onFocus(e);
  };

  // 当失去焦点时触发
  _blurHandle = (e) => {
    this.props.onBlur && this.props.onBlur(e);
  };

  render() {
    const props = { ...this.props };
    let { checked } = this.state;
    if (typeof checked === 'number') {
      checked = checked ? true : false;
    }

    const { className, style, name, type, size, disabled, indeterminate, label, domProps } = props;
    const prefixCls = props.prefixCls + "-" + type;
    const children = label || props.children;

    const wraperClassName = classNames({
      [className]: !!className,
      [`${prefixCls}`]: true,
      [`${prefixCls}-sm`]: size === 'small',
      [`${prefixCls}-disabled`]: disabled,
    });
    const checkboxClassName = classNames({
      [`${prefixCls}-checked`]: checked,
      [`${prefixCls}-indeterminate`]: indeterminate,
    });
    return (
      <label className={wraperClassName} style={style}>
        <span className={checkboxClassName}>
          <span className={`${prefixCls}-inner`} />
          <input
            {...domProps}
            name={name}
            type={type}
            disabled={!!disabled}
            checked={checked || false}
            className={`${prefixCls}-input`}
            onClick={this._clickHandle}
            onChange={this._changeHandle}
            onFocus={this._focusHandle}
            onBlur={this._blurHandle}
          />
        </span>
        {children !== undefined ? <span className={`${prefixCls}-label`}>{children}</span> : null}
      </label>
    );
  }
}
