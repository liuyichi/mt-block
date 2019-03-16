import ajax from './ajax';
import { isArray, isObject } from 'lodash-compat';
import { isEmptyString } from '../../util/data';
import promisify from '../../util/func/promisify';

/**
 * 精简bill的功能
 * @param model
 * @returns {Function}
 */
const buildEvents = (model) => {
  const factory = {};
  const eventMap = {
    'bind': 'onBind',
    'bindNode': 'onBindNode',
  };
  const searchFields = {};
  if (isArray(model.events)) {
    (model.fields || []).forEach(f => {
      searchFields[f.code] = f;
    });
    model.events.forEach(e => {
      if (e) {
        if (!factory[e.code]) {
          factory[e.code] = {};
        }
        // 现在仅处理bind和bindNode事件
        if (['bind', 'bindNode'].includes(e.type)) {
          const evType = e.type;
          if (searchFields[e.code] && searchFields[e.code][eventMap[evType]]) {
            // 请求方式同时支持callback和promise
            factory[e.code][evType] = promisify(searchFields[e.code][eventMap[evType]]);
          } else {
            //FIXME 是否支持自定义params
            const params = {};
            factory[e.code][evType] = async function(code, callback) {
              let data = await ajax(e.url, params);
              data = isArray(data)? data : (isArray(data.pageList)? data.pageList : []);
              callback && callback(data);
              return data;
            };
          }
        }
      }
    });
  }
  return function(code, type, bill) {
    let handler;
    if (factory[code] && factory[code][type]) {
      handler = factory[code][type];
    } else if (searchFields[code][eventMap[type]]) {
      handler = promisify(searchFields[code][eventMap[type]]);
    }
    return typeof handler === 'function' ? 
      (bill? handler.bind(handler, bill, type) : handler.bind(handler, type)) : null;
  };
};

/**
 * 搜索条件的数据格式转换
 * @param data
 * @param model
 */
const convertData = (data, model) => {
  if (isEmptyString(data)) return undefined;
  const { code, showCode, type: fieldType, model: m, filterType } = model;
  const idField = (m && m.idField) || 'value';
  const showField = (m && m.showField) || 'label';

  //表头筛选的类型优先级大于字段类型
  const type = filterType || fieldType;
  switch (type) {
    case 'select':
    case 'treeSelect':
      return Object.assign({
        [code]: isObject(data)? data[idField] : data,
      }, showCode && {
        [showCode]: data[showField],
      });
    case 'checkbox':
    case 'multiSelect':
    case 'multiTreeSelect':
      //FIXME 返回idField的集合，会不会有可能需要其他字段
      return {
        [code]: isArray(data)? data.map(d => isObject(d)? d[idField] : d)
          : (isObject(data) ? data[idField] : []),
      };
    case 'radio':
      return { [code]: data[idField] };
      break;
    default:
      return { [code]: data };
  }
};

export { buildEvents, convertData };
