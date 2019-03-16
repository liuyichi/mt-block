import React from "react";
import U from '../util';

class Spin extends U.BaseComponent {
  static defaultProps = {
    prefixCls: 'mt',
    type: 'bounce-delay',
    masked: true,
  };
  render() {
    let { type, masked } = this.props;
    let prefixCls = this.props.prefixCls + '-spin';
    let className = this.classNames(
      `${prefixCls}`,
      `${prefixCls}_type-${type}`,
      masked && `${prefixCls}_masked`
    );
    return (
      <div className={className}>
        <i /><i /><i />
      </div>
    );
  }
}

export default Spin;
