import { Component } from 'react';
import classNames from 'classnames';
import raceSafe from '../func/raceSafe';
import reactMixin from './reactMixin';
import valueLink from './valueLink';

class BaseComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.__windowEventListeners = [];
    this.__timers = [];
    this.__raceSafeStorage = {};
    this.__autoBind();
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
    // 移除全局事件监听器
    this.__windowEventListeners.forEach(args => window.removeEventListener(...args));

    // 销毁定时器
    this.__timers.forEach(timer => clearTimeout(timer));

    // 清空竞态安全的调用计数（组件被卸载时忽略未结束的异步操作）
    this.__raceSafeStorage = {};
  }

  /**
   * 对组件实例上的一个方法使用修饰器
   * @param {string} method 被修饰方法的名字
   * @param {function} decorator 使用的修饰器
   */
  decorate(method, decorator) {
    this[method] = decorator(this[method]) || this[method];
  }

  /**
   * Promise 模式的 React#setState
   * @param {object} newState 传给 React#setState 的参数
   * @returns {Promise|Promise<T>} 返回的 Promise 会在 setState 的 callback 被调用时完成
   */
  setStateAsync(newState) {
    return new Promise(resolve => this.setState(newState, resolve));
  }

  /**
   * 生成包括 props.className 的 CSS 类名
   * @param args classnames 库支持的参数
   */
  classNames(...args) {
    return classNames(this.props.className, ...args);
  }

  /**
   * 添加一个全局的事件监听器，并在组件被卸载时移除它，参数与 window.addEventListener 相同
   */
  windowEventListener(type, listener, useCapture) {
    window.addEventListener(...arguments);
    this.__windowEventListeners.push(arguments);
  }

  /**
   * 创建一个定时器，并在组件被卸载时销毁它，参数和返回值与 window.setTimeout 相同
   */
  setTimeout(func, delay=0, ...params) {
    this.__timers.push(setTimeout(func, delay, ...params));
    return this.__timers[this.__timers.length - 1];
  }

  /**
   * 使一个回调函数或一个 Promise 在竞态条件下安全
   * 即对于相同名字的回调／Promise，无论被调用／解决的时间早晚，只有最后一次传递给此函数的会生效
   */
  raceSafe(callbackOrPromise, name='') {
    return raceSafe(callbackOrPromise, name, this.__raceSafeStorage);
  }

  /**
   * 如果之前的 raceSafe 还未结束，取消它
   */
  raceSafeCancel(name) {
    this.raceSafe(() => {}, name);
  }

  /**
   * 已废弃，待移除
   */
  valueLink(...args) {
    console.warn('this.valueLink 已弃用，请尽快迁移至 M.valueLink');
    return valueLink(this, ...args);
  }

  /**
   * 绑定所有自定义方法的 this 到当前实例
   * @private
   */
  __autoBind() {
    let { prototype } = this.constructor;
    while (prototype !== BaseComponent.prototype) {
      for (let k of Object.getOwnPropertyNames(prototype)) {
        let v = this[k];
        if (typeof v === 'function' && emptyObject[k] === undefined) {
          this[k] = v.bind(this);
          this[k].unbound = v;
        }
      }
      prototype = Object.getPrototypeOf(prototype);
    }
  }
}

let emptyObject = {};

BaseComponent.Mixin = reactMixin;

export default BaseComponent;
