import React from "react";
import U from '../util';
import ConsoleButton from '../console/ConsoleButton';
import Icon from '../icon/Icon';
import Modal from '../modal/Modal';

class Dialog extends U.BaseComponent {
  static defaultProps = {
    prefixCls: 'mt',
    title: null,
    content: null,
    buttons: [],
    style: 'normal',
    onClose: undefined
  };
  render() {
    let { title, content, buttons, style, onClose } = this.props;
    let prefixCls = `${this.props.prefixCls}-dialog`;
    content = React.isValidElement(content) && _.isFunction(content.type) ? React.cloneElement(content, { onClose }) : content;
    return (
      <div className={this.classNames(`${prefixCls}`, `${prefixCls}_${style}`)}>
        <div className={`${prefixCls}_title`} hidden={title == null}>
          {title}
          <span className={`${prefixCls}_close`} onClick={onClose}>{Icon.close}</span>
        </div>
        <div className={`${prefixCls}_content`}>{content}</div>
        <div className={`${prefixCls}_buttons`}>
          {buttons.map(({ label, type, action }, i) => (
            <ConsoleButton
              key={i}
              className={`${prefixCls}_button`}
              label={label}
              style={type}
              onClick={(action || onClose).bind(null, onClose)}
            />
          ))}
        </div>
      </div>
    );
  }

  static prefixCls = 'mt';
  static show(config) {
    let prefixCls = `${this.prefixCls}-dialog`;
    return Modal.show(props => (
      <div
        className={U.classNames(config.className, `${prefixCls}_wrapper`)}
        style={config.onMaskClick ? { pointerEvents: 'none' } : undefined}
      >
        <Dialog
          {...config}
          {...props}
          className={undefined}
        />
      </div>
    ), config);
  }
  static confirm(config) {
    if (typeof config === 'string') {
      config = { title: config };
    }
    return this.show({
      ...config,
      style: 'compact',
      title: <span>{Icon.question}{config.title}</span>,
      buttons: [{
        label: '取消',
        action: config.onCancel || (close => close(false)),
      }, {
        label: '确定',
        type: 'primary',
        action: config.onOk || (close => close(true)),
      }]
    });
  }
  static alert(config, type) {
    if (typeof config === 'string') {
      config = { title: config };
    }
    type = type || config.type || 'info';
    return this.show({
      ...config,
      style: 'compact',
      title: <span>{Icon[type]}{config.title}</span>,
      buttons: [{
        label: '确定',
        type: 'primary',
        action: config.onOk,
      }]
    });
  }
  static info(config) {
    return this.alert(config, 'info');
  }
  static success(config) {
    return this.alert(config, 'success');
  }
  static warning(config) {
    return this.alert(config, 'warning');
  }
  static error(config) {
    return this.alert(config, 'error');
  }
}

export default Dialog;
