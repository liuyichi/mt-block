/**
 * 转换一个 callback 模式的函数为 promise 模式
 * @param original 一个函数，最后一个参数为 callback，callback 的第一个参数为异步返回值
 * @returns {Function} 一个返回 Promise 的函数
 */
function promisify(original) {
  return function (...args) {

    // 只有 callback 并调用并且 Promise 已创建，才完成 Promise
    let result;
    let resolve;
    let finish = () => result && resolve && resolve(result[0]);

    // 调用原函数
    let ret = original(...args, (...v) => {
      result = v;
      finish();
    })

    // 如果原函数本来就返回 Promise，使用这个 Promise
    if (ret != null && typeof ret.then === 'function') return ret;

    // 创建并返回一个 Promise
    return new Promise(r => {
      resolve = r;
      finish();
    });

  };
};

export default promisify;
