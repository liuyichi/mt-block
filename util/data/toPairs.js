import _ from 'lodash-compat';

/**
 * 根据 keyFunc 和 valueFunc 转换一个集合为键值对数组
 * @param collection 源集合，类型通常为数组
 * @param {function|string} keyFunc 生成结果对象中元素的键的函数
 * @param {function|string=} valueFunc 生成结果对象中元素的值的函数，默认以元素本身为值
 * @returns {object} 转换得到的键值对数组
 */
function toPairs(collection, keyFunc, valueFunc) {
  valueFunc = valueFunc || _.identity;
  if (_.isString(keyFunc)) {
    keyFunc = _.property(keyFunc);
  }
  if (_.isString(valueFunc)) {
    valueFunc = _.property(valueFunc);
  }
  return _.zip(_.map(collection, keyFunc), _.map(collection, valueFunc));
}

export default toPairs;
