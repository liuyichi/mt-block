import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class ButtonGroup extends Component {
  static propTypes = {
    size: PropTypes.oneOf(['large', 'default', 'small']),
    className: PropTypes.string
  };
  static defaultProps = {
    size: null,  // 设置按钮大小，可选值为 small|large 或者不设
    prefixCls: 'mt',
  };

  render() {
    let { size, prefixCls, className, style, children, domProps } = this.props;
    prefixCls += '-btn-group';

    // large => lg
    // small => sm
    const sizeCls = ({
        large: 'lg',
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
