import React, { PropTypes } from 'react';
//类型支持的组件
import _ from 'lodash-compat';
import { ALIGNMENT } from './Helper';
import { getSafetyString, getComponent } from '../util/data';

// TODO TREE

/**
 * 把属性绑定上来
 */
var CustomBillItem = React.createClass({
  initialed: false,
  propTypes: {
    Component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired
  },
  getDefaultProps: function () {
    return {}
  },
  /**
   * 对传入的model进行拆分 进行parse
   */
  getInitialState: function () {
    return this.init(this.props);
  },
  /**
   * 初始化model
   */
  init: function (props) {
    var state;
    if (!_.isEmpty(props.model)) {
      this.bill = props.parent;
      this.initialed = true;
      // 把配置文件里的属性都挪到外层来,方便获取
      state = Object.assign({}, props, props.model, { model: props.model });
      state.size = state.size || props.size;
      state.alignment = ALIGNMENT[state.alignment || props.alignment] || ALIGNMENT.right;
      state.prefixCls = state.prefixCls || props.prefixCls;
      props.mode === 'view' && (state.mode = 'view');
      state.onChange = props.onChange;
      state.parent = props.parent;
      state.show = ![false, 'false'].includes(props.model.show);
      props.onFetchData && (state.onFetchData = props.onFetchData);
    }
    return state;
  },
  shouldComponentUpdate: function (props, state) {
    return this.state !== state;
  },
  /*
   * 同理只认第一次传入的model
   */
  componentWillReceiveProps: function (props) {
    if (!props.updateHandly || !this.initialed) {
      var state = this.init(props);
      this.setState(state);
    }
  },
  render: function () {
    if (!this.initialed) {
      return null;
    }
    let { ...props, show } = this.state;
    let { Component, parent } = this.props;
    // TODO 对于 show 为 false 的自定义组件，进行隐藏
    return getComponent(Component, { ...props, parent }, 'element');
  },
  /**
   * 被外部赋值过来
   */
  setValue: function (value) {
    var self = this;
    // 第一步 赋值
    this.setState({ value: value }, () => {
      var fetchEvent = self.bill.fetchs[self.state.code], controlEvent = self.bill.controls[self.state.code];
      // 第二步 fetch 判断本身是否有fetch 需不需要触发fetch
      if (fetchEvent && fetchEvent.auto) {
        //去获取数据 然后赋值
        self.parent.doFetchHandler(self.props.model, fetchEvent);
      }
      // 第三步 control 判断本身是否有control 触发control
      if (controlEvent) {
        //解析control
        self.bill.doControlHandler(self.state.code, self.bill.getData()[self.state.code], controlEvent);
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
  clear: function () {
    if (this.refs.element && this.refs.element.clear) {
      this.refs.element.clear();
    }
  },
  /**
   * 重置组件的状态
   */
  reset: function () {
    this.setState({ value: "" });
    if (this.refs.element && this.refs.element.reset) {
      this.refs.element.reset();
    }
  },
  /**
   * 校验
   */
  validate: function () {
    if (!this.state.show) return true;
    if (this.refs.element && this.refs.element.validate) {
      return this.refs.element.validate();
    }
    return true;
  },
  /**
   * 变更显示
   * @param model 更新state
   */
  updateModel: function (model) {
    if (!_.isEmpty(model)) {
      var state = this.init(Object.assign({}, this.props, { model: Object.assign({}, this.props.model, model) }));
      this.setState(state);
    }
  }
});


module.exports = CustomBillItem;