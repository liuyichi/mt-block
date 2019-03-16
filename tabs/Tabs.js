import React, { PropTypes, Component, isValidElement } from 'react';
import M from '../util';
import { Button } from '../button';
import { Icon } from '../icon';
import classNames from 'classnames';
import { isEmptyString, isFunction, noop, getComponent } from '../util/data';
import {
  PADDING, MODEL,
  getPositionMap, getScrollRight, getScrollLeft, getSizeValue,
  hasNext, hasPrev,
  isVertical, isTabsRight
} from './util';


/**
 * tab页签切换
 */
class Tabs extends Component {
  static PropTypes = {
    prefixCls: PropTypes.string,
    type: PropTypes.string,
    activeKey: PropTypes.any,
    defaultActiveKey: PropTypes.any,
    size: PropTypes.oneOf(['default', 'small', 'large']),
    disabled: PropTypes.bool,
    deleteIcon: PropTypes.bool,
    showPage: PropTypes.bool,
    autoDestory: PropTypes.bool,
    initAll: PropTypes.bool,
    position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    model: PropTypes.shape({
      idField: PropTypes.string,
      showField: PropTypes.string,
      iconField: PropTypes.string,
      deleteIcon: PropTypes.string,
      disableField: PropTypes.string,
      contentField: PropTypes.string,
    }),
    value: PropTypes.arrayOf(PropTypes.object),
    data: PropTypes.arrayOf(PropTypes.object),
    extraTab: PropTypes.node,
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
    onPrevClick: PropTypes.func,
    onNextClick: PropTypes.func,
  };
  static defaultProps = {
    prefixCls: 'mt', // 样式前缀
    type: 'default',  // tab 的样式类型 可选 `default` `card` 或者自定义
    defaultActiveKey: '',  // 默认选中的 tab 的 [idField]
    disabled: false,  // 是否禁用
    deleteIcon: false,  // 是否显示删除按钮
    showPage: true, // 是否分页
    initAll: false,  // 是否第一次就挂载所有tab的内容
    autoDestory: false,  // 是否自动移除未选中tab的内容, 如果 initAll 为 true, 则此属性不生效
    size: 'default', // 大小
    position: 'top',  // 页签位于内容的什么位置
    height: '',  // 组件的高度
    width: '',  // 组件的宽度
    model: {},   // 关键属性名的配置
    extraTab: null,  // 额外的标签显示
    onChange: null,  // 切换 tab 后触发的事件
    onDelete: noop,  // 点击图标后触发的事件
    onPrevClick: noop,  // 左切页触发事件
    onNextClick: noop,  // 右切页触发事件
  };
  constructor(props) {
    super(props);
    if ('value' in props) {
      //console.warn('请使用 Tabs 的属性 data 代替 value');
    }
    let { activeKey, model } = props;
    this.model = Object.assign({}, MODEL, model);
    this.state = {
      activeKey: activeKey || ''
    };
  }
  componentDidMount() {
    let { defaultActiveKey } = this.props;
    let value = this.getRenderValue(this.props);
    let { activeKey } = this.state;
    if (isEmptyString(activeKey)) { //如果没有传入的activeKey 或者 activeKey 不在 value 里，默认展示第一个tab页签
      activeKey = defaultActiveKey || '';
      let { idField } = this.model;
      if (value && value.length > 0 && !value.some(v => v[idField] === activeKey)) {
        activeKey = value[0] && value[0][idField];
      }
      this.setState({activeKey});
    }
  }
  componentWillReceiveProps(nextProps) {
    let { activeKey } = this.state;
    if (nextProps.hasOwnProperty('activeKey')) {
      activeKey = nextProps.activeKey || '';
    }
    let value = this.getRenderValue(nextProps);
    let { idField } = this.model;
    if (value && value.length > 0 && !value.some(v => v[idField] === activeKey)) {
      activeKey = value[0] && value[0][idField];
    }
    this.setState({activeKey});
  }
  getRenderValue(props) {
    return props.data || props.value || [];
  }
  render() {
    let { activeKey } = this.state;
    let { type, size, prefixCls, position, width, height, style, className } = this.props;
    let value = this.getRenderValue(this.props);
    let model = this.model;
    prefixCls += "-tabs";
    const sizeCls = ({
        large: 'lg',
        small: 'sm',
      })[size] || '';
    let cls = classNames(className, `${prefixCls}`, `${prefixCls}--${type}`, `${prefixCls}--${position}`,
      {
        [`${prefixCls}--${sizeCls}`]: sizeCls,
        [`${prefixCls}--height`]: height,
      }
    );
    style = Object.assign({}, style, width && {width: getSizeValue(width)}, height && {height: getSizeValue(height)});
    return (
      <div className={cls} style={style}>
        <TabsBar ref='tabsBar' {...this.props}
                 prefixCls={prefixCls}
                 activeKey={activeKey}
                 model={model}
                 value={value}
                 size={size}
                 onChange={this._clickHandler} />
        <TabsContent {...this.props} prefixCls={prefixCls}
                                     activeKey={activeKey}
                                     model={model}
                                     value={value} />
      </div>
    );
  }
  _clickHandler = (code) => {
    // 如果通过 props 里的 activeKey 传入进来, 通过 willReceiveProps 去变更 state
    if (!('activeKey' in this.props)) {
      this.setState({ activeKey: code });
    } else {
      let { onChange } = this.props;
      onChange && onChange(code);
    }
  }
}

/**
 * tab 切页标签
 *  每一次点击标签,都需要使active的标签可见
 *  左右箭头切换
 */
class TabsBar extends M.BaseComponent {
  static PropTypes = {
    itemClass: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    value: PropTypes.array.isRequired,
  };
  static defaultProps = {
    value: [],
  };
  constructor(props) {
    super(props);
    this.state = {
      activeKey: props.activeKey,
      value: props.value,
      inkBar: {},  // 选中的tab的下划线的定位, 宽度
      scrollPage: null, // 如果需要分页显示, 记录一共多少页, 每一页的宽度
    };
    this.position = getPositionMap(props.position);
    this.padding = PADDING[props.size];
  }
  componentWillReceiveProps(nextProps) {
    let { activeKey, value } = this.state;
    let handler;
    if (nextProps.hasOwnProperty('activeKey')) {
      activeKey = nextProps.activeKey;
      handler = this.scrollToTab;
    }
    if (nextProps.size !== this.props.size) {
      this.padding = PADDING[nextProps.size];
      handler = this.resizeClc;
    }
    if (nextProps.position !== this.props.position) {
      this.position = getPositionMap(nextProps.position);
      handler = this.resizeClc.bind(this, this.props.position);
    }
    let { model = {}, model: { idField, contentField } } = this.props;
    // 标签页的配置变了, 重新计算宽度
    if (nextProps.value.length !== value.length || nextProps.value.some(v => {
        let item = value.find(x => x[idField] === v[idField]);
        return !item || Object.keys(item).some(p => p !== contentField && item[p] !== v[p]);
      })) {
      value = nextProps.value;
      handler = this.resizeClc;
    }
    this.setState({value, activeKey}, handler);
  }
  componentDidMount() {
    this.resizeClc();
    this.windowEventListener('resize', this.resizeClc, false);
  }

  // tab 点击响应事件
  _clickHandler = (code) => {
    let { onChange } = this.props;
    let { activeKey } = this.state;
    if (code !== activeKey) {
      onChange && onChange(code);
    } else {
      this.scrollToTab();
    }
  };
  // 图标点击响应事件
  _deleteHandler = (code, item, btn, e) => {
    e.stopPropagation();
    let { onDelete } = this.props;
    onDelete && onDelete(code, item, btn, e);
  };
  /**
   * 超长tab的左右切换
   * @param type 向左或向右切页
   */
  _pageChangeHandler = async (type, ...args) => {
    let { scrollPage = {}, scrollPage: { pageWidth = 0, translate = 0 } } = this.state;
    if (type === 'prev' ? !hasPrev(scrollPage) : !hasNext(scrollPage)) { // 如果没有前/后一页了
      return;
    }
    let { onPrevClick, onNextClick } = this.props;
    let confirmHandler = type === 'prev' ? onPrevClick : onNextClick;
    let res = confirmHandler ? await confirmHandler(...args) : true;
    if (!isEmptyString(res) && !res) {
      return;
    }
    pageWidth = this._getPageWidth();
    // 最后一页, 注意下所剩内容区域
    translate = (type !== 'prev' ? getScrollRight : getScrollLeft)(scrollPage, pageWidth);
    let { offsetLeft, offsetWidth } = this._getActiveRect();
    this.setState({
      scrollPage: Object.assign({}, scrollPage, {translate, pageWidth}),
      inkBar: {translate: offsetLeft + translate, width: offsetWidth}
    });
  };
  /**
   * 获得最新的每页宽度
   * 由于滚动条的出现, 可能造成宽度的变化, 避免算的不精准
   */
  _getPageWidth = () => {
    return this.refs.nav && (this.refs.nav[this.position.offsetWidth] - this.padding*2);
  };
  // 获取transform配置
  _getTransform = (translate) => {
    return isVertical(this.props.position)
      ? `translate3d(0px, ${+translate}px, 0px`
      : `translate3d(${+translate}px, 0px, 0px)`;
  };
  // 获取当前被选中页签的DOM属性
  _getActiveRect = () => {
    if (!this.refs.nav) return {};
    let { offsetWidth: OW, offsetLeft: OL } = this.position;
    let { [OL]: offsetLeft, [OW]: offsetWidth } = this.refs.nav.querySelector('li.active') || {};
    return { offsetLeft, offsetWidth};
  };

  render() {
    let { prefixCls, model, position, extraTab, extraRight, size, itemClass } = this.props;
    let { scrollPage, inkBar, value, activeKey } = this.state;
    size = size === 'small' ? "xsmall" : size;
    let { translate } = scrollPage || {};
    let { idField, showField, iconField, disableField, deleteIconField } = model || {};
    let navPrefixCls = prefixCls + "__nav";
    let outCls = classNames({
      [`${prefixCls}__tabBar-container`]: true,
      [`${prefixCls}__tabBar-container-extra`]: extraTab,
      [`${prefixCls}__tabBar-container-extraRight`]: extraRight,
    });
    let cls = classNames({
      [`${prefixCls}__tabBar`]: true,
      [`${prefixCls}__tabBar-scroll`]: scrollPage
    });
    let content = [];
    (value || []).forEach((item, k) => {
      let { [idField]: code, [showField]: label, [iconField]: icon, [disableField]: itemDisabled, [deleteIconField]: itemDeleteIcon, className, style } = item || {};
      let deleteIcon = itemDeleteIcon || this.props.deleteIcon;
      let disabled = this.props.disabled || itemDisabled;
      let liCls = classNames({
        [`${navPrefixCls}-item`]: true,
        [className]: className,
        'active': code === activeKey,
        'no-icon': !icon && !deleteIcon,
        'disabled': disabled
      }, isFunction(itemClass) ? itemClass(item, k) : itemClass);
      content.push(<li key={code + k} className={liCls} style={style} onClick={disabled ? noop : this._clickHandler.bind(this, code)}>
        <div className={`${navPrefixCls}-item-title`}>
          {icon && <Icon type={icon} />}
          {isValidElement(label) ? label : <span>{label}</span>}
        </div>
        {deleteIcon && <Button shape="no-outline" size={size} icon="cross" className={`${navPrefixCls}-item-delete`} onClick={disabled ? noop : this._deleteHandler.bind(this, code, item)} />}
      </li>)
    });
    let { next: NEXT, prev: PREV, width: WIDTH } = this.position;
    return (
      <div className={outCls} ref="container">
        {isVertical(position) && extraTab && <div className={`${prefixCls}__extra`} ref="extra">{extraTab}</div>}
        <div className={cls} ref="tabBar">
          <div className={`${prefixCls}__ink-bar`} style={{transform: this._getTransform(inkBar.translate), [WIDTH]: `${+inkBar.width}px`}}></div>
          {scrollPage && <Button className={`${prefixCls}__prev`}
                                 icon={`angle-${PREV}`}
                                 shape="no-outline"
                                 size={size}
                                 disabled={!hasPrev(scrollPage)}
                                 onClick={this._pageChangeHandler.bind(this, 'prev')}/>}
          <ul ref="nav" className={`${navPrefixCls}`} style={scrollPage && {transform: this._getTransform(translate)}}>
            {content}
          </ul>
          {scrollPage && <Button className={`${prefixCls}__next`}
                                 icon={`angle-${NEXT}`}
                                 shape="no-outline"
                                 size={size}
                                 disabled={!hasNext(scrollPage)}
                                 onClick={this._pageChangeHandler.bind(this, 'next')}/>}
        </div>
        {!isVertical(position) && extraTab && <div className={`${prefixCls}__extra`} ref="extra">{extraTab}</div>}
      </div>
    )
  }

  /**
   * 重新计算tab的宽/高度, 判断是否要分页
   * @param prevPosition position变化之前的状态
   */
  resizeClc = (prevPosition) => { // 计算前后切换的参数
    let { showPage, position, extraTab } = this.props;
    if (!showPage) {
      return;
    }
    let { nav: $nav, extra: $extra, container: $container, tabBar: $tabBar } = this.refs;
    let { offsetWidth: OW, offsetLeft: OL, scrollWidth: SW, width: WIDTH } = this.position;
    if (!$nav) {
      return;
    }
    if (extraTab && $extra) { // 当有额外 tab 并且要显示左右箭头时, 计算标签页实际可以占据的空间
      let delta = $container[OW] - $extra[OW];
      if (delta < $nav[SW]) {
        $tabBar.style[WIDTH] = delta + 'px';
      }
    }
    // 把页签的宽度重置, 避免从横竖向转换时显示错误
    if (isVertical(prevPosition) !== isVertical(position)) {
      $tabBar.style[isVertical(position) ? 'width' : 'height'] = 'auto';
    }
    let { [SW]: scrollWidth, [OW]: offsetWidth } = $nav;
    if (scrollWidth > offsetWidth) { // 如果超长了, 就显示前后箭头
      this.setState({scrollPage: {}}, () => {
        scrollWidth = $nav[SW];
        let viewable = offsetWidth - this.padding*2; // 原可视区间 - 前后箭头占宽/高
        let pageSize = Math.ceil(scrollWidth/viewable);
        Object.assign(this.state, {scrollPage: {
          padding: this.padding,
          totalWidth: scrollWidth,
          pageWidth: viewable,
          pageSize
        }});
        this.scrollToTab(true);
      });
    } else {
      this.setState({scrollPage: null}, this.scrollToTab);
    }
  };
  // 使选中的 tab 可视
  scrollToTab = (force) => {
    if (!this.props.showPage) {
      return;
    }
    let { nav: $nav } = this.refs;
    if (!$nav) return;
    let { offsetLeft, offsetWidth } = this._getActiveRect();
    if (offsetWidth === undefined) { // 如果没有被选中的标签页
      force && this.forceUpdate();
      return;
    }
    if (!this.state.scrollPage) { // 已经没有超长, 只需要定位下高亮条就可以
      this.setState({inkBar: {translate: offsetLeft, width: offsetWidth}});
      return;
    }
    let { scrollPage = {}, scrollPage: { pageWidth = 0, translate = 0 } } = this.state;
    pageWidth = this._getPageWidth();
    let newTranslate = translate;
    // offsetLeft 包括了 padding-left 的宽度, 而 translate 不包括
    const _offsetLeft = offsetLeft - this.padding;
    if (_offsetLeft < -translate) { // 如果部分左侧不可视
      newTranslate = getScrollLeft(scrollPage, offsetWidth - (_offsetLeft + offsetWidth - -translate));
    } else if (_offsetLeft + offsetWidth > -translate + pageWidth) { // 如果部分右侧不可视
      newTranslate = getScrollRight(scrollPage, _offsetLeft + offsetWidth - -translate - pageWidth);
    } else { // 如果不需要左右滚动, 直接定位
      this.setState({inkBar: {translate: offsetLeft + translate, width: offsetWidth}});
      return;
    }
    if (force || newTranslate !== translate) {
      this.setState({
        scrollPage: Object.assign({}, scrollPage, {pageWidth, translate: newTranslate}),
        inkBar: {translate: offsetLeft + newTranslate, width: offsetWidth}
      });
    }
  };
}

/**
 * tab 内容
 *  initAll 标识一次性渲染所有的 tab, 否则只渲染展示过的
 */
class TabsContent extends Component {
  constructor(props) {
    super(props);
    let inited = {};  // 存储展示过的标签页
    if (!isEmptyString(props.activeKey)) {
      inited[props.activeKey] = true;
    }
    this.state = {
      inited
    };
  }
  componentWillReceiveProps(nextProps) {
    let { inited } = this.state;
    if (nextProps.hasOwnProperty('activeKey') && !isEmptyString(nextProps.activeKey)) {
      this.setState({inited: Object.assign(inited, {[nextProps.activeKey]: true})});
    }
  }
  render() {
    let { prefixCls, value, model, initAll, autoDestory, activeKey, style } = this.props;
    let { inited } = this.state;
    let { idField, contentField } = model || {};
    let itemList = [];
    prefixCls += "__content";
    (value || []).forEach((item, k) => {
      let { [idField]: code, [contentField]: content, ...other } = item || {};
      let liCls = classNames({
        [`${prefixCls}-item`]: true,
        [`key_${code}`]: true,
        'active': code === activeKey
      });
      let showContent = initAll || ((autoDestory || item.autoDestory) ? code === activeKey : inited[code]);
      itemList.push(
        <li key={code + k} className={liCls}>
          {showContent && getComponent(content, {code, ...other, index: k})}
        </li>);
    });
    return (
      <ul className={prefixCls} style={style}>
        {itemList}
      </ul>
    )
  }
}

export default Tabs;
