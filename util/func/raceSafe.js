let raceSafeStorage = {};

/**
 * 使一个回调函数或一个 Promise 在竞态条件下安全
 * 即对于相同名字的回调／Promise，无论被调用／解决的时间早晚，只有最后一次传递给此函数的会生效
 * @param callbackOrPromise 一个回调函数，或者一个 Promise 实例
 * @param name 关联的操作的名字
 * @param storage 调用计数的存储对象
 * @returns {*} 一个竞态安全化的回调函数或 Promise 实例
 */
function raceSafe(callbackOrPromise, name='', storage=raceSafeStorage) {
  let id = (storage[name] || 0) + 1;
  storage[name] = id;
  if (callbackOrPromise.then != null) {
    let orig = callbackOrPromise.then;
    callbackOrPromise.then = function (cb, eb) {
      orig.call(
        this,
        function () {
          if (storage[name] === id) {
            cb.apply(this, arguments);
          }
        },
        function () {
          if (storage[name] === id) {
            eb.apply(this, arguments);
          }
        }
      );
    };
    return callbackOrPromise;
  } else {
    return function () {
      if (storage[name] === id) {
        callbackOrPromise.apply(this, arguments);
      }
    };
  }
}

export default raceSafe;
export { raceSafeStorage };
