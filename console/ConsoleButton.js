
import React from 'react';
import M from '../util';
import { Button } from '../button';

class ConsoleButton extends M.BaseComponent {
  static defaultProps = {
    prefixCls: 'mt',
    data: undefined,
    onClick: undefined,  // 事件操作，function (data, model) { }
    disabled: undefined,
  };
  constructor(props) {
    super(props);
    Object.assign(this.state, {
      loading: false,
    });
  }
  componentWillUnmount() {
    this._isMounted = true;
  }
  render() {
    let { code, style, data, hideIf, disabled, Component=Button,
      requireData, linkTo, linkTarget } = this.props;
    let { loading } = this.state;
    let prefixCls = this.props.prefixCls + '-console-button';
    if (hideIf != null && hideIf(data, this.props)) return null;
    let item = Array.isArray(data) ? data[data.length - 1] : data;
    disabled = disabled || requireData && item == null;
    let element = (
      <Component
        loading={loading}
        {...this.props}
        className={this.classNames(prefixCls, `${prefixCls}_${code}`)}
        type={style}
        style={undefined}
        disabled={disabled}
        onClick={this.handleClick}
        action={undefined}
      />
    );
    if (!disabled && linkTo != null) {
      let url = M.template(M.HashPrefix.format(linkTo), item);
      element = <a href={url} target={linkTarget || '_self'}>{element}</a>;
    }
    return element;
  }
  async handleClick() {
    let { onClick, data } = this.props;
    if (onClick == null) return null;
    let ret = onClick(data, this.props, ...arguments);
    if (ret != null && typeof ret.then === 'function') {
      await this.setStateAsync({ loading: true });
      try {
        await ret;
      } finally {
        if (!this._isMounted) {
          this.setStateAsync({ loading: false });
        }
      }
    }
  }
}

export default ConsoleButton;
