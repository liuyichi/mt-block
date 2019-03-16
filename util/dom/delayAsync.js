/**
 * 可以 await 的延时
 * @param delay 毫秒
 * @returns {Promise}
 */
function delayAsync(delay=0) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

export default delayAsync;
