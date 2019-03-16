import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class InputGroup extends Component {
  static propTypes = {
    size: PropTypes.oneOf(['default', 'small']),
    className: PropTypes.string
  };
  static defaultProps = {
    size: null,  // 设置输入框大小，可选值为 small 或者不设
    prefixCls: 'mt',
  };

  render() {
    let { size, prefixCls, className, style, children, domProps } = this.props;
    prefixCls += '-input-group';
    
    // small => sm
    const sizeCls = ({
        small: 'sm',
      })[size] || '';
    
    const classes = classNames({
      [prefixCls]: true,
      [`${prefixCls}-${sizeCls}`]: sizeCls,
      [className]: className,
    });
    return <div style={style} className={classes} {...domProps}>
      {children}
    </div>;
  }
}
