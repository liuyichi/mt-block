var React = require('react');
var ReactDOM = require("react-dom");
var M = require('../util').default;
var _ = require('lodash-compat');
var Helper = require('./Helper');
// TODO tips when billDataChanged
//import { page } from '../index';
var CustomBillItem = require('./CustomBillItem');
var BillItem = require('./BillItem');
import { isEmptyString, getSafetyString, buildSelectData, isObject, isFunction, getComponent } from '../util/data';
import { getParamList, getFieldModel as getFieldModelFromModels, transferFieldType } from './util';

/**
 * bill
 * 传入的参数如下:
 * prefixCls            组件的前缀
 * className            不多说
 * mode                 Bill的状态
 * model || initModel   渲染的配置model 只支持1次  后续更改使用setModel
 * data || initData     外部传入的数据只支持1次  后续更改使用setData
 * notice               值发生改变时是否要通知出去
 * fieldAction          值发生改变 完成之后的回调
 * parent               bill的父组件
 */
// TODO required 的样式没有加
// TODO notice 没有起作用

var Bill = React.createClass({
    modelInitial: false, //model初始化完成标志
    dataInitial: false,  //data初始化完成标志
    getDefaultProps: function () {
        return {
            prefixCls: 'mt', //样式前缀
            //column: 2, // 默认一行显示两个
            initModel: {},//初始化加载的model 使用场景在与 传入一次model之后后续外部不再修改
            initData: {},//初始化传入的data 使用场景在与 传入一次data之后后续外部不再修改
            elementFactory: {},// 自定义字段部分的map code做key
            //validateFactory: {}, // 校验的自定义操作map code做key
            notice: true, //值发生改变时是否通知全局
            parent: null, //父组件
            onFieldChange: null, //字段发生改变时回调上层的方法
            fieldAction: null //字段发生改变时回调上层的方法
            //alignment: Helper.ALIGNMENT.LEFT //对齐方式
        }
    },
    getInitialState: function () {
        // 构建显示的model和数据
        var _model = (!_.isEmpty(this.props.model)) ? this.props.model : ((!_.isEmpty(this.props.initModel)) ? this.props.initModel : {}),
        //_validateFactory = this.props.validateFactory,
          state = {};
        if (_.isEmpty(_model)) {
            state = {
                model: {},
                forms: [],
            };
        } else {
            this.modelInitial = true;
            var dataFactory = Helper.buildDataFactory(_model);
            state = {
                model: _model,
                forms: Helper.buildRenderForms(_model),
                changeFactory: Helper.buildChangeFactory(_model, dataFactory, this.fieldHandler),
                dataFactory: dataFactory,
                elementFactory: Helper.buildElementFactory(_model),
                actionFactory: Helper.buildActionFactory(_model),
                //validateFactory: Helper.buildValidateFactory(_actionFactory, _model),
                defaultData: Helper.buildDefaultData(_model),
            };
        }
        return state;
    },
    componentDidMount: function () {
        if (this.props.fieldAction) {
            console.warn("Bill 组件接受属性 fieldAction 请替换成 onFieldChange");
        }
        this.code = this.state.model.code;
        // 如果这个时候 有model了但是没有data 则用model中自带的初始值
        if (this.modelInitial && !this.dataInitial) {
            var data = (!_.isEmpty(this.props.data)) ? this.props.data : ((!_.isEmpty(this.props.initData)) ? this.props.initData : {});
            var defaultData = this.state.defaultData;
            if (_.isEmpty(data)) {
                this.setData(defaultData);
            } else {
                //合并默认值和赋值
                if(!_.isEmpty(defaultData)){
                    for(var prop in defaultData){
                        if(!data.hasOwnProperty(prop)){
                            data[prop] = defaultData[prop];
                        }
                    }
                }
                // 2016.11.17 add by liukaimei 标识已经有data了
                this.dataInitial = true;
                this.setData(data);
            }
        }
    },
    /**
     * 传入nextProps 来更新操作
     * FIXME model initModel data initData 只使用第一次不为空的
     */
    componentWillReceiveProps: function (nextProps) {
        //model 没有初始化
        if (!this.modelInitial) {
            // props.model 的优先级高于 props.initModel
            var model = (!_.isEmpty(nextProps.model)) ? nextProps.model : ((!_.isEmpty(nextProps.initModel)) ? nextProps.initModel : {});
            if (!_.isEmpty(model)) {
                //处理model
                this._parseModel(model);
                this.code = model.code;
                this.modelInitial = true;
                this.forceUpdate(()=> {
                    if (!this.dataInitial) {
                        var data = (!_.isEmpty(nextProps.data)) ? nextProps.data : ((!_.isEmpty(nextProps.initData)) ? nextProps.initData : {});
                        var defaultData = this.state.defaultData;
                        if (_.isEmpty(data)) {
                            this.setData(defaultData);
                        } else {
                            //合并默认值和赋值
                            if(!_.isEmpty(defaultData)){
                                for(var prop in defaultData){
                                    if(!data.hasOwnProperty(prop)){
                                        data[prop] = defaultData[prop];
                                    }
                                }
                            }
                            this.dataInitial = true;
                            this.setData(data);
                        }
                    }
                });
            }
        }
        //判断data初始化了 没有的话初始化data
        if (this.modelInitial && (!this.dataInitial)) {
            //data 没有初始化
            var data = (!_.isEmpty(nextProps.data)) ? nextProps.data : ((!_.isEmpty(nextProps.initData)) ? nextProps.initData : {});
            if (!_.isEmpty(data)) {
                this.dataInitial = true;
                //处理数据
                this.setData(data);
            }
        }
    },
    /**
     * 序列化model
     */
    _parseModel: function (model) {
        var _model = model;
        this.state.model = _model;
        this.state.forms = Helper.buildRenderForms(_model);
        this.state.actionFactory = Helper.buildActionFactory(_model);
        this.state.dataFactory = Helper.buildDataFactory(_model);
        this.state.changeFactory = Helper.buildChangeFactory(_model, this.state.dataFactory, this.fieldHandler);
        this.state.elementFactory = Helper.buildElementFactory(_model);
        this.state.defaultData = Helper.buildDefaultData(_model);
    },
    /**
     * 序列化数据
     */
    _parseData: function (data) {
        return {
            data: data,
            renderData: Helper.buildRenderData(data, this.state.model)
        };
    },
    getModel: function () {
        return this.state.model;
    },
    /**
     * 改变model 重新渲染数据
     * @param model 新的model 更新到props.model
     * @param callback 更新完成之后的回调方法
     */
    setModel:function (model, callback) {
        this._parseModel(model);
        this.forceUpdate(()=>{
            let element, data = {};
            Object.keys(this.refs).forEach(code => {
                element = this.refs[code];
                if (element) {
                    let field = this.getFieldModel(code);
                    transferFieldType(field);
                    element.updateModel && element.updateModel(field);
                    // 如果是新出现的字段, 去添加它的默认值
                    let defaultValue = (field.conf||{}).hasOwnProperty("defaultValue") ? field.conf.defaultValue : (field.hasOwnProperty("defaultValue") ? field.defaultValue : null);
                    if (!this.data.renderData.hasOwnProperty(code) && defaultValue != null) {
                        if (field.type === "select" || field.type === "treeSelect") {
                            data[code] = buildSelectData(field, defaultValue);
                        } else {
                            data[code] = defaultValue;
                        }
                    }
                }
            });
            if (!_.isEmpty(data)) {
                this.setFieldsData(data);
            }
            callback&&callback();
        });
    },
    /**
     * 设置某个字段的model
     */
    setFieldModel: function (code, model) {
        var element = this.getElement(code);
        if (element && element.updateModel) {
            element.updateModel(model);
        }
    },
    setFieldModelByCodes: function (code, model) {
        console.warn("setFieldModelByCodes 将被废弃, 请使用 setFieldModel 来代替");
        this.setFieldModel(code, model);
    },
    /**
     * 改变data 重新渲染数据 外部使用需要全触发
     * TODO 设置之后 显示的和getData()的数据不一致
     * @param data 新的data 更新props.data
     * @param callback 更新成功之后的回调
     */
    setData: function (data, callback) {
        data = this._parseData(_.cloneDeep(data));
        //把data暂存起来
        this.data = data;
        var renderData = data.renderData, self = this, element;
        //遍历fields来匹配renderData
        _.forEach(self.fields, function (field) {
            element = self.refs[field.code];
            element && (element.setValue(renderData[field.code]));
        });
        callback && callback();
        this.forceUpdate();
    },
    /**
     * 改变data的某个或某些值
     * @param source  key:value形式的数据
     * @param callback 更新成功之后的回调
     * @param notNowUpdate 不立刻执行
     * @param noWarn 是否不校验select系列组件的数据结构
     */
    setFieldsData: function (source, callback, notNowUpdate, noWarn) {
        //值发生改变之后更新的
        //如果是外部赋值 需要把值转换为bill的
        if (source) {
            var self = this, element, renderValue, customCodes = [];
            for (var prop in source) {
                element = self.refs[prop];
                if (element && element.props.model && !_.isEmpty(self.data)) {
                    //把外部传入的数据 转换为渲染显示的数据
                    renderValue = Helper.traverse2BillData(element.props.model,source,noWarn);
                    self.data.renderData[prop] = renderValue;
                    self.data.data[prop] = source[prop];
                    if (!notNowUpdate) {
                        element.props.model.type === "custom" ? customCodes.push(prop) : element.setValue(renderValue);
                    }
                } else {
                    self.data.data[prop] = source[prop];
                }
            }
            if (!notNowUpdate) { // 自定义组件的渲染可能需要判断其他数据, 需要最后渲染
                customCodes.forEach(prop => self.refs[prop].setValue(self.data.renderData[prop]));
            }
            callback && callback();
            this.forceUpdate();
        }
    },
    setFieldDataByCodes: function (source, callback, notNowUpdate) {
        console.warn("setFieldsDataByCodes 将被废弃, 请使用 setFieldsData 来代替");
        this.setFieldsData(source, callback, notNowUpdate);
    },
    /**
     * 获取当前bill的数据 用于提交的数据
     */
    getData: function () {
        if (this.data && this.data.data) {
            return Helper.buildServerData(this.data.data,this.data.renderData,this.state.model);
        }
        return {};
    },
    /**
     * 获取当前bill的数据 用于渲染的数据
     */
    getRenderData: function () {
        if (this.data) {
            return this.data.renderData || {};
        }
        return {};
    },
    /**
     * 获取当前bill的主键
     */
    getIdField: function () {
        if (this.state.model) {
            return this.state.model.idField;
        }
    },
    /**
     * 校验单据
     */
    validate:function () {
        var validated = true,self=this;
        _.forEach(this.fields,function(field){
            if(self.refs[field.code]&&self.refs[field.code].validate){
                if(!self.refs[field.code].validate()){
                    validated = false;
                }
            }
        });
        return validated;
    },
    /**
     * 单独校验某个字段
     */
    doFieldValidate: function (code) {
        var validated = true;
        if(this.refs[code]&&this.refs[code].validate){
            if(!this.refs[code].validate()){
                validated = false;
            }
        }
        return validated;
    },
    validateByCode: function (code) {
        console.warn("validateByCode 将被废弃, 请使用 doFieldValidate 代替");
        this.doFieldValidate(code);
    },
    /**
     * 清空单据,把能操作的单据数据和状态都清除掉
     */
    clear: function () {
        var element,self=this;
        _.forEach(this.fields,function(field){
            element = self.refs[field.code];
            if(element&&element.clear){
                element.clear();
            }
        });
    },
    /**
     * bill的reset方法
     * 把数据还原成默认值
     * 把其他状态都清除掉
     */
    reset:function(){
        var element,self=this;
        _.forEach(self.fields, function (field) {
            element = self.refs[field.code];
            if(element&&element.reset){
                element.reset();
            }
        });
        this.data = this._parseData(_.clone(this.state.defaultData));
    },
    /**
     * 获取指定的element
     */
    getField: function (code) {
        let field = this.getFieldModel(code) || {};
        return this.refs[code] && this.refs[code].refs.element;
    },
    getElement: function (code) {
        return this.refs[code];
    },

    render: function () {
        if(!this.modelInitial){
            return null;
        }
        var self = this,model = this.state.model;
        let { className, prefixCls, size, mode } = this.props;
        prefixCls += '-bill';
        self.fields = [];
        var outCls = M.classNames(
          className,
          `${prefixCls}`,
          size==="small"&&`${prefixCls}-sm`,
          mode==="view"&&`${prefixCls}-view`,
          `${prefixCls}-column-${model.column || 2}`
        );
        return (
          <div className={outCls}>
              {
                  this.state.forms.map(function (form, key) {
                      let show = isFunction(form.show) ? form.show(self, form, key) : form.show;
                      return show ? (
                        <div key={key} className={`${prefixCls}-form `+form.code}>
                            {form.label ? <div className="form-header">
                                {getComponent(form.label, {bill: self, model: form, index: key})}
                            </div> : ""}
                            {form.fields.map(function (field, fieldKey) {
                                  var content, Element, props = {}, stateless = false;
                                  var onFetchData = self.state.dataFactory(field.code, self, "bind");
                                  (onFetchData) && (props.onFetchData = onFetchData);
                                  if (field.type == "custom") {
                                      Element = self.state.elementFactory(field.code);
                                      content = <CustomBillItem key={field.code+"_"+fieldKey}
                                                                ref={field.code}
                                                                className={"_"+field.code+"_"}
                                                                model={field}
                                                                updateHandly={field.updateHandly}
                                                                size={self.props.size}
                                                                mode={self.props.mode}
                                                                prefixCls={self.props.prefixCls}
                                                                alignment={self.state.model.alignment||'right'}
                                                                onChange={self.state.changeFactory(field.code,self)}
                                                                parent={self}
                                                                Component={Element} />;
                                  } else {
                                      if(field.type == "treeSelect" || field.type == "treeMultiSelect") {
                                          var onFetchNodeData = self.state.dataFactory(field.code, self, "bindNode");
                                          (onFetchNodeData) && (props.onFetchNodeData = onFetchNodeData);
                                      }
                                      if(field.type == "upload") {
                                          var onUpload = self.state.dataFactory(field.code, self, "upload");
                                          (onUpload) && (props.onUpload = onUpload);
                                      }
                                      var actions = self.state.actionFactory(field.code);
                                      (!_.isEmpty(actions)) && (props.actions = actions);
                                      content = <BillItem key={field.code+"_"+fieldKey}
                                                          ref={stateless ? null : field.code}
                                                          className={"_"+field.code+"_"}
                                                          model={field}
                                                          size={self.props.size}
                                                          mode={self.props.mode}
                                                          prefixCls={self.props.prefixCls}
                                                          alignment={self.state.model.alignment}
                                                          onChange={self.state.changeFactory(field.code,self)}
                                                          getPopupContainer={self.props.getPopupContainer?self.props.getPopupContainer:()=>ReactDOM.findDOMNode(self)}
                                                          parent={self}
                                        {...props}/>;
                                  }
                                  self.fields.push(field);
                                  return content;
                              }
                            )}
                        </div>
                      ) : "";
                  })
              }
          </div>
        );
    },
    /**
     * 当bill item 值发生改变时 会回调到这个方法
     * @param code 触发的field.code
     * @param value 改字段改变后的值
     */
    fieldHandler: function (code, value) {
        //如果设置了notice bill值发生改变的时候通知给page
        if(this.props.notice){
            // FIXME
            //page.billDataChanged = true;
        }
        let handler = this.props.onFieldChange || this.props.fieldAction;
        handler && handler(code, value, this);
    },
    /**
     * 触发特殊情况fetch时执行该方法
     * @param code 触发的field.code
     * FIXME 把每次覆盖的值 存到一个map中去 bill.fetchMap = {"fetchCode":['field1','field2']}
     */
    doFetchHandler: function (code,value,fields) {
        //获取数据设置值
        var handler = this.state.dataFactory(code, this, 'fetch'), self = this;
        if (!self.fetchMap) {
            self.fetchMap = {};
        }
        self.fetchMap[code] = [];
        if (handler) {
            // 调整下handler的参数顺序
            handler(value,function (data) {
                //更新数据 若没有设置参数，全部更新，否则只更新设置参数
                var upData = {};
                if(!fields || fields.length == 0){
                    upData = data ;
                }else {
                    fields = getParamList(fields);
                    (fields||[]).map(v=>{
                        if(data.hasOwnProperty(v.fromCode)){
                            upData[v.code] = data[v.fromCode];
                        }
                    })
                }
                self.setFieldsData(upData, function(){
                    //记录都更新了那些field
                    for (var prop in upData) {
                        if (self.refs[prop]) {
                            self.fetchMap[code].push(prop);
                            self.refs[prop].clear();
                        }
                    }
                });

            });
        }

    },
    /**
     * 触发特殊情况control时执行该方法
     * @param code 触发的code
     * @param value 触发的field 的值
     * @param event 事件的配置
     */
    doControlHandler: function (code,value,event) {
        var handler = this.state.dataFactory(code, this, 'control');
        if (handler) { // add by liukaimei 接收 onControl 的自定义事件
            // 调整下handler的参数顺序
            handler(value);
        } else {
            // 解析条件
            // 更改model
            // 更新整个界面
            //获取数据设置值
            if(event){
                var data = this.getData();
                data[code] = value;
                var control = Helper.controlhandler(event,data);
                this.doControl(control);
            }
        }
    },
    /**
     * 预留外部调用来控制
     * @param control
     */
    doControl:function(control){
        if(control){
            if ((control.option || []).length > 0) {
                console.warn('control 事件中 option 属性将被废弃, 请使用 optional 来代替');
            }
            var model=_.cloneDeep(this.state.model);
            Object.entries(control).forEach(([status, codes]) => {
                Array.isArray(codes) && codes.forEach(code => {
                    let field = getFieldModelFromModels(model, code);
                    if (field) {
                        let config = Helper.CONTROL[status] || {};
                        // TODO 目前只支持两级对象 merge, 提出多级 merge 的方法
                        if (Object.values(config).some(v => isObject(v))) { // 如果是要更新对象, 不能直接 merge
                            Object.entries(config).forEach(([prop, value]) => {
                                Object.assign(field, {[prop]: Object.assign({}, field[prop], value)})
                            })
                        } else {
                            Object.assign(field, config);
                        }
                    }
                })
            });
            this.setModel(model);
        }
    },
    /**
     * 值发生改变之后的回调
     * @param code
     * @param value
     */
    valueChangeHandler: function (code, value) {
        var prop = {}, field = this.getFieldModel(code);
        transferFieldType(field);
        prop[code] = value;
        //记录下数据
        this.setFieldsData(prop, ()=>{
            //执行下回调
            this.fieldHandler(code, prop[code]);
        }, null, 'noWarn');
    },
    /**
     * 获取指定的field的model
     */
    getFieldModel: function (code) {
        var field, fields = this.fields;
        for(var i=0;i<fields.length;i++){
            if(fields[i].code==code){
                field = fields[i];
                break;
            }
        }
        return field;
    },
    /**
     * 获取请求的参数
     * @param paramList 要获得的参数数组
     */
    getParameters: function (paramList) {
        var bill = this, parentBill = this.props.parent, billData = bill.getData(), parentData;
        // 增加属性的映射
        var _paramList = getParamList(paramList);
        if (paramList && paramList.length > 0) {
            var param = {}, fieldFromCode, fieldCode, index, billCode;
            for (var i = 0; i < _paramList.length; i++) {
                fieldFromCode = _paramList[i].fromCode;
                fieldCode = _paramList[i].code;
                index = fieldFromCode.indexOf('.');
                if (index > -1) { // 如果是从另一个表单获取数据
                    billCode = fieldFromCode.substring(0, index);
                    if (billCode == bill.code) {
                        param[fieldCode] = getSafetyString(billData[fieldFromCode.substring(index + 1, fieldFromCode.length)]);
                    } else if (parentBill && billCode == parentBill.code && parentBill.getData) {
                        parentData = parentBill.getData();
                        param[fieldCode] = getSafetyString(parentData[fieldFromCode.substring(index + 1, fieldFromCode.length)]);
                    }
                } else {
                    param[fieldCode] = getSafetyString(billData[fieldFromCode]);
                }
                if (_.isObject(param) && param[fieldFromCode] && param[fieldFromCode].value != undefined) {
                    param[fieldCode] = param[fieldFromCode].value;
                }
            }
            return param;
        }
        return {};
    },
});

export default Bill;
