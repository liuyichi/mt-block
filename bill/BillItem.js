import React from 'react';
//类型支持的组件
import { ALIGNMENT } from './Helper';
import _ from 'lodash-compat';
import Parse from './parse';
import Input from '../input';
import { DatePicker, RangePicker, TimePicker } from '../date-picker';
import Select from '../select';
import TreeSelect from '../tree-select';
import { CheckboxGroup } from '../checkbox';
import Upload from '../upload';
import { RadioGroup } from '../radio';
import { transferFieldType } from './util';
import { getSafetyString, isEmptyString, getComponent } from '../util/data';

// TODO TREE

/**
 * 把属性绑定上来
 */
function bindProps(state, list) {
    var props = {};
    _.forEach(list, function (prop) {
        if (state.hasOwnProperty(prop)) {
            props[prop] = state[prop];
        }
    });
    return props;
}

function deleteProps(state, list) {
    var props = _.cloneDeep(state);
    _.forEach(list, function (prop) {
        if (props.hasOwnProperty(prop)) {
            delete props[prop];
        }
    });
    return props;
}


/**
 *  bill的字段组件
 *  传入的参数如下:
 *  model
 *  alignment
 *  actions
 *  onFetchData
 *  onChange
 *  parent
 *  传入model 后续的修改不外乎几种
 *  1 赋值
 *  2 编辑状态改变
 *  3 显示状态改变
 *  4 显示状态改变
 *
 */
var BillItem = React.createClass({
    initialed: false,
    shouldComponentUpdate: function (props, state) {
        return this.state !== state;
    },
    getDefaultProps: function () {
        return {
            //
            //name: "", //label的值
            //code: "",
            //mode: "default",//显示的模式 default-->默认模式  view-->为只显示模式
            //readonly: false,
            //conf: {},//包含 showHeader(是否显示头) alignment(排列方式) required(是否必填项) trigger:"onChange"||"onBlur"
            //type: "",
            //required: false,
            //alignment: ALIGNMENT.right,
            //tooltip: ""
        }
    },
    /**
     * 对传入的model进行拆分 进行parse
     *
     */
    getInitialState: function () {
        return this.init(this.props);
    },
    labelElement: function (props) {
        var Label = this.state.label;
        //控制不显示头
        if (isEmptyString(Label) || (this.state.showHeader == false)) {
            return null;
        }
        return <label className="bill-item-label">
            {getComponent(Label, props)}
        </label>;
    },
    contentElement: function () {
        var content,
          props = deleteProps(this.state, ['code','label','type','addonBefore','addonAfter','show','full','showHeader','alignment']),
          cls="bill-item-content";
        switch (this.state.type) {
            case "text":
            case "password":
            case "number":
                content = <Input className={cls} ref="element" type={this.state.type}
                                 onFocus={this.state.onFocus}
                                 onBlur={this.state.onBlur}
                                 onClear={this.state.onClear}
                                 onChange={this.state.onChange} {...props}/>;
                break;
            case "textarea":
                content = <Input className={cls} ref="element" type="textarea"
                                 onFocus={this.state.onFocus}
                                 onBlur={this.state.onBlur}
                                 onClear={this.state.onClear}
                                 onChange={this.state.onChange} {...props} />;
                break;
            case "time":
                content = <TimePicker className={cls} ref="element"
                                      getPopupContainer={this.state.getPopupContainer}
                                      onChange={this.state.onChange} {...props}/>;
                break;
            case "date":
                content = <DatePicker className={cls} ref="element"
                                      getPopupContainer={this.state.getPopupContainer}
                                      onChange={this.state.onChange} {...props}/>;
                break;
            case "rangeDate":
                content = <RangePicker type="range" className={cls} ref="element"
                                       getPopupContainer={this.state.getPopupContainer}
                                       onChange={this.state.onChange} {...props}/>;
                break;
            case 'autoText':
                content = <Select className={cls} ref="element" combobox={true}
                                  getPopupContainer={this.state.getPopupContainer}
                                  onFetchData={this.state.onFetchData}
                                  onFocus={this.state.onFocus}
                                  onBlur={this.state.onBlur}
                                  onSelect={this.state.onSelect}
                                  onSearch={this.state.onSearch}
                                  onClear={this.state.onClear}
                                  onKeyDown={this.state.onKeyDown}
                                  onChange={this.state.onChange} {...props} />;
                break;
            case "select":
                content = <Select className={cls} ref="element"
                                  getPopupContainer={this.state.getPopupContainer}
                                  onFetchData={this.state.onFetchData}
                                  onFocus={this.state.onFocus}
                                  onBlur={this.state.onBlur}
                                  onSelect={this.state.onSelect}
                                  onSearch={this.state.onSearch}
                                  onClear={this.state.onClear}
                                  onKeyDown={this.state.onKeyDown}
                                  onChange={this.state.onChange} {...props} />;
                break;
            case "multiSelect":
                content = <Select className={cls} multiple={true} ref="element"
                                  getPopupContainer={this.state.getPopupContainer}
                                  onFetchData={this.state.onFetchData}
                                  onFocus={this.state.onFocus}
                                  onBlur={this.state.onBlur}
                                  onSelect={this.state.onSelect}
                                  onDeSelect={this.state.onDeSelect}
                                  onSearch={this.state.onSearch}
                                  onClear={this.state.onClear}
                                  onKeyDown={this.state.onKeyDown}
                                  onChange={this.state.onChange} {...props} />;
                break;
            case "treeSelect":
                content = <TreeSelect className={cls} ref="element"
                                      getPopupContainer={this.state.getPopupContainer}
                                      onFetchData={this.state.onFetchData}
                                      onFetchNodeData={this.state.onFetchNodeData}
                                      onFocus={this.state.onFocus}
                                      onBlur={this.state.onBlur}
                                      onSelect={this.state.onSelect}
                                      onSearch={this.state.onSearch}
                                      onClear={this.state.onClear}
                                      onKeyDown={this.state.onKeyDown}
                                      onChange={this.state.onChange} {...props} />;
                break;
            case "treeMultiSelect":
                content = <TreeSelect className={cls} multiple={true} ref="element"
                                      getPopupContainer={this.state.getPopupContainer}
                                      onFetchData={this.state.onFetchData}
                                      onFetchNodeData={this.state.onFetchNodeData}
                                      onFocus={this.state.onFocus}
                                      onBlur={this.state.onBlur}
                                      onSelect={this.state.onSelect}
                                      onDeSelect={this.state.onDeSelect}
                                      onSearch={this.state.onSearch}
                                      onClear={this.state.onClear}
                                      onKeyDown={this.state.onKeyDown}
                                      onChange={this.state.onChange} {...props} />;
                break;
            case "radio":
                content = <RadioGroup className={cls} ref="element"
                                      onChange={this.state.onChange} {...props} />;
                break;
            case "checkbox":
                content = <CheckboxGroup className={cls} ref="element"
                                         onChange={this.state.onChange} {...props} />;
                break;
            case "upload":
                content = <Upload className={cls} ref="element"
                                  onUpload={this.state.onUpload}
                                  onBeforeUpload={this.state.onBeforeUpload}
                                  onBeforeUploadAll={this.state.onBeforeUploadAll}
                                  onError={this.state.onError}
                                  onSuccess={this.state.onSuccess}
                                  onDelete={this.state.onDelete}
                                  onChange={this.state.onChange} {...props} />;
                break;
            case "ref":
                break;
            case "slave":
                break;
        }
        return content;
    },
    /**
     * 初始化model
     */
    init: function (props) {
        var state, model;
        if (!_.isEmpty(props.model)) {
            model = props.model;
            this.bill = props.parent;
            this.initialed = true;
            //不同类型来个不同的解析吧
            state = Parse.parseModel(model, props.actions, this.bill);
            state.actions = props.actions;
            state.size = state.size||props.size;
            state.alignment = ALIGNMENT[state.alignment || props.alignment]||ALIGNMENT.right;
            state.prefixCls = state.prefixCls||props.prefixCls;
            props.mode === 'view' && (state.mode = 'view');
            state.onChange = props.onChange;
            props.getPopupContainer && (state.getPopupContainer = props.getPopupContainer);
            props.onUpload && (state.onUpload = props.onUpload);
            props.onFetchData && (state.onFetchData = props.onFetchData);
            props.onFetchNodeData && (state.onFetchNodeData = props.onFetchNodeData);
        }
        return state;
    },
    /*
     * 同理只认第一次传入的model
     */
    componentWillReceiveProps: function (props) {
        if (!this.initialed) {
            var state = this.init(props);
            this.setState(state);
        }
    },
    render: function () {
        if(!this.initialed){
            return null;
        }
        if(!this.state.show){
            return null;
        }
        var className = `${this.props.prefixCls}-bill-item ${this.props.prefixCls}-bill-item-${this.state.type}`,
          alignment = this.state.alignment;
        //对齐方式
        className = className + " alignment-" + alignment;
        //只读
        if (this.props.readonly) {
            className = className + " readonly";
        }
        //必填
        if (this.state.required) {
            className = className + " required";
        }
        //只显示
        if (this.state.mode == "view") {
            className = className + " mode-view";
        }
        if(this.props.className){
            className+=" "+this.props.className;
        }
        if(this.state.full){
            className+=" bill-item-group-full";
        }else if(this.state.type=="textarea"&&this.state.full!==false){
            className+=" bill-item-group-full";
        }else if(this.state.type=="upload"&&this.state.full!==false){
            className+=" bill-item-group-full";
        }
        var AddonBefore = this.state.addonBefore;
        var AddonAfter = this.state.addonAfter;
        var props = {
            bill: this.props.parent,
            value: this.state.value,
            model: this.props.model,
        };
        return (
          <div className={className}>
              <div className="bill-item-group">
                  {this.labelElement(props)}
                  <div className={"bill-item-element" + ((AddonBefore || AddonAfter) ? " bill-item-element-addon" : "")}>
                      {AddonBefore && <div className="bill-item-addon-before">{getComponent(AddonBefore, props)}</div>}
                      {this.contentElement()}
                      {AddonAfter && <div  className="bill-item-addon-after">{getComponent(AddonAfter, props)}</div>}
                  </div>
              </div>
          </div>
        );
    },
    /**
     * 被外部赋值过来
     */
    setValue: function (value) {
        var self = this;
        // 第一步 赋值
        this.setState({value: value}, ()=> {
            var fetchEvent=self.bill.fetchs[self.state.code],controlEvent=self.bill.controls[self.state.code];
            // 第二步 fetch 判断本身是否有fetch 需不需要触发fetch
            if (fetchEvent && fetchEvent.auto) {
                //去获取数据 然后赋值
                self.parent.doFetchHandler(self.props.model, fetchEvent);
            }
            // 第三步 control 判断本身是否有control 触发control
            if (controlEvent) {
                //解析control
                self.bill.doControlHandler(self.state.code,self.bill.getData()[self.state.code], controlEvent);
            }
        });
    },
    /**
     * 获取数据
     */
    getValue: function () {
        return getSafetyString(this.state.value);
    },
    /**
     * 清空其他zhuangtai
     */
    clear:function(){
        if(this.refs.element&&this.refs.element.clear){
            this.refs.element.clear();
        }
    },
    /**
     * 重置组件的状态
     */
    reset:function(){
        this.setState({value:""});
        if(this.refs.element&&this.refs.element.reset){
            this.refs.element.reset();
        }
    },
    /**
     * 清空下拉数据  下次展开时会再去请求数据
     */
    clearOption: function () {
        if(this.refs.element&&this.refs.element.clearOption){
            this.refs.element.clearOption();
        }
    },
    /**
     * 校验
     */
    validate:function(){
        if(this.refs.element&&this.refs.element.validate){
            return  this.refs.element.validate();
        }
        return true;
    },
    /**
     * 变更显示
     * @param model 更新state
     */
    updateModel:function(model) {
        if(!_.isEmpty(model)) {
            var state = this.init(Object.assign({}, this.props, {model: Object.assign({}, this.props.model, model)}));
            this.setState(state);
        }
    }
});


module.exports = BillItem;