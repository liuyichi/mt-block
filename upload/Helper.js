import _ from 'lodash-compat';
import M from '../util';
import FormData from 'form-data';
import { Toaster } from '../toaster';
import { isFunction, isString } from '../util/data';
import LOCALE from './locale/zh_CN';
const UploadUrl = "/attachment";

/**
 * 上传的交互
 * @param url 上传路径
 * @param file 文件
 * @param conf 请求头的配置
 * @param params 可选的参数, 对象类型
 */
export const upload = (url, file, params, conf) => {
  let { headers = {}, name, useFormData = true, errToast } = conf || {};
  let body, header;
  url = url || UploadUrl;
  if (useFormData) {
    body = new FormData();
    (Object.keys(params) || []).forEach(key => {
      if (params.hasOwnProperty(key)) {
        body.append(key, params[key]);
      }
    });
    body.append(name || "file", file, file.name);
    header = Object.assign({
      'Accept': 'application/json,*/*;q=0.8'
    }, headers)
  } else {
    url = url + (_.isEmpty(params) ? '' : "?param=" + encodeURI(JSON.stringify(params)));
    body = file;
    header = Object.assign({
      'Accept': 'application/json,*/*;q=0.8',
      'Content-Type': 'application/octet-stream'
    }, headers);
  }

  return fetch(url, {
    method: "POST",
    headers: header,
    body: body,
    credentials: 'same-origin',
  }).then(function (_res) {
    if (_res.ok) { // 服务端是不是返回 200
      return _res.json().then(function (res) {
        if (res.status == "1") {
          return res.data;
        }
        if (errToast) {
          Toaster.error(res && res.data && res.data.message || "上传失败");
          throw res.data;
        } else if (res.status == '0' || res.status == '401') {
          if (window && window.__mtf_utils_ApiStatusError != null) {
            throw new window.__mtf_utils_ApiStatusError(res.status == '401' ? Object.assign({}, res.data, { errorCode: 401 }) : res.data);
          } else {
            let error = new Error(res.data.message);
            error.name = "ApiError";
            error.data = res.data;
            throw error;
          }
        }
      });
    } else {
      if (errToast) {
        Toaster.error("网络错误，请稍后重试");
        throw _res.status;
      } else {
        throw new Error("Looks like the response wasn't perfect, got status" + _res.status);
      }
      // TODO: 需要做处理
    }
  }, function (res) {
    if (errToast) {
      Toaster.error("网络错误，请稍后重试");
      throw res.status;
    } else {
      throw new Error("Looks like the response wasn't perfect, got status" + res.status);
    }
  });
};

/**
 * 校验文件的大小/类型是否合格
 * @param file 需要校验的文件
 * @param conf 配置的属性
 *  @param fileType 文件的类型
 *  @param fileMaxSize 文件大小
 *  @param onBeforeUpload 上传单个文件前的校验
 *  @param locale 文案配置
 *  @returns {String} 校验的结果
 */
export const filterFiles = function (file, conf) {
  const { fileType, fileMaxSize, onBeforeUpload } = conf;
  const locale = Object.assign({}, LOCALE, conf.locale);
  var explain = '';
  if (onBeforeUpload && isFunction(onBeforeUpload)) {
    explain = onBeforeUpload(file);
  }
  if (explain === false || (explain && isString(explain))) { // 如果返回的是 false 或一个字符串,则报错; 返回 true 则继续走下面的验证逻辑
    return explain || "文件大小或类型不符合";
  }
  if (fileMaxSize && file.size > fileMaxSize) {
    return M.template(locale.overMaxSize, file);
  }
  if (!fileType) {
    return '';
  }

  var fileExt = (/^.*\.(.*)$/.exec(file.name) || ['', ''])[1].toLowerCase();
  var exts;
  if (isFunction(fileType)) {
    return fileType(file) || M.template(locale.wrongType, file);
  }
  if (fileType === 'document') {
    exts = ['pdf', 'xps', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
    return _.startsWith((file.type || ''), 'text/') || _.contains(exts, fileExt)
      || M.template(locale.unknownDocumentType, file);
  }
  if (fileType === 'image') {
    return _.startsWith((file.type || ''), 'image/') || M.template(locale.unknownImgType, file);
  }
  if (fileType === 'archive') {
    exts = ['zip', '7z', 'rar', 'tar', 'gz', 'dmg', 'zipx'];  // TODO: 还要加什么吗？
    return _.contains(exts, fileExt) || M.template(locale.unknowArchiveType, file);
  }
  if (!locale._fileExts) {
    locale._fileExts = Array.isArray(fileType) ? fileType : fileType.split('.').slice(1);
  }
  return _.contains(locale._fileExts, fileExt) || M.template(locale.wrongExtType, Object.assign(file, { fileType: locale._fileExts }));
};

/**
 * 判断文件是否可上传
 *  未在上传中, 并没有下载链接的
 * @param file 文件
 * @returns {boolean} true 可上传, false 不可
 */
export const isFileUploadable = (file) => {
  return !file.uploading && !('url' in file);
};

/**
 * 判断文件是否重复了
 * @param file 当前要上传的文件
 * @param files 已存在的文件
 * @returns {boolean} true 重复, false 未重复
 */
export const isDuplicated = (file, files) => {
  return (files || []).some(v => v._pkCode_ !== file._pkCode_ && v.name === file.name && v.size === file.size)
};
