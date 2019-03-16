import M from '../../util';
import { isObject, isEmptyString } from '../../util/data';
export const MODEL = {
  colorField: "color"
};
export const IDFIELD = "_pkCode";
export const ADDBTNCONF = {
  label: "新增",
  size: "xsmall",
  type: "ghost",
  icon: "plus"
};

/**
 * 获取时间版本的对象
 * @param array 时间版本列表
 * @param key 时间版本key
 * @returns {*}
 */
export function findItem(array, key) {
  if (Array.isArray(array) && !isEmptyString(key)) {
    return array.find(v => (IDFIELD in v) && key === v[IDFIELD]);
  }
  return null;
}
/**
 * 获取时间版本的key
 * @param model 配置文件
 * @param date 时间版本对象
 * @param defaultKey 如果 model.idFied 不存在, 返回 defaultKey
 * @returns {*}
 */
export function getKey(model, date, defaultKey) {
  if (!isObject(model) || !isObject(date) || !model.idField) {
    return isEmptyString(defaultKey) ? '' : defaultKey;
  }
  if (model.idField.match("{{.*}}")) {
    return M.template(model.idField, date || {});
  }
  return date[model.idField];
}
/**
 * 获取新增节点
 * @param model
 * @returns {{_new: boolean}}
 */
export function getNewTime(model) {
  return {[IDFIELD]: "_new", _new: true, [model.leftField]: "新增中..."};
}
/**
 * 是否有新增中
 * @param date
 * @returns {boolean}
 */
export function hasNew(date) {
  return Array.isArray(date) && date.some(v => v._new);
}
/**
 * 为时间轴数据加上主键
 * @param model
 * @param date
 * @returns {boolean|*}
 */
export function buildTimeline(model, date) {
  return Array.isArray(date) && date.map((item, index) => {
      item[IDFIELD] = getKey(model, item, index);
      return item;
    })
}