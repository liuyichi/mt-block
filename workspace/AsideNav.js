import React, { Component, PropTypes } from 'react';
import M from '../util';
import Menu from './Menu';
import { buildIcon } from './utils';
import { Link } from 'react-router';
import { union } from 'lodash-compat';

const UNIT_PADDING = 10;

/**
 * 侧边导航栏
 *
 */
class AsideNav extends M.BaseComponent {
  static BORDER_LEFT_WIDTH = 3;
  constructor(props) {
    super(props);
    Object.assign(this.state, {
      openKeys: [], //当前展开的结点
      selectedKeys: [], //当前选中的结点
    }, this._parseMenu(props.menu, props.activeCode));
  }

  componentWillReceiveProps(nextProps) {
    let newState = {};
    if (nextProps.hasOwnProperty('menu') || nextProps.hasOwnProperty('activeCode')) {
      let obj = this._parseMenu(nextProps.menu, nextProps.activeCode);

      //FIXME 暂时这么处理，和以前的展开合并，让展开选项继续展开
      let { openKeys } = this.state;
      let arr = union(openKeys, obj.openKeys);
      //去除menu里不存在的key
      arr = arr.filter(code => nextProps.menu.has(code));
      obj.openKeys = arr;

      Object.assign(newState, obj);
    }
    this.setState(newState);
  }

  render() {
    let { prefixCls, theme, keepNavAside } = this.props;
    let basicPrefixCls = `${prefixCls}-aside`;
    let { openKeys, selectedKeys, subMenuItems } = this.state;
    return (
      <div className={M.classNames(`${basicPrefixCls} ${basicPrefixCls}--${theme}`, {
        'nav-aside': keepNavAside,
      })}>
        <div className={`${basicPrefixCls}__inner`}>
          <div className={`${basicPrefixCls}__nav`}>
            <Menu prefixCls={basicPrefixCls}
                  openKeys={openKeys}
                  selectedKeys={selectedKeys}
                  onOpenChange={this._handleOpenChange}
                  onSelect={this._handleSelect}>
              {subMenuItems}
            </Menu>
          </div>
        </div>
      </div>
    );
  }

  _parseMenu(menu, activeCode) {
    if (!menu || menu.size == 0) return;

    let result = {};

    let activeNode = menu.get(activeCode);
    if (activeNode) {
      let selectedKeys = [activeCode];
      //默认展开的结点，从子结点向上找到所有的父级
      let openKeys = [];
      let curNode = menu.get(activeNode.parent);
      while (curNode) {
        openKeys.unshift(curNode.code);
        curNode = menu.get(curNode.parent);
      }
      Object.assign(result, { openKeys, selectedKeys });
    }

    //按层级分类
    let groupMenu = menu.groupBy(item => item.level);
    let keys = groupMenu.keySeq().toArray();
    let minLayer = Math.min(...keys);
    let subMenuItems = groupMenu.get(minLayer).map((item) => {
      return this._renderMenuItems(item.code, menu);
    }).toArray();

    Object.assign(result, { subMenuItems });
    return result;
  }

  _renderMenuItems(code, data) {
    let node = data.get(code);
    if (node.type == 'folder') {
      return (
        <Menu.SubMenu key={node.code}
                      eventKey={node.code}
                      label={node.label}
                      icon={node.icon}
                      level={node.level + 1}
                      node={node}>
          {node.children.map(code => this._renderMenuItems(code, data))}
        </Menu.SubMenu>
      );
    } else {
      let { urlFor } = this.props;
      let content;
      if (node.type == 'link') {
        content = (
          <a href={node.url} target={node.target || '_blank'}
             className="menu-item-link"
             style={{
               paddingLeft: (node.level + 1) * UNIT_PADDING + UNIT_PADDING - AsideNav.BORDER_LEFT_WIDTH,
               borderLeftWidth: AsideNav.BORDER_LEFT_WIDTH,
          }}>
            <span className={`menu-item-link__icon`}>
              {buildIcon(node.icon)}
            </span>
            <span>{node.label}</span>
          </a>
        );
      } else {
        content = (
          <Link to={urlFor(node.code)}
             className="menu-item-link"
             style={{
               paddingLeft: (node.level + 1) * UNIT_PADDING + UNIT_PADDING - AsideNav.BORDER_LEFT_WIDTH,
               borderLeftWidth: AsideNav.BORDER_LEFT_WIDTH,
          }}>
            <span className={`menu-item-link__icon`}>
              {buildIcon(node.icon)}
            </span>
            <span>{node.label}</span>
          </Link>
        );
      }
      return (
        <Menu.Item key={node.code}
                   eventKey={node.code}
                   level={node.level + 1}
                   node={node}>
          {content}
        </Menu.Item>
      );
    }
  }

  _handleOpenChange(openKeys) {
    this.setState({ openKeys });
  }

  _handleSelect(key, node, selectedKeys) {
    if (node.type != 'link') {
      this.setState({ selectedKeys });
    } else {
      //重刷界面
      this.forceUpdate();
    }
  }
}

export default AsideNav;
