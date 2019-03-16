import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { findDOMNode } from 'react-dom';
import { IconPrefixCls, filterObject, noop } from '../util/data';
// TODO  ICON 引入
//import Icon from '../icon';

export default class Button extends Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    shape: PropTypes.oneOf(['default', 'circle', 'circle-outline', 'no-outline']),
    type: PropTypes.string,
    size: PropTypes.oneOf(['large', 'default', 'small', 'xsmall']),
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    label: PropTypes.any,
    htmlType: PropTypes.oneOf(['submit', 'button', 'reset']),
    icon: PropTypes.string,
    iconRight: PropTypes.bool,
    onClick: PropTypes.func,
    domProps: PropTypes.object
  };
  static defaultProps = {
    prefixCls: 'mt',
    shape: 'default',         // 设置按钮形状，可选值为 default|circle|circle-outline|no-outline 或者不设
    type: null,          // 设置按钮类型，可选值为 default|primary|success|warning|danger 或者不设
    size: null,          // 设置按钮大小，可选值为 xsmall|small|default|large 或者不设
    loading: false,      // 设置按钮载入状态
    disabled: false,    // 设置禁用状态
    label: '',           // 按钮的文字
    htmlType: 'button',  // 设置 button 原生的 type 值，可选值请参考 HTML 标准
    icon: null,          // 设置按钮的图标类型
    iconRight: false,    // 设置图标在文字的右边与否
    onClick: noop,       // click 事件的 handler
    domProps: {},     // 需要传给 button 的原生属性
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: props.loading || false
    };
  }

  componentWillUnmount() {
    // 卸载后将延时器清掉
    if (this.clickedTimeout) {
      clearTimeout(this.clickedTimeout);
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  componentWillReceiveProps(props) {
    if ('loading' in props) {
      this.setState({loading: props.loading || false});
    }
  }

  // 添加点击后效果 并 触发响应事件
  _clickHandle = (e) => {
    const buttonNode = findDOMNode(this);
    this.clearButton();
    this.clickedTimeout = setTimeout(() => buttonNode.className += ` ${this.props.prefixCls}-btn-clicked`, 10);
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.clearButton(), 500);

    // 同时支持两种点击事件 优先clickAction, 第一个参数传出去可让 button 调用 loading 方法.
    this.props.onClick.call(this.props, this, e);
  };

  // chrome 上点击后按钮自动获得焦点
  _mouseUpHandle = (e) => {
    findDOMNode(this).blur();
    if (this.props.onMouseUp) {
      this.props.onMouseUp(e);
    }
  };

  render() {
    const { loading } = this.state;
    const { label, type, htmlType, icon, iconRight, style, shape, size, disabled, className, children, domProps } = this.props;

    const prefixCls = this.props.prefixCls + "-btn";
    // large => lg
    // small => sm
    const sizeCls = ({
        large: 'lg',
        small: 'sm',
        xsmall: 'xs'
      })[size] || '';

    const kids = label || children;

    const classes = classNames({
      [prefixCls]: true,
      [`${prefixCls}-${shape}`]: shape !== 'default',
      [`${prefixCls}-${type}`]: type,
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-${sizeCls}`]: sizeCls,
      [`${prefixCls}-mix-icon`]: kids && (!loading && icon),
      [`${prefixCls}-icon-only`]: !kids && icon,
      [`${prefixCls}-icon-right`]: kids && (loading || icon) && iconRight,
      [`${prefixCls}-loading`]: loading,
      [className]: !!className,
    });

    const iconType = loading ? 'loading' : icon;

    const iconDom = iconType && <i className={`${IconPrefixCls} ${IconPrefixCls}-${iconType}`.trim()}/>;

    return (
      <button style={style}
        {...domProps}
              type={htmlType || 'button'}
              className={classes}
              disabled={disabled}
              onMouseUp={this._mouseUpHandle}
              onClick={loading ? null : this._clickHandle}
              ref='button'>
        {!iconRight ? iconDom : null}
        <span>{kids}</span>
        {iconRight ? iconDom : null}
      </button>
    );
  }

  /**
   * 清除点击的效果
   */
  clearButton = () => {
    const button = findDOMNode(this);
    button.className = button.className.replace(` ${this.props.prefixCls}-btn-clicked`, '');
  };

  /**
   * 触发/关闭 按钮的 loading 转圈
   * @param flag 是否触发转圈,默认为true
   */
  loading = async (flag = true) => {
    await this.setStateAsync({loading: flag});
  };

  /**
   * Promise 模式的 React#setState
   * @param {object} newState 传给 React#setState 的参数
   * @returns {Promise|Promise<T>} 返回的 Promise 会在 setState 的 callback 被调用时完成
   */
  setStateAsync = (newState) => {
    return new Promise(resolve => this.setState(newState, resolve));
  };
};
