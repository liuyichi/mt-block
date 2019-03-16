import React, { Component, PropTypes } from 'react';
import M from '../util';
import { buildIcon } from './utils';
import { isString } from 'lodash-compat';
import { Link } from 'react-router';

/**
 * 头部导航栏，目前只能接受最多二级导航
 * FIXME hover出现用户菜单
 * FIXME 当导航栏宽度不够显示全部时出现更多
 */
class HeaderNav extends M.BaseComponent {
  static DEFAULT_USER_MODEL = {
    idField: 'id',
    nameField: 'name',
    avatarField: 'avatar',
    showAvatar: true,
    showName: true,
    menu: [],
  };

  constructor(props) {
    super(props);
    Object.assign(this.state, {
      showUserMenu: false, //是否显示用户菜单
      showSubNav: false, //是否显示子导航
      userModel: Object.assign({}, HeaderNav.DEFAULT_USER_MODEL, props.userModel),
    }, this._parseMenu(props.menu, props.activeCode));
  }

  componentWillReceiveProps(nextProps) {
    let newState = {};
    if (nextProps.hasOwnProperty('userModel')) {
      Object.assign(newState, {
        userModel: Object.assign({}, HeaderNav.DEFAULT_USER_MODEL, nextProps.userModel),
      });
    }
    if (nextProps.hasOwnProperty('menu') || nextProps.hasOwnProperty('activeCode')) {
      Object.assign(newState, this._parseMenu(nextProps.menu, nextProps.activeCode));
    }
    this.setState(newState);
  }

  componentDidMount() {
    this.windowEventListener('click', (e) => {
      if (this.state.showUserMenu && !this.refs.user.contains(e.target)) {
        this._toggleUserMenu();
      }
    });
  }

  render() {
    let { prefixCls, logo, onClickLogo, theme, user, keepLogoAside = false,
      right, showCollapse, collapse, onCollapse } = this.props;
    let basicPrefixCls = `${prefixCls}-header`;
    let { showSubNav, topMenu, activeSubMenu, topActiveCode, subActiveCode } = this.state;

    return (
      <div className={M.classNames(`${basicPrefixCls} ${basicPrefixCls}--${theme}`, {
        'has-sub-nav': showSubNav,
        'logo-aside': keepLogoAside,
      })}>
        <div className={`${basicPrefixCls}__top-nav`}>
          <div className={`${basicPrefixCls}__top-nav-inner`}>
            <div className={`${basicPrefixCls}__left`}>
              {!!logo && (
                <div className={`${basicPrefixCls}__logo`} onClick={onClickLogo}>
                  {logo}
                </div>
              )}
              {showCollapse && (
                <div className={`${basicPrefixCls}__collapse`}
                     onClick={() => { onCollapse(!collapse); }}>
                  <span className="block-icon-bars" />
                </div>
              )}
            </div>
            {!!topMenu && topMenu.size > 0 && (
              <div className={`${basicPrefixCls}__top-menu`}>
                {this._getMenuElement(basicPrefixCls, topMenu, topActiveCode)}
              </div>
            )}
            <div className={`${basicPrefixCls}__right`}>
              {right}
              {!!user && this._getUserElement(basicPrefixCls)}
            </div>
          </div>
        </div>
        {showSubNav && !!activeSubMenu && activeSubMenu.size > 0 && (
          <div className={`${basicPrefixCls}__sub-nav`}>
            {this._getMenuElement(basicPrefixCls, activeSubMenu, subActiveCode)}
          </div>
        )}
      </div>
    );
  }

  _getUserElement(basicPrefixCls) {
    let { user } = this.props;
    let { showUserMenu, userModel: { idField, nameField, avatarField,
      showAvatar, showName, menu }} = this.state;

    let hasMenu = !!menu && menu.length > 0;
    let menuItems;
    if (hasMenu) {
      menuItems = menu.map((item, i) => {
        let { label, handler } = item;
        //FIXME 单击时默认让菜单收起
        return (
          <li key={i}
              className={`${basicPrefixCls}__user-menu-item`}
              onClick={() => { this._toggleUserMenu(false); handler && handler(); }}>
            {label}
          </li>
        );
      });
    }

    return (
      <div ref="user"
           className={M.classNames(`${basicPrefixCls}__user`, {
             'has-menu': hasMenu,
             'with-name': showName && !!user[nameField],
             'with-avatar': showAvatar && !!user[avatarField]
      })}
           onMouseEnter={this._toggleUserMenu.bind(this, true)}
           onMouseLeave={this._toggleUserMenu.bind(this, false)}>
        {(showName || showAvatar) && (
          <div className={`${basicPrefixCls}__user-info`}>
            {showAvatar && !!user[avatarField] && (
              <div className={`${basicPrefixCls}__user-avatar`}>
                {isString(user[avatarField])? (
                  <img src={user[avatarField]} />
                ) : user[avatarField]}
              </div>
            )}
            {showName && !!user[nameField] && (
              <div className={`${basicPrefixCls}__user-name`}>
                {user[nameField]}
              </div>
            )}
          </div>
        )}
        {showUserMenu && (
          <div className={`${basicPrefixCls}__user-menu`}>
            <ul className={`${basicPrefixCls}__user-menu-list`}>{menuItems}</ul>
          </div>
        )}
      </div>
    );
  }

  _toggleUserMenu() {
    this.setState({
      showUserMenu: !this.state.showUserMenu,
    });
  }

  _getMenuElement(basicPrefixCls, menu, activeCode) {
    let { urlFor } = this.props;
    let menuList = menu.toArray().map((item) => {
      let { code, label, type, icon } = item;
      let content, iconContent = buildIcon(icon);
      if (type == 'link') {
        content = <a href={item.url} target={item.target || '_blank'} className="menu-item-link">
          {iconContent && <span className="menu-item-link__icon">{iconContent}</span>}
          <span>{label}</span>
        </a>;
      } else {
        content = <Link to={urlFor(code)} className="menu-item-link">
          {iconContent && <span className="menu-item-link__icon">{iconContent}</span>}
          <span>{label}</span>
        </Link>;
      }
      return (
        <li key={code}
            className={M.classNames(`${basicPrefixCls}__menu-item`, {
                active: code == activeCode,
            })}>
          {content}
        </li>
      );
    });
    return <ul className={`${basicPrefixCls}__menu-list`}>{menuList}</ul>;
  }

  /**
   * 解析menu数据
   * @param menu
   * @param activeCode 当前激活的节点code
   * @returns {{topMenu: *, subMenu: *, topActiveCode: *, subActiveCode: *}}
   * @private
   */
  _parseMenu(menu, activeCode) {
    if (!menu || menu.size == 0) return;
    let topMenu = menu.filter(item => item.level == 0), subMenu = menu.filter(item => item.level == 1);

    //初始化result
    let result = {
      topMenu, subMenu,
      showSubNav: false,
      activeSubMenu: undefined,
      topActiveCode: undefined,
      subActiveCode: undefined,
    } ;

    if (topMenu && activeCode) {
      //如果当前激活的节点在第一层
      if (topMenu.get(activeCode)) {
        Object.assign(result, {
          topActiveCode: activeCode,
          subActiveCode: undefined,
        });
        //如果第二层存在
        if (subMenu && subMenu.size > 0) {
          let activeSubMenu = subMenu.filter(item => item.parent == activeCode);
          Object.assign(result, {
            showSubNav: activeSubMenu.size > 0,
            activeSubMenu,
          });
        }
      } else if (subMenu) {
        //如果存在二级导航
        let subActiveNode = subMenu.get(activeCode);
        //如果当前激活的节点在第二层，反向找到上层激活节点
        if (subActiveNode) {
          let activeTopMenuItem = topMenu.get(subActiveNode.parent);
          //如果上层结点没有被隐藏
          if (!activeTopMenuItem.hide) {
            let activeSubMenu = subMenu.filter((v, k) => activeTopMenuItem.children.includes(k));
            Object.assign(result, {
              showSubNav: true,
              topActiveCode: subActiveNode.parent,
              subActiveCode: activeCode,
              activeSubMenu,
            });
          }
        }
      }
    }

    return result;
  }
}

export default HeaderNav;
