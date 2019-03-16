var _ = require('lodash-compat');
import { transferFieldType } from './util';
import { isEmptyString } from '../util/data';

// 属性白名单
function copyProp(model,_model,props){
    if(_.isEmpty(_model)){
        return;
    }
    _.forEach(props,function(prop){
        if(_model.hasOwnProperty(prop)){
            model[prop]=_model[prop];
        }
    });
}
// 透传属性并处理优先级
function copyConfPrecedenceProp(model,_model,props=[]){
    if(_.isEmpty(_model)){
        return;
    }
    _.forEach(props.concat(Object.keys(_model.conf)||[]),function(prop){
        if(model.hasOwnProperty(prop)) {
            return;
        }
        if((props||[]).indexOf(prop)!==-1){ // 优先取conf中的属性
            model[prop]=_model.conf[prop]||_model[prop];
        }else { // 否则避开已存在的属性, 全部透传
            model[prop]=_model.conf[prop];
        }
    })
}

/**
 * 输入框组件中是否包含了必填项
 */
function getRequiredInInput(conf) {
    var required = false, validation = '';
    if(conf&&conf.validator){
        _.forEach(conf.validator.onBlur||[],function(rule){
            if(rule.required) {
                required = true;
                validation = rule.message;
                return {
                    required,
                    validation
                };
            }
        });
        if(!required){
            _.forEach(conf.validator.onChange||[],function(rule){
                if(rule.required) {
                    required = true;
                    validation = rule.message;
                    return {
                        required,
                        validation
                    };
                }
            });
        }
    }
    return {
        required,
        validation
    };
}
/**
 * bind 自定义而传入的方法.
 */
function bindActionHandle(handles,model,actions,bill) {
    if(!actions || !Array.isArray(handles)) {
        return;
    }
    (handles||[]).forEach(act => {
        if (actions[act]&&_.isFunction(actions[act])) {
            model[act] = actions[act].bind(null,bill);
        }
    });
}
/**
 * bind 组件中的validator
 * 要避免重复绑定
 */
function bindValidator(_model,model,bill){
    if(_model.conf && _model.conf.validator && _.isObject(_model.conf.validator)){
        model.validator = _.cloneDeep(_model.conf.validator);
        //找到validator
        _.forEach(model.validator.onBlur||[],function(rule){
            if(rule.validator&&_.isFunction(rule.validator)) {
                rule.validator = rule.validator.bind(null, bill);
            }else{
                delete rule.validator;
            }
        });
        _.forEach(model.validator.onChange||[],function(rule){
            if(rule.validator&&_.isFunction(rule.validator)) {
                rule.validator = rule.validator.bind(null, bill);
            }else{
                delete rule.validator;
            }
        });
    }
}
/**
 * bind 组件中的一些方法
 * 要避免重复绑定
 */
function bindFunction(props,_model,model,bill){
    if (Array.isArray(props) && props.length > 0 && _model.conf) {
        props.forEach(prop => {
            let func = _model.conf[prop];
            if (func) {
                if (prop === "validator" && !_.isFunction(func)) {
                    bindValidator(_model,model,bill);
                } else {
                    model[prop] = func.bind(null, bill);
                }
            }
        })
    }
}
/**
 * 转换成 boolean 类型
 * @param value
 * @param defaultValue 默认值
 */
function getBoolean(value,defaultValue=false) {
    if(defaultValue){
        return value===false||value==="false"?false:true;
    }else{
        return value===true||value==="true"?true:false;
    }
}

/**
 * 处理bill item 之间的转换和解析
 */
module.exports = {
    parseModel: function (_model,actions,bill) {
        //var model = {},commonProps=['code','name','type','mode','show','disabled'];
        //处理公共的
        !_model.conf && (_model.conf = {});
        var model = {
            label:_model.label||_model.name,
            mode:(_model.conf.mode||_model.mode)==="view"?'view':"default",
            disabled:getBoolean(!isEmptyString(_model.conf.disabled)?_model.conf.disabled:_model.disabled),
            required:getBoolean(!isEmptyString(_model.conf.required)?_model.conf.required:_model.required),
            show: getBoolean(_model.show,true),
        };
        if (_model.name) {
            console.error("Bill 的 field 请使用 label 来代替 name");
        }
        transferFieldType(_model);
        copyProp(model,_model,['code','type','addonBefore','addonAfter','full','showHeader','alignment']);
        copyConfPrecedenceProp(model,_model,['defaultValue','validation','placeholder','emptyLabel','pattern','model','range','locale']);
        switch (model.type) {
            case "text":
            case "number":
            case "password":
                if(_model.conf&&_model.conf.validator){
                    //遍历出来validator 替换上去
                    var getRequired = getRequiredInInput(_model.conf);
                    if (getRequired.required) {
                        model.required = getRequired.required;
                        model.validation = getRequired.validation;
                    }
                }
                bindActionHandle(["onFocus","onBlur","onClear","onKeyDown"],model,actions,bill);
                bindFunction(['validator'],_model,model,bill);
                break;
            case "textarea":
                if(_model.conf&&_model.conf.validator){
                    //遍历出来validator 替换上去
                    var getRequired = getRequiredInInput(_model.conf);
                    if (getRequired.required) {
                        model.required = getRequired.required;
                        model.validation = getRequired.validation;
                    }
                }
                bindActionHandle(["onFocus","onBlur","onClear"],model,actions,bill);
                bindFunction(['validator'],_model,model,bill);
                break;
            case "time":
                bindFunction(['validator','disabledHours','disabledMinutes','disabledSeconds'],_model,model,bill);
                break;
            case "date":
                bindFunction(['validator','disabledDate'], _model,model,bill);
                break;
            case "rangeDate":
                bindFunction(['validator','disabledDate'], _model,model,bill);
                break;
            case "autoText":
                if(_model.conf&&_model.conf.validator){
                    //遍历出来validator 替换上去
                    var getRequired = getRequiredInInput(_model.conf);
                    if (getRequired.required) {
                        model.required = getRequiredInInput(_model.conf).required;
                        model.validation = getRequiredInInput(_model.conf).validation;
                    }
                }
                bindActionHandle(["onFocus","onBlur","onSelect","onClear","onKeyDown"],model,actions,bill);
                bindFunction(['validator'],_model,model,bill);
                break;
            case "select":
            case "treeSelect":
                if (!('checkValueConstructor' in model)) {
                    model.checkValueConstructor = false;
                }
                bindActionHandle(["onFocus","onBlur","onSelect","onClear","onKeyDown"],model,actions,bill);
                bindFunction(['validator'],_model,model,bill);
                break;
            case "multiSelect":
            case "treeMultiSelect":
                if (!('checkValueConstructor' in model)) {
                    model.checkValueConstructor = false;
                }
                bindActionHandle(["onFocus","onBlur","onSelect","onDeSelect","onClear","onKeyDown"],model,actions,bill);
                bindFunction(['validator'],_model,model,bill);
                break;
            case "checkbox":
                if(_.isEmpty(model.model)&&model.range){
                    model.model = model.range;
                    delete model.range;
                }
                bindFunction(['validator'],_model,model,bill);
                break;
            case "radio":
                if(_.isEmpty(model.model)&&model.range){
                    model.model = model.range;
                    delete model.range;
                }
                bindFunction(['validator'],_model,model,bill);
                break;
            case "upload":
                bindActionHandle(["onError","onSuccess","onBeforeUpload","onDelete"],model,actions,bill);
                bindFunction(['validator'],_model,model,bill);
                break;
        }
        return model;
    }
};