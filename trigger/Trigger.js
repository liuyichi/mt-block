import React, { Component, PropTypes } from 'react';
import { findDOMNode, unstable_renderSubtreeIntoContainer as renderSubtreeIntoContainer, unmountComponentAtNode } from 'react-dom';
import domAlign from 'dom-align';
import { noop, isWindow, isEmptyString } from '../util/data';
import classnames from 'classnames';

const PLACEMENTS = {
  points: ['tl', 'bl'],
  offset: [0, 2],
  overflow: {
    adjustX: 0,
    adjustY: 0,
  }
};

/**
 * 定位弹窗位置
 */
export default class Trigger extends Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    popupClassName: PropTypes.string,
    className: PropTypes.string,
    visible: PropTypes.bool,
    defaultVisible: PropTypes.bool,
    equalTargetWidth: PropTypes.bool,
    equalTargetHeight: PropTypes.bool,
    align: PropTypes.object,
    autoDestory: PropTypes.bool,
    getPopupContainer: PropTypes.func,
    target: PropTypes.func,
    onAfterVisible: PropTypes.func,
    onAlign: PropTypes.func,
  };
  static defaultProps = {
    prefixCls: 'mt',
    popupClassName: '',
    align: PLACEMENTS,
    visible: null,                  // 是否显示
    defaultVisible: false,                  // 是否显示
    equalTargetWidth: true,          // 是否与参照节点等宽
    equalTargetHeight: false,          // 是否与参照节点等高
    autoDestory: false,              // 是否自动销毁, 如果设置为 true, 不显示或者卸载时销毁
    getPopupContainer: null,         // 弹出到的父节点, 返回一个 DOM 节点
    target() {return document.body}, // 相对于 target 来定位, 返回一个 DOM 节点
    onAfterVisible: noop,   // 当 visible 变化时的回调函数
    onAlign: noop,   // 重新计算弹出框的位置的函数
  };
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible || props.defaultVisible,
      alignCls: (props.align.points || []).join('_'),
    };
  }
  componentDidMount() {
    this.componentDidUpdate({}, {visible: this.state.visible});
    window.addEventListener('resize', this.forceAlign, false);
  }
  componentDidUpdate(
    {align: preAlign, equalTargetWidth: preWidth, equalTargetHeight: preHeight, target: preTarget},
    { visible: preVisible })
  {
    const { autoDestory, onAfterVisible, align, equalTargetWidth, equalTargetHeight, target } = this.props;
    const { visible } = this.state;
    let self = this;
    if (!visible) { // 现在要隐藏
      if (autoDestory) { // 要移除dom
        this.removePopup();
      } else if (preVisible) { // 显示 => 不显示
        this.renderSubtreeComponent(()=>{ // 这里直接 invisible 样式控制不显示, 减少计算
          onAfterVisible(visible);
        });
      }
    } else {  // 现在要显示
      this.renderSubtreeComponent(function() {
        let reAlign = false;
        // 不显示 => 显示, 显示 => 变化宽度, 显示 => 变化位置 >>>> 则去重新计算位置
        if (!preVisible || (preWidth !== equalTargetWidth || preHeight !== equalTargetHeight || !_.isEqual(preAlign, align))) {
          reAlign = true;
        } else {  // 显示 => 显示,也没有变化位置的请求
          const lastTarget = preTarget();
          const currentTarget = target();
          if (isWindow(lastTarget) && isWindow(currentTarget)) {
            reAlign = false;
          } else if (lastTarget !== currentTarget) { // 父节点不同 则去重新计算位置
            reAlign = true;
          }
        }
        if (reAlign) {
          self.forceAlign();
        }
        if (preVisible !== visible) {
          onAfterVisible(visible);
        }
      });
    }
  }
  componentWillReceiveProps({ visible }) {
    if (visible !== this.state.visible) {
      this.setState({
        visible,
      });
    }
  }
  componentWillUnmount() {
    this.removePopup();
    window.removeEventListener('resize', this.forceAlign, false);
  };

  // 获取父DOM
  _getContainer = () => {
    const { getPopupContainer, target, popupClassName } = this.props ;
    const popupContainer = document.createElement('div');
    const parentNode = getPopupContainer ? getPopupContainer() : target();
    parentNode.appendChild(popupContainer);
    popupContainer.setAttribute('class', `mt-trigger-wrapper${popupClassName ? ' '+popupClassName : ''}`);
    return popupContainer;
  };

  // 渲染内容至某DOM节点
  renderSubtreeComponent = (ready) => {
    if (!this._container) {
      this._container = this._getContainer();
    }
    let self = this;
    if (this._container) {
      renderSubtreeIntoContainer(this, this.renderContentComponent(), this._container, function () {
        self._component = this; // 保存当前弹出框的 DOM
        if (ready) {
          ready.call(this);
        }
      });
    }
  };
  // 渲染内容
  renderContentComponent() {
    let { prefixCls, className, children, autoDestory, align } = this.props;
    let { visible, alignCls } = this.state;
    if (!visible && autoDestory) {
      return null;
    }
    prefixCls += '-trigger';
    const cls = classnames({
      [`${className}`]: className,
      [`${prefixCls}`]: true,
      [`${prefixCls}-${alignCls}`]: alignCls,
      [`${prefixCls}-useCssBottom`]: align.useCssBottom,
      [`${prefixCls}-useCssRight`]: align.useCssRight,
      [`${prefixCls}-invisible`]: !visible,
    });

    return (
      <div className={cls}>
        {children}
      </div>
    )
  };
  render() {
    return null;
  }

  /**
   * 移除弹出框
   */
  removePopup = () => {
    if (this._container) {
      const container = this._container;
      unmountComponentAtNode(container);
      container.parentNode.removeChild(container);
      this._container = null;
    }
  };
  removeContainer = () => {
    console.warn("removeContainer 将被废弃, 请使用 removePopup 来代替");
    this.removePopup();
  };
  /**
   * 获得当前弹出的DOM
   */
  getPopupDOMNode = () => {
    return this._container;
  };
  getTriggerDOM = () => {
    console.warn("getTriggerDOM 将被废弃, 请使用 getPopupDOMNode 来代替");
    return this.getPopupDOMNode();
  };

  /**
   * 重新定位弹出的元素
   */
  forceAlign = () => {
    // 去渲染
    const props = this.props;
    const { equalTargetWidth, equalTargetHeight, align, onAlign } = props;
    const popup = findDOMNode(this._component);
    if (!popup) {
      return;
    }
    const target = props.target();
    if (!target) {
      return;
    }
    // 计算宽度/高度
    popup.style.width = equalTargetWidth ? target.getBoundingClientRect().width + 'px' : "auto";
    popup.style.height = equalTargetHeight ? target.getBoundingClientRect().height + 'px' : "auto";
    if (this.state.visible) {
      const source = findDOMNode(this._component);
      let res = domAlign(source, target, Object.assign({}, PLACEMENTS, align));
      let alignCls = (res.points || []).join("_");
      onAlign(source, res);
      this.setState({alignCls});
    }
  };
}