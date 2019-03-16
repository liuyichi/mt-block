import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { noop } from 'lodash-compat';
import M from '../util';
import HeaderNav from './HeaderNav';
import AsideNav from './AsideNav';
import { Map, OrderedMap } from 'immutable';
/**
 * 工作空间
 * props.prefixCls = 'mt' //类前缀
 * props.theme = 'dark-light' // 'dark-light'|'light-dark'，主题：前一个字表示Header主题，后一个字表示Aside主题
 * props.hNavLevels = 1 // 0|1|2，水平导航栏级数，最多支持两级，剩余级数由垂直导航实现，垂直导航最多两级，多于两级给提示
 * //TODO 导航显示在水平方向时，是显示在左边还是右边，注意right和user存在的情况
 * props.logo = 'LOGO' // ''|jsx(img)，logo信息
 * props.onClickLogo = () => {} //单击logo时触发
 * props.keepAsideNavLeft = true //true|false 是否让侧边栏显示在左边缘
 * props.showCollapse = true //true|false 是否显示收起
 * props.userModel = { //用户信息配置
 *    idField: 'id', //主键字段名
 *    nameField: 'name', //显示的名字字段名
 *    avatarField: 'avatar', //头像字段名
 *    showAvatar: true, //true|false，是否显示头像
 *    showName: false, //false|true，是否显示名字
 *    menu: [{ //用户信息下拉菜单
 *      code, //标识代码，非必须
 *      label, //文字，支持纯文字或jsx
 *      handler, //单击事件
 *    }, ...],
 * }
 * //获取用户信息，返回的是obj，至少有userModel中对应的字段，user={[idField]:'', [nameField]:'', [[avatarField]:'',]}
 * props.onFetchUser = () => { return user; }
 * props.right = undefined //显示在水平导航栏的导航与用户之间的区域
 * props.footer = undefined //页脚，支持jsx
 * props.crumb = false //TODO false|true，是否显示面包屑
 * //获取导航栏菜单，支持两种数据形式，默认支持第一种，FIXME 两种类型中每个menu对象都有一个type属性，type:'folder'|'node'|'link'
 * //1. 本身带有结构的数组，作为数组元素的对象中，children决定下一层级。{ code, name, type, children }
 * //2. 和树类型一样是打平的数组，配置字段决定结构。{ [idField], [showField], type, [parentField] }
 * props.menu = undefined // 显示数据
 * props.useTreeMenu = true //true|false，是否使用树类型的menu结构
 * props.menuModel = { //menu配置
 *    idField: 'code', //主键字段
 *    showField: 'label', //显示字段
 *    [parentField: '',] //userTreeMenu为true时，表示父节点的字段
 * }
 * props.format = (menuItem) => { return ''|jsx; } //菜单显示内容可以自定义
 * props.setUrlForNode = (code) => { return ''; } //自定义生成每个结点的url
 *
 * 数据
 * user = {
 *  [idField]: 1,
 *  [nameField]: '',
 *  [[avatarField]: ''|jsx, ]
 * }
 * 层级结构数据
 * menu = [{
 *  [idField]: 1,
 *  [showField]: '',
 *  type: 'folder'|'node'|'link',
 *  hide: false|true,
 *  children: [{
 *   [idField]: 11,
 *   [showField]: '',
 *   type,
 *   [children, ]
 *  }, ...]
 * }, ...]
 * 树结构数据
 * menu = [{
 *  [idField]: 1,
 *  [showField]: '',
 *  [parentField]: '',
 *  type: 'folder'|'node'|'link',
 *  hide: false|true,
 * }, ...]
 *
 * 公共方法
 * addRight(right) //FIXME 增加水平导航右边
 *
 *
 */
class Workspace extends M.BaseComponent {
  //FIXME，细化
  static propTypes = {
    prefixCls: PropTypes.string,
    theme: PropTypes.string,
    hNavLevels: PropTypes.number,
    logo: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    keepAsideNavLeft: PropTypes.bool,
    showCollapse: PropTypes.bool,
    userModel: PropTypes.shape({
      idField: PropTypes.string,
      nameField: PropTypes.string,
      avatarField: PropTypes.string,
      showAvatar: PropTypes.bool,
      showName: PropTypes.bool,
      menu: PropTypes.array,
    }),
    footer: PropTypes.element,
    right: PropTypes.element,
    crumb: PropTypes.bool,
    menu: PropTypes.array,
    useTreeMenu: PropTypes.bool,
    menuModel: PropTypes.shape({
      idField: PropTypes.string.isRequired,
      showField: PropTypes.string.isRequired,
      parentField: PropTypes.string,
    }),

    onClickLogo: PropTypes.func,
    onFetchUser: PropTypes.func,
    format: PropTypes.func,
    setUrlForNode: PropTypes.func,
  };

  static defaultProps = {
    prefixCls: 'mt',
    theme: 'dark-light',
    hNavLevels: 1,
    logo: 'LOGO',
    keepAsideNavLeft: true,
    showCollapse: true,
    userModel: {
      idField: 'id',
      nameField: 'name',
      avatarField: 'avatar',
      showAvatar: true,
      showName: true,
      menu: [],
    },
    footer: undefined,
    right: undefined,
    crumb: false,
    menu: undefined,
    useTreeMenu: true,

    onClickLogo: undefined,
    onFetchUser: noop,
    format: undefined,
    setUrlForNode: undefined,
  };

  constructor(props) {
    super(props);
    this.MENUMODEL = {
      idField: 'code',
      showField: 'label',
      typeField: 'type',
      iconField: 'icon',
      childrenField: 'children',
      parentField: 'parent',
      hideField: 'hide',
      urlField: 'url',
    };
    let { menu = [], selected, theme, menuModel } = props;

    let themeSplit = theme.split('-');
    let hTheme = themeSplit[0], vTheme;
    if (themeSplit.length > 1) {
      vTheme = themeSplit[1];
    } else {
      vTheme = themeSplit[0];
    }
    Object.assign(this.MENUMODEL, menuModel);
    let menuData = this._getMenuData(props, menu);
    Object.assign(this.state, {
      user: null,
      menu, menuData,
      splitMenuData: this._splitMenuData(props, menuData, selected),
      hTheme, vTheme,
      collapse: props.collapse || false, //是否收起侧边栏
    });
  }

  componentDidMount() {
    //获取用户数据
    this._fetchUser();
    this._fitContentPosition();
  }

  componentWillReceiveProps(nextProps) {
    let { menu, menuData, selected, hTheme, vTheme } = this.state;
    if (nextProps.hasOwnProperty('menu')) {
      menu = nextProps.menu || [];
      menuData = this._getMenuData(nextProps, menu);
    }
    if (nextProps.hasOwnProperty('selected')) {
      selected = nextProps.selected || '';
    }
    if (nextProps.hasOwnProperty('theme')) {
      let themeSplit = nextProps.theme.split('-');
      hTheme = themeSplit[0];
      if (themeSplit.length > 1) {
        vTheme = themeSplit[1];
      } else {
        vTheme = themeSplit[0];
      }
    }
    this.setState({
      menu, menuData,
      splitMenuData: this._splitMenuData(nextProps, menuData, selected),
      hTheme, vTheme,
      collapse: nextProps.collapse || false, //是否收起侧边栏
    }, () => {
      this._fitContentPosition();
      this.scrollToTop();
    });
  }

  render() {
    let { className, prefixCls, logo, userModel, showCollapse,
      keepAsideNavLeft, onClickLogo, right, footer, children, selected, onToggleAsideMenu } = this.props;
    let basicPrefixCls = `${prefixCls}-workspace`;

    let { userData, splitMenuData: { hMenu, vMenu, hActiveCode, vActiveCode,
      hLevels, maxHLevels, maxVLevels }, hTheme, vTheme, collapse } = this.state;

    let headerProps = {
      userModel,
      theme: hTheme,
      user: userData,
      menu: hMenu,
      activeCode: hActiveCode,
      urlFor: this._urlFor,
      right, logo, onClickLogo,
    };

    let asideProps = {
      theme: vTheme,
      menu: vMenu,
      activeCode: vActiveCode,
      urlFor: this._urlFor,
    };
    //当确实存在水平导航栏有两级时，不允许侧边栏沿边显示
    let keepNavAside = keepAsideNavLeft;
    if (maxHLevels == 2) {
      keepNavAside = false;
    }
    Object.assign(asideProps, { keepNavAside });

    //当确实存在出现侧边导航栏沿边的情况时，logo显示在左侧
    if (maxVLevels > 0 && keepNavAside) {
      Object.assign(headerProps, { keepLogoAside: true });
    }

    //当侧边栏有渲染，且开启了showCollapse，且侧边栏沿边显示
    if (vMenu.size > 0 && showCollapse && keepNavAside) {
      Object.assign(headerProps, {
        showCollapse: true,
        collapse,
        onCollapse: (on) => {
          this.setState({ collapse: on }, () => {
            onToggleAsideMenu && onToggleAsideMenu(!on);
          });
        }
      });
    }

    return (
      <div className={M.classNames(className, basicPrefixCls, `${basicPrefixCls}-${selected}`, `header-nav-${hLevels}`, {
        'aside-nav-left': vMenu.size > 0 && keepNavAside,
        'aside-nav-down': vMenu.size > 0 && !keepNavAside,
        'aside-nav-collapse': collapse,
        'aside-nav-exist': maxVLevels > 0 && keepNavAside,
      })}>
        <HeaderNav ref="header" {...headerProps} prefixCls={basicPrefixCls} />
        <div ref="contentWrapper" className={`${basicPrefixCls}__content-wrapper`}>
          <div ref="content" className={`${basicPrefixCls}__content`}>
            {vMenu.size > 0 && <AsideNav ref="aside" {...asideProps} prefixCls={basicPrefixCls} />}
            <div className={`${basicPrefixCls}__detail`}>
              {children}
            </div>
          </div>
          {footer}
        </div>
      </div>
    );
  }

  /**
   * 根据水平导航栏高度/侧边导航栏宽度重新计算content的位置
   * @private
   */
  _fitContentPosition() {
    //TODO 当侧边栏的宽度不固定时
  }

  /**
   * 转化code为url，如果有外部传入的方法，则使用外部传入的
   * @param code
   * @returns {string}
   * @private
   */
  _urlFor(code) {
    let { setUrlForNode, pathMap } = this.props;
    return (setUrlForNode && setUrlForNode(code))
      || (pathMap && pathMap[code]) || ('/' + code);
  }

  /**
   * 获取user信息
   * @private
   */
  async _fetchUser() {
    let { onFetchUser } = this.props;
    let userData = await onFetchUser();
    this.setState({ userData });
  }

  /**
   * 处理为本地存储的map平级数据
   * @param menuData
   * @private
   */
  _getMenuData(props, menuData) {
    let { useTreeMenu, format } = props;

    let newMenuData = menuData;
    //每个元素转化为{ code, label, type, hide, level, children: [code1, code2, ...], parent: parentCode }
    if (useTreeMenu) {
      //树结构数据的处理
      //this._convertTreeMenuData(menuData, this.MENUMODEL, format);
    } else {
      //层级结构数据的处理
    }

    //深度优先遍历，result是最终结果，包含menu中的所有结点，每个元素是[code, node]的形式
    let menuNodes = [], level = 0;
    this._traversalByDepthFirst(menuNodes, newMenuData, level, null, this.MENUMODEL, format);
    return OrderedMap(menuNodes);
  }

  _traversalByDepthFirst(result, data, level, parent, menuModel, format) {
    let { idField, showField, typeField, iconField, childrenField, hideField, urlField } = menuModel;
    //每个元素转化为{ code, label, type, hide, level, children: [code1, code2, ...], parent: parentCode }
    (data || []).forEach((item) => {
      let obj = {};
      obj.code = item[idField];
      obj.label = (format && format(item)) || item[showField];
      obj.type = item[typeField];
      obj.icon = item[iconField];
      obj.hide = item[hideField];
      obj.url = item[urlField];
      obj.level = level;
      obj.parent = parent;
      if (obj.type == 'folder') {
        obj.children = (item[childrenField] || []).map((o) => o[idField]);
      }
      //保留其他的属性，并替换掉必要属性
      result.push([item[idField], Object.assign({}, item, obj)]);

      //如果是非叶子节点
      if (obj.type == 'folder') {
        this._traversalByDepthFirst(result, item[childrenField], level + 1, item[idField], menuModel, format);
      }
    });
  }

  /**
   * 去除所有的隐藏结点
   * @param menuData
   * @private
   */
  _filterHideNodes(menuData) {
    let hideCodes = [];
    menuData.forEach((item) => {
      if (item.hide) {
        hideCodes.push(item.code);
      }
    });
    hideCodes.forEach((code) => {
      //从父节点的children里移除
      let node = menuData.get(code);
      if (node) {
        //有可能node已经被删除了
        let parentCode = node.parent;
        if (parentCode) {
          let parentNode = menuData.get(parentCode);
          if (parentNode && parentNode.children && parentNode.children.length > 0) {
            parentNode.children = parentNode.children.filter(item => item != code);
            menuData = menuData.set(parentCode, parentNode);
          }
        }
      }
      //该结点的子节点全部移除
      menuData = this._removeChildNodes(menuData, code);
    });
    return menuData;
  }

  /**
   * 移除code对应结点的所有子结点
   * @param menu
   * @param code
   * @returns {*}
   * @private
   */
  _removeChildNodes(menu, code) {
    let node = menu.get(code);
    if (node) {
      menu = menu.delete(code);
      if (node.children) {
        node.children.forEach((code) => {
          menu = this._removeChildNodes(menu, code);
        });
      }
    }
    return menu;
  }

  /**
   * 树结构数据的转换
   * @param data
   * @param menuModel
   * @param format
   * @private
   */
  _convertTreeMenuData(data, menuModel, format) {
    let { idField, showField, parentField, typeField, iconField, hideField } = menuModel;
    let result = {};
    data.forEach((item) => {
      let obj = {};
      obj.code = item[idField];
      obj.label = (format && format(item)) || item[showField];
      obj.type = item[typeField];
      obj.icon = item[iconField];
      obj.hide = item[hideField];
      obj.parent = item[parentField];

      //如果当前结点的父结点还没加入，则初始化一个包含children的结点
      if (!result[obj.parent]) {
        result[obj.parent] = {
          children: [],
        };
      } else if (!result[obj.parent].children) {
        //如果已存在
        result[obj.parent].children = [];
      }
      result[obj.parent].children.push(obj.code);

      //保留其他的属性，并替换掉必要属性（包括新生成的属性，和可能之前遍历子结点时生成的children属性）
      result[obj.code] = Object.assign({}, item, obj, result[obj.code]);
    });
    let temp = OrderedMap(result);
    //生成的结点中有一个只有children，则该结点的children里都是根结点
    let notExistNode = temp.find(item => !item.code);

    console.log(notExistNode);

    ////找到数据中不存在的父结点的主键值，则其孩子结点为根结点
    //let keys = temp.keySeq().toArray();
    //let parentCodes = Object.keys(childrenMap);
    //let notExistCode = parentCodes.filter(code => !keys.includes(code))[0];



    console.log(result);

    //console.log(childrenMap);
  }

  /**
   * 拆分数据为水平和垂直
   * @param menuData
   * @private
   */
  _splitMenuData(props, menuData, selected) {
    let { hNavLevels } = props;
    let filteredMenuData = menuData;

    //实际水平和垂直导航栏最多渲染的级数
    let levels = filteredMenuData.groupBy(item => item.level).size;
    let maxHLevels = Math.min(hNavLevels, levels);
    let maxVLevels = levels - maxHLevels;

    if (hNavLevels > 0) {
      if (selected && selected.length > 0 && filteredMenuData.get(selected)) {
        //如果水平导航栏有层级且selected结点存在，则需根据selected过滤menu
        filteredMenuData = this._filterMenuBySelected(filteredMenuData, selected, hNavLevels);
      } else {
        //否则，只过滤出第一层导航
        filteredMenuData = filteredMenuData.filter(item => item.level == 0);
      }
    }

    //必须过滤后处理隐藏结点，否则当selected是隐藏结点时过滤结果为空
    let showedMenuData = this._filterHideNodes(filteredMenuData);

    //生成hActiveCode和vActiveCode，需要原始的menu和过滤掉隐藏结点的menu来确定activeCode
    let { hActiveCode, vActiveCode } = this._getActiveCode(props, filteredMenuData, showedMenuData, selected);

    //拆分水平和垂直导航
    let hMenuData = showedMenuData.filter(item => item.level < hNavLevels);
    let vMenuData = showedMenuData.filter(item => item.level >= hNavLevels);

    let hLevels = hMenuData.groupBy(item => item.level).size;
    let vLevels = vMenuData.groupBy(item => item.level).size;

    return {
      hMenu: hMenuData,
      vMenu: vMenuData,
      hActiveCode, vActiveCode,
      hLevels, vLevels,
      maxHLevels, maxVLevels,
    };
  }

  /**
   * 根据selected过滤出实际需要渲染的结点
   * @param menu
   * @param selected
   * @param hNavLevels
   * @private
   */
  _filterMenuBySelected(menu, selected, hNavLevels) {
    let node = menu.get(selected);
    let filteredMenuNodes = [];
    if (node) {
      //向上找到所有的激活节点
      let activeNodes = [];
      let curNode = node;
      while (curNode) {
        activeNodes.unshift(curNode);
        curNode = menu.get(curNode.parent);
      }
      //自上向下遍历激活结点
      for (let i = 0, length = activeNodes.length; i < length; i++) {
        let item = activeNodes[i];
        //如果当前激活结点在水平导航栏
        if (item.level < hNavLevels) {
          //找到该激活结点及所有兄弟结点
          let filterNodes = menu.filter(o => o.parent == item.parent);
          filterNodes.forEach((item) => {
            filteredMenuNodes.push([item.code, item]);
          });
          //如果当前激活结点是最后一个激活结点
          if (i == length - 1) {
            //如果激活的结点是水平导航栏渲染的最后一级结点，则其下所有子结点都需要被找到
            if (item.level == hNavLevels - 1) {
              this._findChildNodes(filteredMenuNodes, menu, item.code);
            } else if (item.children) {
              //否则，只需要下一层结点
              item.children.forEach((code) => {
                filteredMenuNodes.push([code, menu.get(code)]);
              });
            }
          }
        } else {
          //如果当前激活结点在侧边导航栏
          //找到该激活结点及所有兄弟结点及所有子结点
          let filterNodes = menu.filter(o => o.parent == item.parent);
          filterNodes.forEach((item) => {
            filteredMenuNodes.push([item.code, item]);
            this._findChildNodes(filteredMenuNodes, menu, item.code);
          });
          break;
        }
      }
    }
    return OrderedMap(filteredMenuNodes);
  }

  _getActiveCode(props, menu, showedMenu, selected) {
    let hActiveCode, vActiveCode;

    //找到当前激活的结点及其父结点，并生成水平/侧边导航栏上的激活结点
    let selectedNode = menu.get(selected);
    if (selectedNode) {
      let activeNodes = [];
      let curNode = selectedNode;
      while (curNode) {
        activeNodes.unshift([curNode.level, curNode]);
        curNode = menu.get(curNode.parent);
      }
      activeNodes = OrderedMap(activeNodes);
      //根据水平导航栏显示的层级数，从下层向上查找，获取相应结点的code
      let { hNavLevels } = props;
      for (let i = hNavLevels - 1; i >= 0; i--) {
        let hActiveNode = activeNodes.get(i);
        //当hActiveNode存在，且hActiveNode存在于已经过滤掉隐藏结点的menu中
        if (hActiveNode && showedMenu.get(hActiveNode.code)) {
          hActiveCode = hActiveNode.code;
          break;
        }
      }

      //找到激活节点的最大层级
      let keys = activeNodes.keySeq().toArray();
      let maxKey = Math.max(...keys);
      if (maxKey >= hNavLevels) {
        vActiveCode = activeNodes.get(maxKey).code;
      }
    }

    return { hActiveCode, vActiveCode };
  }

  _findChildNodes(nodes, menu, code) {
    let node = menu.get(code);
    if (node && node.children) {
      node.children.forEach((code) => {
        let node = menu.get(code);
        nodes.push([node.code, node]);
        this._findChildNodes(nodes, menu, code);
      });
    }
  }

  //TODO
  addRight(right) {

  }

  /**
   * 滚动到顶部
   */
  scrollToTop() {
    let { contentWrapper } = this.refs;
    contentWrapper && (contentWrapper.scrollTop = 0);
  }
}

export default Workspace;
