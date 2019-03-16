var _ = require('lodash-compat');
import ajax from './ajax';
import { upload } from '../upload/Helper';
import { getFieldModel, mergeProps, transferFieldType } from './util';
import { getSafetyString, isEmptyString, isFunction,
  getSelectModel, getSelectIdField ,getSelectShowField, buildSelectData, buildMultiSelectData,
  isSelectDefinedBothField } from '../util/data';

/**
 * Bill helper类
 */

/**
 * 遍历model
 * @param model
 * @param callback 遍历到字段的每个字段方法
 */
function traverseModel(model, callback) {
  if (model && model.forms && model.forms.length > 0) {
    _.forEach(model.forms, function (form) {
      if (form && form.fields && form.fields.length > 0) {
        _.forEach(form.fields, callback);
      }
    });
  }
}

/**
 * 解析control的event事件 获得控制事件的方法
 */
function controlhandler(event, value) {
  var process = event.process;
  var source = "", reg = new RegExp('"', 'g');
  _.forEach(process, function (item) {
    var content = "if(" + item.condition + "){\n" +
      "return {" +
      "show:" + JSON.stringify(item.show || []).replace(reg, "'") + "," +
      "hide:" + JSON.stringify(item.hide || []).replace(reg, "'") + "," +
      "disable:" + JSON.stringify(item.disable || []).replace(reg, "'") + "," +
      "editable:" + JSON.stringify(item.editable || []).replace(reg, "'") + "," +
      "view:" + JSON.stringify(item.view || []).replace(reg, "'") + "," +
      "require:" + JSON.stringify(item.require || []).replace(reg, "'") + "," +
      "optional:" + JSON.stringify(item.optional || []).replace(reg, "'") + "," +
      "option:" + JSON.stringify(item.option || []).replace(reg, "'") + "," +
      "}}\n";
    source += content + "\n";
  });
  source = 'with(obj||{}){\n' + source + '}\n';
  try {
    var render = new Function('obj', source);
    return render(value);
  } catch (e) {
    e.source = source;
    throw e;
  }
}

/**
 * 构建渲染的forms
 * @param _model        state.model
 * @return Array forms  用于渲染的forms
 *
 * 只过滤出来显示
 * required pattern validation单独拿出去 放到validateFactory中去
 * 注: mode:"view"  显示模式 view-->表示只显示 edit表示是可以操作的
 * text:{code,name,placeholder,readonly,mode}
 * number:{...step}
 * textarea:{...row}
 * date:{...format,}
 * dateRange:{code,name,readonly,mode,format,range} range:[1461055303520,1491055303520] //日期范围选择器
 * select:{...model,data,showCode} 对应ant select
 *
 */
function buildRenderForms(_model) {
  var forms = [], form;
  if (_model && _model.forms) {
    _.forEach(_model.forms || [], function (_form, index) {
      let label = _form.label || _form.title || (_form.format && _.isFunction(_form.format) && _form.format());
      let show = true;
      if ([true, "true"].includes(_form.hideIfNoFieldVisible)) {
        show = Array.from(_form.fields || []).some(v => ![false, "false"].includes(v.show));
      }
      form = {
        "code": '_form_' + (_form.code ? _form.code : index),
        "label": label || "",
        "show": show && (isFunction(_form.show) ? _form.show : ![false, "false"].includes(_form.show)),
        "fields": []
      };
      if (_form.title) {
        console.warn("Bill 的 form 请使用 label 来代替 title");
      }
      if (_form.format) {
        console.warn("Bill 的 form 的 format 已被废弃, 请直接给 label 传 node");
      }
      _.forEach(_form.fields, function (_field) {
        transferFieldType(_field);
        form.fields.push(_field);
      });
      forms.push(form);
    });
  }
  return forms;
}
/**
 * 构建渲染的数据(data)
 * @param _data         props.data
 * @param _model        props.model
 * @return Object data   返回渲染需要的数据
 */
function buildRenderData(_data, _model) {
  var data = {};
  if (_model && _model.forms) {
    _.forEach(_model.forms || [], function (_form) {
      _.forEach(_form.fields || [], function (_field) {
        transferFieldType(_field);
        data[_field.code] = null;
        var value = _data.hasOwnProperty(_field.code) && _data[_field.code];
        switch (_field.type) {
          case "select":
          case "treeSelect":
            var model = getSelectModel(_field);
            if (_data.hasOwnProperty(_field.code)) {
              if (!_.isObject(value)) {
                let _value = _data[_field.code];
                let _label = _data[_field.showCode || _field.code + "Name"] || _value;
                data[_field.code] = {
                  "value": _value,
                  "label": _label,
                };
                let bothDefined = isSelectDefinedBothField(_field);
                if (bothDefined) { // 这里不直接使用 idField/showField 来避免 showTpl 的影响
                  Object.assign(data[_field.code], {
                    [model.idField]: _value,
                    [model.showField]: _label,
                  });
                }
              } else {
                data[_field.code] = buildSelectData(Object.assign({}, _field, {model}), value, "warn");
              }
            }
            break;
          case "multiSelect":
          case "treeMultiSelect":
            if (_data.hasOwnProperty(_field.code)) {
              var model = getSelectModel(_field);
              data[_field.code] = buildMultiSelectData(Object.assign({}, _field, {model}), value, "warn");
            }
            break;
          //TODO 数据显示不同类型需要transfer
          default:
            // add by liukaimei,  _.isEmpty 对 boolean/number 型的值也返回 true
            data[_field.code] = (!_data.hasOwnProperty(_field.code) || (isEmptyString(value) && _.isEmpty(value))) ? null : value;
            break;
        }
      });
    });
  }
  return data;
}

/**
 * 把数据转换为输出数据
 * @param _data         props.data
 * @param _model        props.model
 * @return Object data   返回渲染需要的数据
 */
function buildServerData(_data, renderData, _model) {
  var data = _.cloneDeep(_data);
  if (_model && _model.forms) {
    _.forEach(_model.forms || [], function (_form) {
      _.forEach(_form.fields || [], function (_field) {
        transferFieldType(_field);
        if ((_field.type == "select" || _field.type == "treeSelect") && renderData.hasOwnProperty(_field.code)) {
          if (_.isObject(_data[_field.code]) && !_field.objToServer) {
            data[_field.code] = renderData[_field.code].value;
          }
          if (_field.showCode === _field.code) {
            console.warn(_field.code + "字段的 showCode 与其 code 相重复了");
          } else {
            !isEmptyString(renderData[_field.code]) && (data[_field.showCode || _field.code + "Name"] = renderData[_field.code]["label"]);
          }
        } else if (_field.type == "multiSelect" || _field.type == "treeMultiSelect") {
          if (renderData.hasOwnProperty(_field.code)) {
            data[_field.code] = [];
            if (_field.idsOnlyToServer && _field.showCode != null) {
              data[_field.showCode] = [];
            }
            if (_.isArray(renderData[_field.code]) && renderData[_field.code].length > 0) {
              var item = {};
              _.forEach(renderData[_field.code], function (obj) {
                if (_field.idsOnlyToServer) {
                  data[_field.code].push(getSafetyString(obj.value));
                  if (_field.showCode === _field.code) {
                    console.warn(_field.code + "字段的 showCode 与其 code 相重复了");
                  } else if (_field.showCode != null) {
                    data[_field.showCode].push(getSafetyString(obj.label));
                  }
                } else {
                  item = {};
                  item[getSelectIdField(_field)] = getSafetyString(obj.value);
                  item[getSelectShowField(_field)] = getSafetyString(obj.label);
                  data[_field.code].push(item);
                }
              });
            }
          }
        }
      });
    });
  }
  return data;
}
/**
 * 构建默认数据,从model中获取默认数据并构建上 提取出来就ok
 * @param _model    props.model 这里去兼容一下 list 系列的类型.
 * @return Object defaultData 返回显示的默认数据
 */
function buildDefaultData(_model) {
  var data = {};
  if (_model && _model.forms) {
    _.forEach(_model.forms || [], function (_form) {
      _.forEach(_form.fields || [], function (_field) {
        //如果是key value的需要处理一下
        let defaultValue = (_field.conf||{}).hasOwnProperty("defaultValue") ? _field.conf.defaultValue : (_field.hasOwnProperty("defaultValue") ? _field.defaultValue : null);
        if (defaultValue !== null) {
          //add by liukaimei, defaultValue for select/treeSelect
          transferFieldType(_field);
          if ((_field.type !== "select" && _field.type !== "treeSelect") || _.isObject(defaultValue)) {
            data[_field.code] = defaultValue;
          }
        }
      });
    });
  }
  return data;
}

/**
 * 构建请求数据的数据工厂(dataFactory)
 * @param bill            bill
 * @param _model            props.model
 * @return Object dataFactory      返回bill中请求数据需要的dataFactory
 * 需要获取数据的情况 bind  fetch
 * // FIXME fetch bind url都是按照完整url来处理的 不考虑profile的情况了
 */
function buildDataFactory(_model) {
  //从_model中获取所有的事件类型 处理bind事件
  var factory = {}, param, depParams = {}, eventMap = {
    "fetch": "onFetch",
    "bind": "onBind",
    "bindNode": "onBindNode",
    "control": "onControl",
    "upload": "onUpload",
  };
  if (_model && !_.isEmpty(_model.events)) {
    _.forEach(_model.events, function (event) {
      if (event) {
        if (!factory[event.code]) {
          factory[event.code] = {};
        }
        var field = getFieldModel(_model, event.code);
        if (!field) {
          return;
        }
        // bind
        if (event.type == "bind") {
          //add by liukaimei  转换成联动关系, 将影响其他值清空的字段做键,需要被清空的字段组成数组做值
          (event.params || []).filter(v => {
            if (typeof(v) === "string") {
              !depParams[v] && (depParams[v] = []);
              depParams[v].push(event.code);
            } else if (_.isObject(v)) { // 如果是对象, 确定值的依赖关系
              (Object.values(v) || []).forEach(item => {
                !depParams[item] && (depParams[item] = []);
                depParams[item].push(event.code);
              });
            }
          });
          if (field['onBind']) {
            factory[event.code]['bind'] = field['onBind'];
          } else {
            factory[event.code]['bind'] = function (bill, code, filter, callback, errCallback) {
              param = bill.getParameters(event.params);
              //对 树组件需要做特殊处理
              var _filedModel = bill.getFieldModel(code);
              transferFieldType(_filedModel);
              if (_filedModel && (_filedModel.type == "treeSelect" || _filedModel.type == "treeMultiSelect") && _.isObject(filter)) {
                param = filter;
              } else {
                param[event.filterField || 'filter'] = getSafetyString(filter);
              }
              ajax(event.url, param, (data)=> {
                callback && callback(Array.isArray(data) ? data : (Array.isArray(data.pageList) ? data.pageList : []));
              }, (res)=> {
                errCallback && errCallback(res);
                if (window && window.__mtf_utils_ApiStatusError != null) {
                  throw new window.__mtf_utils_ApiStatusError(res);
                } else {
                  let error = new Error(res.message);
                  error.name = "ApiError";
                  error.data = res;
                  throw error;
                }
              });
            }
          }
        }
        if (event.type == "bindNode") {
          //add by liukaimei  树结构的事件处理
          if (field['onBindNode']) {
            factory[event.code]['bindNode'] = field['onBindNode'];
          } else {
            factory[event.code]['bindNode'] = function (bill, code, node, callback) {
              param = bill.getParameters(event.params);
              //对 树组件需要做特殊处理
              var _filedModel = bill.getFieldModel(code);
              transferFieldType(_filedModel);
              if (_filedModel && (_filedModel.type == "treeSelect" || _filedModel.type == "treeMultiSelect")) {
                Object.assign(param, node);
                ajax(event.url, param, (data)=> {
                  callback(Array.isArray(data) ? data : (Array.isArray(data.pageList) ? data.pageList : []));
                }, (res)=> {
                  callback([]);
                  if (window && window.__mtf_utils_ApiStatusError != null) {
                    throw new window.__mtf_utils_ApiStatusError(res);
                  } else {
                    let error = new Error(res.message);
                    error.name = "ApiError";
                    error.data = res;
                    throw error;
                  }
                });
              }
            }
          }
        }
        if (event.type == "upload") {
          // add by liukaimei, 附件的上传处理
          if (field['onUpload']) {
            factory[event.code]['upload'] = field['onUpload'];
          } else {
            factory[event.code]['upload'] = function (bill, code, file, uploadParams, {headers,name}) {
              // 参数有 uploadParams, 和 event 定义的 params
              param = Object.assign({}, bill.getParameters(event.params), uploadParams);
              return upload(event.url, file, param, {headers, name});
            }
          }
        }
        if (event.type == "fetch") {
          if (field['onFetch']) {
            factory[event.code]['fetch'] = field['onFetch'];
          } else {
            factory[event.code]['fetch'] = function (bill, code, value, callback) {
              param = bill.getParameters(event.params);
              param[event.filterField || 'filter'] = getSafetyString(value);
              ajax(event.url, param, callback, (res)=> {
                if (window && window.__mtf_utils_ApiStatusError != null) {
                  throw new window.__mtf_utils_ApiStatusError(res);
                } else {
                  let error = new Error(res.message);
                  error.name = "ApiError";
                  error.data = res;
                  throw error;
                }
              });
            }
          }
        }
        if (event.type == "control") {
          if (field["onControl"]) {
            factory[event.code]['control'] = field['onControl'];
          }
        }
      }
    });
  }

  return function (code, bill, type) {
    //add by liukaimei 获取该字段的联动关系
    if (type == "depParams") {
      return depParams[code];
    }
    var handler;
    if (factory[code] && factory[code][type]) {
      //从factory中找到field.code对应的事件 绑定上field和bill
      if (["fetch", "bind", "bindNode", "upload", "control"].indexOf(type) !== -1) {
        handler = factory[code][type];
      }
    } else {
      var field = getFieldModel(_model, code);
      if (field) {
        handler = field[eventMap[type]];
      }
    }
    if (handler && _.isFunction(handler)) {
      return handler.bind(handler, bill, code);
    } else {
      return null;
    }
  };
}
/**
 * 构建其他的自定义方法合集
 * @param bill
 * @return Function    返回操作工厂
 */
function buildActionFactory(_model) {
  return function (code) {
    if (code) {
      var action = {};
      var field = getFieldModel(_model, code);
      if (!field) {
        return null;
      }
      transferFieldType(field);
      switch (field.type) {
        case "text":
        case "password":
        case "number":
        case "textarea":
          mergeProps(action, field, ["onFocus", "onBlur", "onClear"]);
          break;
        case "autoText":
        case "select":
        case "multiSelect":
        case "treeSelect":
        case "treeMultiSelect":
          mergeProps(action, field, ["onFocus", "onBlur", "onClear", "onSelect", "onDeSelect", "onSearch", "onKeyDown"]);
          break;
        case "upload":
          mergeProps(action, field, ["onBeforeUpload", "onBeforeUploadAll", "onError", "onSuccess", "onDelete"]);
          break;
      }
      return action;
    }
    return null;
  };
}
/**
 * 构建操作工厂(actionFactory)
 * @param _model            props.model
 * @param dataFactory       state.dataFactory
 * @param onFieldChange     值改变后的回调, Bill.props.onFieldChange
 * @return Function actionFactory    返回操作工厂
 */
function buildChangeFactory(_model, dataFactory, onFieldChange) {
  var factory = {};
  //对model中所有字段都map出来
  //再挂载event 之 fetch control
  //再挂载 _actionFactory 的自定义
  traverseModel(_model, function (field) {
    transferFieldType(field);
    //遍历model.events判断事件类型
    //构建常规 changeAction
    factory[field.code] = function (bill, code, value) {
      //处理配置在自定义中的anction
      var isBindCustomAction = false, self = this;  // 是否绑定了值更改后的自定义处理事件 ('handler'标识符)
      var doAction = function(data) {
        //正常change 只负责把数据通知到bill 更新对应item即可
        var source = {};
        source[code] = value;
        var billData = bill.getData();
        if (billData[code] !== ((value || {}).value || value)) { //add by liukaimei, 数据更改了
          //清空先关的联动字段的值
          var depParams = dataFactory(code, bill, 'depParams');
          (depParams || []).forEach(function (v) {
            if (bill.refs[v]) { // add by liukaimei, 加一层保护, 避免无效的 bind 事件, 下拉类型去清空数据
              // add by lvmengmeng, 如果配置 noClear 为 true, 会在它依赖的字段改变时, 去清空下拉数据, 但不会清空当前选中的值
              if (!((_model.events || []).find(event => event.code === v) || {}).noClear && billData[v]) {
                bill.refs[v].reset();
              }
              let _field = bill.getFieldModel(v);
              transferFieldType(_field);
              (_field.type === "select" || _field.type === "multiSelect" || _field.type === "treeSelect" || _field.type === "treeMultiSelect") && bill.refs[v].clearOption();
            }
          });
        }
        // 更新bill的数据
        var param = {};
        if (field.type === "select" || field.type === "treeSelect") {
          param[code] = (value || {}).value;
          param[(field.conf || {}).showCode || field.showCode || code + "Name"] = (value || {}).label;
        } else {
          param[code] = value;
        }
        bill.setFieldsData(Object.assign(param, data), ()=>{
          onFieldChange && onFieldChange(code, value);
        }, null, 'noWarn');
        //event增加fields属性，设置更新参数数组列表（后端返回多余字段与bill其他重复时导致更新出错）
        // TODO 去做属性的映射
        if (self.fetchEvent || dataFactory(code, bill, 'fetch')) {
          bill.doFetchHandler(code, bill.getData()[code], (self.fetchEvent || {}).fields || [], self.fetchEvent);
        }
        if (self.controlEvent || dataFactory(code, bill, 'control')) {
          //control 事件 更新数据 并且更新model
          bill.doControlHandler(code, bill.getData()[code], self.controlEvent);
        }
      };
      if (field["onChange"]) {
        //执行自定义方法 三个参数分别是 value,bill和执行完之后的回调
        if (_.isFunction(field["onChange"])) {
          field["onChange"].call(null, value, bill, onFieldChange, doAction);
          isBindCustomAction = true;
        }
      }
      if (!isBindCustomAction) {
        doAction();
      }
    };
    if (_model && _model.events && _model.events.length > 0) {
      _.forEach(_model.events, function (event) {
        if (event && event.code == field.code) {
          if (event.type == "fetch") {
            factory[field.code].fetchEvent = event;
          }
          if (event.type == "control") {
            factory[field.code].controlEvent = event;
          }
        }
      });
    }
  });

  return function (code, bill) {
    //从factory中找到field.code对应的事件 绑定上field和bill
    var handler = factory[code];
    if (handler) {
      if (bill) {
        !bill.controls && (bill.controls = {});
        !bill.fetchs && (bill.fetchs = {});
      }
      if (handler.fetchEvent) {
        bill.fetchs[code] = handler.fetchEvent;
      }
      if (handler.controlEvent) {
        bill.controls[code] = handler.controlEvent;
      }
      return handler.bind(handler, bill, code);
    }
    return null;
  };
}

/**
 * 构建bill item的组件工厂
 * @param bill   bill
 * @param _model   props.model
 * @return Function elementFactory   返回bill item的组件工厂 传入field本身可以获取到组件
 */
function buildElementFactory(_model) {
  return function (code) {
    const field = getFieldModel(_model, code);
    if (field && field.Component) {
      return field.Component;
    }
    return null;
  }
}
/**
 * 把字段 field 的 billData 转换为 serverData
 * @param field  字段的配置
 * @param value  转换前的值
 */
function traverse2Data(field, value) {
  if (field) {
    transferFieldType(field);
    switch (field.type) {
      case "text":
      case "textarea":
      case "autoText":
      case "number":
        return value;
      case "select":
      case "treeSelect":
        return _.isObject(value) ? value.value : value;
      case "multiSelect":
      case "treeMultiSelect":
        var list = [];
        _.forEach(value || [], function (obj) {
          if (field.idsOnlyToServer) {
            list.push(getSafetyString(obj.value));
          } else {
            list.push({
              [getSelectIdField(field)]: getSafetyString(obj.value),
              [getSelectShowField(field)]: getSafetyString(obj.label),
            });
          }
        });
        return list;
    }
  }
}
/**
 * 把字段 field 的 serverData 转换为 billData
 * @param field  字段的配置
 * @param source 值对象
 */
function traverse2BillData(field, source, noWarn) {
  if (field) {
    var value = source[field.code];
    switch (field.type) {
      case "text":
      case "textarea":
      case "autoText":
      case "number":
        break;
      case "multiSelect":
      case "treeMultiSelect":
        var model = (field.conf || {}).model || field.model || {};
        value = buildMultiSelectData(Object.assign({}, field, {model}), value, !noWarn);
        break;
      case "select":
      case "treeSelect":
        var model = getSelectModel(field);
        if (!_.isObject(value)) {
          let _value = value;
          let _label = source[field.showCode || field.code + "Name"];
          value = {
            "value": _value,
            "label": _label,
          };
          let bothDefined = isSelectDefinedBothField(field);
          if (bothDefined) {
            Object.assign(value, {
              [model.idField]: _value,
              [model.showField]: _label,
            });
          }
        } else {
          value = buildSelectData(Object.assign({}, field, {model}), value, !noWarn);
        }
        break;
    }
    return value;
  }
}

module.exports = {
  buildRenderForms: buildRenderForms,
  buildRenderData: buildRenderData,
  buildDefaultData: buildDefaultData,
  buildDataFactory: buildDataFactory,
  buildActionFactory: buildActionFactory,
  buildChangeFactory: buildChangeFactory,
  buildElementFactory: buildElementFactory,
  ALIGNMENT: {  // 对齐方式的常量 left:水平左对齐;right:水平右对齐;top:上下顶部对齐
    left: "left",
    right: "right",
    top: "top"
  },
  CONTROL: {
    show: {show: true},
    hide: {show: false},
    require: {conf: {required: true}},
    optional: {conf: {required: false}},
    view: {conf: {mode: 'view'}},
    disable: {conf: {disabled: true}},
    editable: {conf: {mode: 'default', disabled: false}},
  },
  traverse2Data: traverse2Data,
  traverse2BillData: traverse2BillData,
  buildServerData: buildServerData,
  controlhandler: controlhandler
};
