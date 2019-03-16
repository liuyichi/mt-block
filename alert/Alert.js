import React from "react";
import M from '../util';
import Icon from '../icon/Icon';

class Alert extends M.BaseComponent {
  static defaultProps = {
    prefixCls: 'mt',
    type: 'info',
    title: null,
    content: null,
    onClose: undefined,
  };
  constructor(props) {
    super(props);
    Object.assign(this.state, {
      items: [],
    });
  }
  render() {
    let { type, title, content, onClose } = this.props;
    let prefixCls = this.props.prefixCls + '-alert';
    return (
      <div className={this.classNames(`${prefixCls}`, `${prefixCls}_type-${type}`)}>
        {onClose && <span className={`${prefixCls}_close`} onClick={onClose}>{Icon.close}</span>}
        <div className={`${prefixCls}_icon`}>{Icon[type]}</div>
        <div className={`${prefixCls}_body`}>
          <div className={`${prefixCls}_title`}>{title || content}</div>
          {title && content && <div className={`${prefixCls}_content`}>{title && content}</div>}
        </div>
      </div>
    );
  }
}

export default Alert;
