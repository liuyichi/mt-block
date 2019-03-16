import { isEmptyString, getSafetyString } from './index';
import M from '../../util';

/**
 * 主要是提供对 select 系列组件的数据做处理时的函数
 * 推荐使用 idField, showField 的数据格式, 兼容 label, value 形式
 */
export function getSelectModel(field = {}) {
  return (field.conf || {}).model || field.model || {};
}
export function getSelectIdField(field = {}) {
  if (_.isEmpty(field)) {
    return 'value';
  }
  var model = getSelectModel(field);
  return model.idField || "value";
}
export function getSelectShowField(field = {}) {
  if (_.isEmpty(field)) {
    return 'label';
  }
  var model = getSelectModel(field);
  return model.showField || "label";
}
export function isSelectDefinedBothField(field = {}) {
  if (_.isEmpty(field)) {
    return false;
  }
  var model = getSelectModel(field);
  return model.idField && model.showField;
}

// select 是否 server 模式 即idField
// showField 可能并不存在
export function isSelectServerMode(field = {}, data) {
  if (_.isEmpty(field)) {
    return;
  }
  var model = getSelectModel(field);
  return model.idField && !isEmptyString(data[model.idField]);
}
// select 是否 local 模式 即label,value都存在
export function isSelectLocalMode(field = {}, data) {
  if (_.isEmpty(field)) {
    return;
  }
  return data.hasOwnProperty('value') && data.hasOwnProperty('label');
}

/**
 * 单选情况下的数据处理
 * @param field  用来处理多选的数据时传入的 {model}
 * @param data   具体的数据: bill 处理 defaultValue, select 处理 props.value
 * @param warn   如果是 label, value 模式是否需要报警提示
 * @returns {Object}  返回处理好的数据
 */
export function buildSelectData(field = {}, data, warn) {
  if (_.isEmpty(field)) {
    return;
  }
  var model = getSelectModel(field);
  let renderData = {};
  var needWarn = false;
  if (data) {
    if (typeof data === 'string') {
      !needWarn && (needWarn = true);
      renderData = {
        "value": data,
        "label": data
      };
    } else if ( _.isObject(data)) {
      if (isSelectLocalMode(field, data)) {
        !needWarn && model.idField && model.idField !== "value" && (needWarn = true);
        renderData = data;
      } else {
        renderData = Object.assign({}, data, {
          "value": getSafetyString(data[model.idField]),
          "label": model.showTpl ? M.template(model.showTpl, data) : getSafetyString(data[model.showField])
        });
      }
    }
    warn && needWarn && console.warn((field.code ? field.code + "数据格式问题, " : "") + 'select/treeSelect 类型组件支持的数据格式 {label:"", value:""} 将被废弃, 请使用 {${showFiled}:"", ${idField}:"", ...otherCode} 代替');
  }
  return renderData;
}
/**
 * 多选情况下的数据处理
 * @param field  用来处理多选的数据时传入的 {model}
 * @param data   具体的数据: bill 处理 defaultValue, select 处理 props.value
 * @param warn   如果是 label, value 模式是否需要报警提示
 * @returns {Array}  返回处理好的数据
 */
export function buildMultiSelectData(field = {}, data, warn) {
  if (_.isEmpty(field)) {
    return;
  }
  var model = getSelectModel(field);
  let renderData = [];
  if (data && _.isArray(data) && data.length > 0) {
    var needWarn = false;
    if (data.some(obj => !isSelectLocalMode(field, obj))) { // 如果不是所有都有 local 模式, 即 server 模式
      data.forEach(obj => {
        if (typeof obj === 'string') {
          !needWarn && (needWarn = true);
          renderData.push({
            "value": obj,
            "label": obj
          });
        } else if (_.isObject(obj)) {
          if (!isSelectServerMode(field, obj)) {
            !needWarn && (needWarn = true);
          } else {
            renderData.push(Object.assign({}, obj, {
              "value": getSafetyString(obj[model.idField]),
              "label": model.showTpl ? M.template(model.showTpl, obj) : getSafetyString(obj[model.showField]),
            }));
          }
        }
      });
    } else { // 否则全是 local 模式
      model.idField && model.idField !== "value" && (needWarn = true);
      renderData = data;
    }
    warn && needWarn && console.warn((field.code ? field.code + "数据格式问题, " : "") + 'multiSelect/multiTreeSelect 组件支持的数据格式建议统一使用 [{${showFiled}:"", ${idField}:""}]');
  }
  return renderData;
}