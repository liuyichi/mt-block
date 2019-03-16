import React from "react";
import ReactDOM from 'react-dom';
import U from '../util';

class Modal extends U.BaseComponent {
  static defaultProps = {
    prefixCls: 'mt',
  };
  constructor(props) {
    super(props);
    Object.assign(this.state, {
      items: [],
    });
  }
  render() {
    let { items } = this.state;
    let prefixCls = this.props.prefixCls + '-modal';
    return (
      <div className={this.classNames(`${prefixCls}`)} hidden={items.length === 0}>
        {items.map(item => (
          <div
            key={item.id}
            className={`${prefixCls}_mask`}
            onClick={this.handleMaskClick.bind(this, item)}
          >
            <item.ModalContent onClose={this.remove.bind(this, item)} />
          </div>
        ))}
      </div>
    );
  }
  handleMaskClick(item, e) {
    if (item.onMaskClick != null && e.target === e.currentTarget) {
      item.onMaskClick(this.remove.bind(this, item));
    }
  }
  append(ModalContent, { onClose, onMaskClick }={}) {
    let id = modalId++;
    let resolve = null;
    let promise = new Promise(r => resolve = r);
    this.state.items.push({ id, ModalContent, onClose, onMaskClick, resolve });
    this.forceUpdate();
    promise.close = this.remove.bind(this, id);
    return promise;
  }
  remove(item, data) {
    (item.onClose || call)(() => {
      let { items } = this.state;
      let index = items.findIndex(x => x.id === item.id || x.id === item);
      if (index !== -1) {
        items.splice(index, 1)[0].resolve(data);
        this.forceUpdate();
      }
    }, data);
  }

  static prefixCls = undefined;
  static getContainer() {
    return document.body;
  }
  static show(ModalContent, config) {
    if (this.instance == null) {
      let $container = document.createElement('div');
      this.getContainer().appendChild($container);
      this.instance = ReactDOM.render(<Modal prefixCls={this.prefixCls} />, $container);
    }
    return this.instance.append(ModalContent, config);
  }
  static clear() {
    if (this.instance == null) return;
    return this.instance.setStateAsync({ items: [] });
  }
}

let modalId = 0;

let call = x => x();

export default Modal;
