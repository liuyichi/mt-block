import _ from 'lodash-compat';
import toPairs from './toPairs';

/**
 * 根据 keyFunc 和 valueFunc 转换一个集合为对象
 * @param collection 源集合，类型通常为数组
 * @param {function|string} keyFunc 生成结果对象中元素的键的函数
 * @param {function|string=} valueFunc 生成结果对象中元素的值的函数，默认以元素本身为值
 * @returns {object} 转换得到的对象
 */
function toObject(collection, keyFunc, valueFunc) {
  return _.zipObject(toPairs(collection, keyFunc, valueFunc));
}

export default toObject;
