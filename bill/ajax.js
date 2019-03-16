
import _ from 'lodash-compat';

/**
 * fetch 请求
 * @param url 请求的url
 * @param param 请求的参数
 * @param success 请求成功的回调
 * @param error 请求失败的回调
 * @param options 请求的其他配置参数
 */
function ajax(url, param, success, error, options) {
    var _options = _.assign({}, options);
    if (!options) {
        options = {};
    }
    _options.method = (options.method && options.method.toLocaleUpperCase() == 'GET') ? "GET" : "POST";
    if (!_options.headers) {
        _options.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    } else {
        (!_options.headers['Accept']) && (_options.headers['Accept'] = 'application/json');
        (!_options.headers['Content-Type']) && (_options.headers['Content-Type'] = 'application/json');
    }
    _options.headers['X-Requested-With'] = "XMLHttpRequest";
    if (!_.isEmpty(param)) {
        try {
            _options.body = JSON.stringify(param);
        } catch (e) {
            console.error('JSON stringify error', param);
        }
    }
    (!options['credentials']) && (_options['credentials'] = 'same-origin');
    fetch(url, _options).then(function (_res) {
        if (_res.ok) {
            _res.json().then(function (res) {
                if(res.hasOwnProperty('status')){
                    if (res.status == "1") {
                        if (success) {
                            success(res.data);
                        }
                    } else if (res.status == "0" || res.status == '401') {
                        if (error) {
                            error(res.status == '401' ? Object.assign({}, res.data, { errorCode: 401 }) : res.data);
                            console.error("AJAX 返回 status 为 " + res.status, res);
                        }
                    }
                }else{
                    if (success) {
                        success(res.data);
                    }
                }
            });
        } else {
            // TODO: 需要做处理
            console.error("Looks like the response wasn't perfect, got status", _res.status);
        }
    }, function (res) {
        if (error) {
            try {
                var data = JSON.parse(res.responseText).data;
            } catch (e) {
            }
            if (data && data.errorCode && data.message) {
                error(data);
            } else {
                error({message: "未知错误！"});
            }
        } else {
            console.error("AJAX 错误", res);
        }
    });
}

//function ApiError({ message, errorCode, ...data }) {
//    this.name = 'ApiError';
//    this.message = message;
//    this.errorCode = errorCode;
//    this.data = data;
//    this.stack = (new Error()).stack;
//}
//ApiError.prototype = Object.create(Error.prototype);
//ApiError.prototype.constructor = ApiError;


export default ajax;

