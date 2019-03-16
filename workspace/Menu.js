import React from 'react';
import M from '../util';
import { buildIcon } from './utils';
import { IconPrefixCls as iconPrefixCls } from '../util/data';

const UNIT_PADDING = 10;

/**
 * FIXME selectedKeys为数组，但是每选一次更新数组为单元素
 */
class Menu extends M.BaseComponent {
  static defaultProps = {
    prefixCls: 'mt',
  };

  constructor(props) {
    super(props);
    Object.assign(this.state, {
      openKeys: props.openKeys || [],
      selectedKeys: props.selectedKeys || [],
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      openKeys: nextProps.openKeys || [],
      selectedKeys: nextProps.selectedKeys || [],
    })
  }

  render() {
    let { prefixCls, children } = this.props;
    let basicPrefixCls = `${prefixCls}-menu`;

    let { openKeys, selectedKeys } = this.state;

    return (
      <div className={basicPrefixCls}>
        {React.Children.map(children,
          this._renderChildren.bind(this, {
            prefixCls, openKeys, selectedKeys,
            onTitleClick: this._handleClickSubMenu,
            onSelect: this._handleClickMenuItem,
          }))}
      </div>
    );
  }

  _renderChildren(props, item) {
    return React.cloneElement(item, props);
  }

  _handleClickSubMenu(key) {
    let { openKeys } = this.state;
    let index = openKeys.findIndex(item => item == key);
    if (index == -1) {
      openKeys.push(key);
    } else {
      openKeys.splice(index, 1);
    }
    this.setState({ openKeys }, () => {
      let { onOpenChange } = this.props;
      onOpenChange && onOpenChange(this.state.openKeys);
    });
  }

  _handleClickMenuItem(key, node) {
    //单击事件直接抛到外部，选中状态由外部传入决定
    let { onSelect } = this.props;
    onSelect && onSelect(key, node, this.state.selectedKeys);
  }
}

class SubMenu extends M.BaseComponent {
  static defaultProps = {
    prefixCls: 'mt',
  };

  constructor(props) {
    super(props);
    let { openKeys, eventKey } = props;
    Object.assign(this.state, {
      showMenuItem: openKeys.includes(eventKey) || false, //是否展开结点
    });
  }

  componentWillReceiveProps(nextProps) {
    let { openKeys, eventKey } = nextProps;
    this.setState({
      showMenuItem: openKeys.includes(eventKey) || false,
    });
  }

  render() {
    let { prefixCls, children, label, icon, openKeys,
      selectedKeys, level, onSelect, onTitleClick } = this.props;
    let basicPrefixCls = `${prefixCls}-sub-menu`;

    let { showMenuItem } = this.state;

    return (
      <div className={M.classNames(basicPrefixCls, {
        [`${basicPrefixCls}--open`]: showMenuItem,
      })}>
        <div className={`${basicPrefixCls}__label`}
             style={{ paddingLeft: level * UNIT_PADDING + UNIT_PADDING}}
             onClick={this._toggleMenu}>
          <span className={`${basicPrefixCls}__icon`}>
              {buildIcon(icon)}
          </span>
          <span>{label}</span>
          <span className={`${basicPrefixCls}__expand ${iconPrefixCls} ${iconPrefixCls}-angle-right`} />
        </div>
        {showMenuItem && React.Children.map(children,
          this._renderChildren.bind(this, {
            prefixCls, selectedKeys, openKeys,
            onSelect, onTitleClick,
          }))}
      </div>
    );
  }

  _renderChildren(props, item) {
    return React.cloneElement(item, props);
  }

  _toggleMenu(e) {
    this.setState({
      showMenuItem: !this.state.showMenuItem,
    }, () => {
      let { onTitleClick, eventKey } = this.props;
      onTitleClick && onTitleClick(eventKey, e);
    });
  }
}

class Item extends M.BaseComponent {
  static defaultProps = {
    prefixCls: 'mt',
  };

  constructor(props) {
    super(props);
    let { selectedKeys, eventKey } = props;
    Object.assign(this.state, {
      active: selectedKeys.includes(eventKey) || false,
    });
  }

  componentWillReceiveProps(nextProps) {
    let { selectedKeys, eventKey } = nextProps;
    this.setState({
      active: selectedKeys.includes(eventKey) || false,
    });
  }

  render() {
    let { prefixCls, children } = this.props;
    let basicPrefixCls = `${prefixCls}-menu-item`;

    let { active } = this.state;

    return (
      <div className={M.classNames(basicPrefixCls, {
        [`${basicPrefixCls}--active`]: active,
      })} onClick={this._clickItem}>
        {children}
      </div>
    );
  }

  _clickItem(e) {
    //单击事件直接抛到外部，active由外部传入决定
    let { onSelect, eventKey, node } = this.props;
    onSelect && onSelect(eventKey, node, e);
  }
}

Menu.SubMenu = SubMenu;
Menu.Item = Item;
export default Menu;
