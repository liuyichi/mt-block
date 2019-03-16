import _ from 'lodash-compat';

let ApiError = window.__mtf_utils_ApiError;
let ApiStatusError = window.__mtf_utils_ApiStatusError;

let _apiError = ApiError && (new ApiError({}));

//FIXME 要求数据形式{ data, status }，与regularApi关联度太强

/**
 * fetch 请求
 * @param url 请求的url
 * @param params 请求的参数
 * @param options 请求的其他配置参数
 */
async function ajax(url, params, options) {
  let _options = _.assign({
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
  }, options);
  try {
    _options.body = JSON.stringify(params);
  } catch (e) {
    console.error('JSON stringify error', params);
  }

  let res;
  try {
    res = await fetch(url, _options);
    res = await res.json();
  } catch (e) {
    e.__proto__ = _apiError;
    throw e;
  }
  if (res.status == 1) {
    return res.data;
  } else {
    if (ApiStatusError) {
      throw new ApiStatusError(res.data);
    } else {
      //FIXME 报错信息
      throw new Error(res.message);
    }
  }
}

export default ajax;
