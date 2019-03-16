import React from "react";
import ReactDOM from 'react-dom';
import U from '../util';
import Alert from '../alert/Alert';

class Toaster extends U.BaseComponent {
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
    let prefixCls = this.props.prefixCls + '-toaster';
    return (
      <div className={this.classNames(`${prefixCls}`)} hidden={items.length === 0}>
        {items.map(({ id, config }) => (
          <Alert
            key={id}
            onClose={this.remove.bind(this, id)}
            {...config}
            className={U.classNames(config.className, `${prefixCls}_alert`)}
          />
        ))}
      </div>
    );
  }
  append(config) {
    let id = toasterId++;
    let resolve = null;
    let promise = new Promise(r => resolve = r);
    let { duration, type } = config;
    if (duration === undefined) {
      duration = type === 'success' ? 1.2 : type === 'error' ?  3 : 2;
    }
    let timer = duration !== 0 ? this.setTimeout(this.remove, duration * 1000, id) : null;
    this.state.items.push({ id, timer, config, resolve });
    this.forceUpdate();
    return promise;
  }
  remove(id, data) {
    let { items } = this.state;
    let index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      let item = items.splice(index, 1)[0];
      global.clearTimeout(item.timer);
      item.resolve(data);
      this.forceUpdate();
    }
  }

  static prefixCls = undefined;
  static getContainer() {
    return document.body;
  }
  static show(config) {
    if (this.instance == null) {
      let $container = document.createElement('div');
      this.getContainer().appendChild($container);
      this.instance = ReactDOM.render(<Toaster prefixCls={this.prefixCls} />, $container);
    }
    return this.instance.append(config);
  }
  static info(title, content) {
    return this.show({ type: 'info', title, content });
  }
  static success(title, content) {
    return this.show({ type: 'success', title, content });
  }
  static warning(title, content) {
    return this.show({ type: 'warning', title, content });
  }
  static error(title, content) {
    return this.show({ type: 'error', title, content });
  }
}

let toasterId = 0;

export default Toaster;
