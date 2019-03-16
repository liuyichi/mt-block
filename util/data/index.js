import React from 'react';

// 键盘事件
export { KEYCODE as KEYCODE } from './KeyCode';
export { numberToEn as numberToEn } from './numberToEn';
export { isSelectServerMode as isSelectServerMode,
  isSelectDefinedBothField as isSelectDefinedBothField,
  getSelectModel as getSelectModel,
  getSelectIdField as getSelectIdField,
  getSelectShowField as getSelectShowField,
  buildSelectData as buildSelectData,
  buildMultiSelectData as buildMultiSelectData,
} from './formatSelect';

export const IconPrefixCls = 'block-icon';

// 判断是否是空串
export const isEmptyString = (value) => {
  return value === null || value === undefined || value === '';
};

// 获取安全的字符串, 如果是 null || undefined 则返回 ''
export function getSafetyString(value) {
  if (isEmptyString(value)) {
    return '';
  }
  return value;
}

// 获取字符串, 把数字/数组等非字符串的转成string
export function getString(value) {
  return '' + getSafetyString(value);
}

// 生成正则表达式
export function getPattern(pattern) {
  if (!pattern) {
    return null;
  }
  if (_.isString(pattern)) {
    return new RegExp(pattern);
  }
  return pattern;
}

// 转成数组
export function toArray(value) {
  let ret = value;
  if (isEmptyString(value)) {
    ret = [];
  } else if (!Array.isArray(value)) {
    ret = [value];
  }
  return ret;
}

// 阻止默认事件
export function preventDefaultEvent(e) {
  e.preventDefault();
}

// 阻止冒泡
export function stopPropagationEvent(e) {
  e.stopPropagation();
  if (e.nativeEvent.stopImmediatePropagation) {
    e.nativeEvent.stopImmediatePropagation();
  }
}

// 判断是否是方法
export function typeOf(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}
export function isFunction(value) {
  return typeOf(value) == 'Function';
}
export function isObject(value) {
  return typeOf(value) == 'Object';
}
export function isArray(value) {
  return typeOf(value) == 'Array';
}
export function isString(value) {
  return typeOf(value) == 'String';
}

// 返回一个空方法
export function noop() {
}

export function filterObject(obj = {}, parts = []) {
  let result = {};
  Object.keys(obj).forEach((k) => {
    if (parts.indexOf(k) !== -1) {
      result[k] = obj[k];
    }
  });
  return result;
}

// 是否是window
export function isWindow(obj) {
  /* eslint no-eq-null: 0 */
  /* eslint eqeqeq: 0 */
  return obj != null && obj == obj.window;
}


/**
 * 获取一个组件
 * @param Component 可能是 string/jsx/ReactClass
 */
export function getComponent(Component, props, ref) {
  if (!Component) {
    return null;
  }
  if (isFunction(Component)) {
    return Component.prototype.render ? <Component ref={ref} {...props} /> : Component(props);
  }
  return Component;
}
