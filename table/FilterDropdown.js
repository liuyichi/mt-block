import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import Trigger from '../trigger';
import Checkbox from '../checkbox';
import { IconPrefixCls as iconPrefixCls, getComponent } from '../util/data';

//TODO Icon 引入

// React Stateless
const FilterDropdownMenuWrapper = ({ prefixCls, style, onClick, children }) => (
  <div className={`${prefixCls}-filter-dropdown`} style={style} onClick={onClick}>{children}</div>
);
FilterDropdownMenuWrapper.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.any
};

export default class FilterMenu extends Component {
  static propTypes = {
    locale: PropTypes.any,
    selectedKeys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
    column: PropTypes.shape({
      filterWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      filterMultiple: PropTypes.bool,
      allSelectable: PropTypes.bool,
      filterDropdown: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
      filters: PropTypes.array,
    }),
    confirmFilter: PropTypes.func,
    getPopupContainer: PropTypes.func
  };
  static defaultProps = {
    handleFilter() {},
    column: null,
    getPopupContainer() {return document.body}
  };

  constructor(props) {
    super(props);

    let { column } = props;
    let visible = false;
    //如果是自定义的筛选，则允许定义下拉初始时是否显示
    if ('filterDropdown' in column) {
      visible = column.filterDropdownVisible === true;
    }

    this.state = {
      selectedKeys: props.selectedKeys,
      keyPathOfSelectedItem: {},    // 记录所有有选中子菜单的祖先菜单
      visible,
    };
  }

  componentDidMount() {
    // 点击了控件内区域以及弹出层之外  关闭弹窗
    this.removeMenu = (e) => {
      let { container, trigger } = this.refs;
      if (this.state.visible
        && !findDOMNode(container).contains(e.target)
        && !trigger.getPopupDOMNode().contains(e.target)
      ) {
        this.setState({visible: false});
      }
    };
    window.addEventListener('click', this.removeMenu, false);
  }

  componentWillReceiveProps(nextProps) {
    let { selectedKeys, column } = nextProps;
    //如果是自定义筛选，且传入了下拉是否显示
    if ('filterDropdown' in column && 'filterDropdownVisible' in column) {
      this.setState({
        visible: column.filterDropdownVisible,
      })
    }
    this.setState({ selectedKeys });
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.removeMenu, false);
  }

  /**
   * 更新当前选中的筛选条件
   * @param key 当前选中的筛选条件
   */
  setSelectedKeys = (key, e) => {
    var selectedKeys = this.state.selectedKeys.slice() || [];
    const { column } = this.props;
    const multiple = ('filterMultiple' in column) ? column.filterMultiple : true;
    if (multiple) {
      var index = selectedKeys.indexOf(key);
      if (index === -1) {
        selectedKeys.push(key);
      } else {
        selectedKeys.splice(index, 1);
      }
    } else {
      selectedKeys = [key];
    }
    this.setState({ selectedKeys }, () => {
      !multiple && this.handleConfirm();
    });
    e.stopPropagation();
  };

  handleClearFilters = () => {
    this.setState({
      selectedKeys: [],
    }, () => this.handleConfirm([]));
  };

  handleConfirm = (selectedKeys) => {
    this.setState({
      visible: false,
    });
    this.confirmFilter(selectedKeys);
  };

  /**
   * 点击筛选按钮
   * @param visible 将要切换的状态
   */
  onVisibleChange = (visible) => {
    this.setState({
      visible,
    });
    if (!visible) {
      this.confirmFilter();
    }
  };

  confirmFilter(selectedKeys) {
    selectedKeys = selectedKeys || this.state.selectedKeys;
    if (selectedKeys !== this.props.selectedKeys) {
      this.props.confirmFilter(this.props.column, selectedKeys);
    }
  }

  renderMenuItem(item) {
    const { column } = this.props;
    const multiple = ('filterMultiple' in column) ? column.filterMultiple : true;
    const checked = this.state.selectedKeys.indexOf(item.value.toString()) >= 0;
    return (
      <li key={item.value} onClick={this.setSelectedKeys.bind(this, item.value.toString())} className={checked ? 'active' : ''}>
        {
          multiple
            ? <Checkbox checked={checked} size='small' label={item.text} />
            : <a>{item.text}</a>
        }
      </li>
    );
  }

  renderMenus(items) {
    return items.map(item => {
      if (item.children && item.children.length > 0) {
        const { keyPathOfSelectedItem, selectedKeys } = this.state;
        const containSelected = Object.keys(keyPathOfSelectedItem).some(
          key => keyPathOfSelectedItem[key].indexOf(item.value) >= 0
        );
        const { column } = this.props;
        const multiple = ('filterMultiple' in column) ? column.filterMultiple : true;
        const subMenuCls = containSelected ? `${this.props.prefixCls}-dropdown-submenu-contain-selected` : '';
        const checked = selectedKeys.indexOf(item.value.toString()) >= 0;
        const key = item.value.toString();
        return (
          <li title={item.text} className={subMenuCls} onClick={this.handleMenuItemClick.bind(this, key)} key={key}>
            {column.allSelectable && multiple && <Checkbox checked={checked} onClick={this.setSelectedKeys.bind(this, key)} />}
            <i className={`${iconPrefixCls} ${iconPrefixCls}-angle-right`}></i>
            <span>{item.text}</span>
            <ul>
              {item.children.map(child => this.renderMenuItem(child))}
            </ul>
          </li>
        );
      }
      return this.renderMenuItem(item);
    });
  }

  handleMenuItemClick = (key, e) => {
    const keyPathOfSelectedItem = this.state.keyPathOfSelectedItem;
    if (keyPathOfSelectedItem[key]) {
      // deselect SubMenu child
      delete keyPathOfSelectedItem[key];
    } else {
      // select SubMenu child
      keyPathOfSelectedItem[key] = key;
    }
    this.setState({ keyPathOfSelectedItem });
    e.stopPropagation();
  };

  _getRootTarget = () => {
    return findDOMNode(this);
  };

  render() {
    const { column, locale, prefixCls, getPopupContainer } = this.props;
    const { visible } = this.state;
    const multiple = ('filterMultiple' in column) ? column.filterMultiple : true;

    const menus = column.filterDropdown ? getComponent(column.filterDropdown, {
      confirm: this.handleConfirm,
      cancel: this.handleClearFilters,
    }) : (
      <FilterDropdownMenuWrapper prefixCls={prefixCls} style={{width: column.filterWidth || 'auto'}}>
        <ul className={`${prefixCls}-dropdown-menu`}>
          {this.renderMenus(column.filters)}
        </ul>
        <div className={`${prefixCls}-filter-dropdown-btns`}>
          {multiple && <a
            className={`${prefixCls}-filter-dropdown-link confirm`}
            onClick={() => this.handleConfirm(this.state.selectedKeys)}
          >
            {locale.filterConfirm}
          </a>}
          <a
            className={`${prefixCls}-filter-dropdown-link clear`}
            onClick={this.handleClearFilters}
          >
            {locale.filterReset}
          </a>
        </div>
      </FilterDropdownMenuWrapper>
    );

    const dropdownSelectedClass = classNames({
      [`${prefixCls}-filter-selected`]: this.props.selectedKeys.length > 0 || column.filtered,
      [`${iconPrefixCls}`]: true,
      [`${iconPrefixCls}-filter`]: true,
    });

    return (
      <i title={locale.filterTitle} className={dropdownSelectedClass} onClick={this.onVisibleChange.bind(this, !visible)} ref="container">
        <Trigger ref="trigger" autoDestory visible={visible} equalTargetWidth={false} getPopupContainer={getPopupContainer} target={this._getRootTarget} {...column.triggerModel}>
          {menus}
        </Trigger>
      </i>
    );
  }
}
