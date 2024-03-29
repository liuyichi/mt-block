import React, { PropTypes } from 'react';
import classNames from 'classnames';
import Animate from '../../util/rc-animate';
import Checkbox from '../../checkbox/Checkbox';
import { browser } from './util';
import { IconPrefixCls, getComponent, isFunction, isString } from '../../util/data';

const browserUa = typeof window !== 'undefined' ? browser(window.navigator) : '';
const ieOrEdge = /.*(IE|Edge).+/.test(browserUa);
// const uaArray = browserUa.split(' ');
// const gtIE8 = uaArray.length !== 2 || uaArray[0].indexOf('IE') === -1 || Number(uaArray[1]) > 8;

const defaultTitle = '---';

class TreeNode extends React.Component {
  constructor(props) {
    super(props);
    [
      'onExpand',
      'onCheck',
      'onContextMenu',
      'onMouseEnter',
      'onMouseLeave',
      'onDragStart',
      'onDragEnter',
      'onDragOver',
      'onDragLeave',
      'onDrop',
    ].forEach((m) => {
      this[m] = this[m].bind(this);
    });
    this.state = {
      dataLoading: false,
      dragNodeHighlight: false,
    };
  }

  componentDidMount() {
    if (!this.props.root._treeNodeInstances) {
      this.props.root._treeNodeInstances = [];
    }
    this.props.root._treeNodeInstances.push(this);
  }
  // shouldComponentUpdate(nextProps) {
  //   if (!nextProps.expanded) {
  //     return false;
  //   }
  //   return true;
  // }

  onCheck() {
    this.props.root.onCheck(this);
  }

  onSelect() {
    this.props.root.onSelect(this);
  }

  onMouseEnter(e) {
    e.preventDefault();
    this.props.root.onMouseEnter(e, this);
  }

  onMouseLeave(e) {
    e.preventDefault();
    this.props.root.onMouseLeave(e, this);
  }

  onContextMenu(e) {
    e.preventDefault();
    this.props.root.onContextMenu(e, this);
  }

  onDragStart(e) {
    // console.log('dragstart', this.props.eventKey, e);
    // e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragNodeHighlight: true,
    });
    this.props.root.onDragStart(e, this);
    try {
      // ie throw error
      e.dataTransfer.setData('text/plain', 'firefox-need-it');
    } finally {
      // empty
    }
  }

  onDragEnter(e) {
    // console.log('dragenter', this.props.eventKey, e);
    e.preventDefault();
    e.stopPropagation();
    this.props.root.onDragEnter(e, this);
  }

  onDragOver(e) {
    // console.log(this.props.eventKey, e);
    // todo disabled
    e.preventDefault();
    e.stopPropagation();
    this.props.root.onDragOver(e, this);
    return false;
  }

  onDragLeave(e) {
    // console.log(this.props.eventKey, e);
    e.stopPropagation();
    this.props.root.onDragLeave(e, this);
  }

  onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragNodeHighlight: false,
    });
    this.props.root.onDrop(e, this);
  }

  onExpand() {
    const callbackPromise = this.props.root.onExpand(this);
    if (callbackPromise && typeof callbackPromise === 'object') {
      const setLoading = (dataLoading) => {
        this.setState({ dataLoading });
      };
      setLoading(true);
      callbackPromise.then(() => {
        setLoading(false);
      }, () => {
        setLoading(false);
      });
    }
  }

  // keyboard event support
  onKeyDown(e) {
    e.preventDefault();
  }

  renderSwitcher(props, expandedState) {
    const prefixCls = props.prefixCls;
    let IconFormat = props.iconFormat && getComponent(props.iconFormat[expandedState], props);
    const switcherCls = {
      [`${prefixCls}-switcher`]: true
    };
    if (isString(IconFormat)) {
      switcherCls[`${prefixCls}-switcher-format`] = true;
      switcherCls[`${IconFormat}`] = true;
    } else if (!IconFormat) {
      switcherCls[`${IconPrefixCls}-caret-down`] = !props.showLine;
      switcherCls[`${prefixCls}-showLine-${expandedState}`] = props.showLine;
    }
    if (!props.showLine) {
      switcherCls[`${prefixCls}-noline_${expandedState}`] = true;
    } else if (props.pos === '0-0') {
      switcherCls[`${prefixCls}-roots_${expandedState}`] = true;
    } else {
      switcherCls[`${prefixCls}-center_${expandedState}`] = !props.last;
      switcherCls[`${prefixCls}-bottom_${expandedState}`] = props.last;
    }
    if (React.isValidElement(IconFormat)) {
      return React.cloneElement(IconFormat, {className: classNames(switcherCls, `${prefixCls}-switcher-format`, IconFormat.props.className), onClick: !props.disabled && this.onExpand});
    }
    if (props.disabled) {
      switcherCls[`${prefixCls}-switcher-disabled`] = true;
      return <span className={classNames(switcherCls)} />;
    }
    return <span className={classNames(switcherCls)} onClick={this.onExpand} />;
  }

  renderCheckbox(props) {
    return (
      <Checkbox
        className={`${props.prefixCls}-checkbox`}
        checked={props.checked}
        indeterminate={props.checkHalfable && props.halfChecked}
        disabled={props.disabled || props.disableCheckbox}
        onClick={this.onCheck}
      />
    );
  }

  renderChildren(props) {
    const renderFirst = this.renderFirst;
    this.renderFirst = 1;
    let transitionAppear = true;
    if (!renderFirst && props.expanded) {
      transitionAppear = false;
    }
    const children = props.children;
    let newChildren = children;
    if (children &&
      (children.type === TreeNode ||
      Array.isArray(children) &&
      children.every((item) => {
        return item.type === TreeNode;
      }))) {
      const cls = {
        [`${props.prefixCls}-child-tree`]: true,
        [`${props.prefixCls}-child-tree-open`]: props.expanded,
      };
      if (props.showLine) {
        cls[`${props.prefixCls}-line`] = !props.last;
      }
      const animProps = {};
      if (props.openTransitionName) {
        animProps.transitionName = props.openTransitionName;
      } else if (typeof props.openAnimation === 'object') {
        animProps.animation = Object.assign({}, props.openAnimation);
        if (!transitionAppear) {
          delete animProps.animation.appear;
        }
      }
      newChildren = (
        <Animate {...animProps}
          showProp="data-expanded"
          transitionAppear={transitionAppear}
          component=""
        >
          {!props.expanded ? null : <ul className={classNames(cls)} data-expanded={props.expanded}>
            {React.Children.map(children, (item, index) => {
              return props.root.renderTreeNode(item, index, props.pos);
            }, props.root)}
          </ul>}
        </Animate>
      );
    }
    return newChildren;
  }

  render() {
    const props = this.props;
    const prefixCls = props.prefixCls;
    const expandedState = props.expanded ? 'open' : 'close';

    const iconEleCls = {
      [`${prefixCls}-iconEle`]: true,
      [`${prefixCls}-icon_loading`]: this.state.dataLoading,
      [`${IconPrefixCls}-loading`]: this.state.dataLoading,
      [`${prefixCls}-icon__${expandedState}`]: true,
    };

    let canRenderSwitcher = true;
    const content = props.title;
    let newChildren = this.renderChildren(props);
    if (!newChildren || newChildren === props.children) {
      // content = newChildren;
      newChildren = null;
      if (props.isLeaf) {
        canRenderSwitcher = false;
      }
    }
    // For performance, does't render children into dom when `!props.expanded` (move to Animate)
    // if (!props.expanded) {
    //   newChildren = null;
    // }

    const selectHandle = () => {
      const icon = (props.showIcon || props.loadData && this.state.dataLoading) ?
        <span className={classNames(iconEleCls)}></span> : null;
      const title = <span className={`${prefixCls}-title`}>{content}</span>;
      const domProps = {};
      if (!props.disabled) {
        if (props.selected || !props._dropTrigger && this.state.dragNodeHighlight) {
          domProps.className = `${prefixCls}-node-selected`;
        }
        if (!props.selectable) {
          domProps.className = `${prefixCls}-not-selectable`;
        }
        domProps.onClick = (e) => {
          e.preventDefault();
          if (props.selectable) {
            this.onSelect();
          }
          // not fire check event
          // if (props.checkable) {
          //   this.onCheck();
          // }
        };
        if (props.onRightClick) {
          domProps.onContextMenu = this.onContextMenu;
        }
        if (props.onMouseEnter) {
          domProps.onMouseEnter = this.onMouseEnter;
        }
        if (props.onMouseLeave) {
          domProps.onMouseLeave = this.onMouseLeave;
        }
        if (props.draggable) {
          if (ieOrEdge) {
            // ie bug!
            domProps.href = '#';
          }
          domProps.draggable = true;
          domProps['aria-grabbed'] = true;
          domProps.onDragStart = this.onDragStart;
        }
      }
      return (
        <a ref="selectHandle" title={typeof content === 'string' ? content : ''} {...domProps}>
          {icon}{title}
        </a>
      );
    };

    const liProps = {};
    if (props.draggable) {
      liProps.onDragEnter = this.onDragEnter;
      liProps.onDragOver = this.onDragOver;
      liProps.onDragLeave = this.onDragLeave;
      liProps.onDrop = this.onDrop;
    }

    let disabledCls = '';
    let dragOverCls = '';
    if (props.disabled) {
      disabledCls = `${prefixCls}-treenode-disabled`;
    } else if (props.dragOver) {
      dragOverCls = 'drag-over';
    } else if (props.dragOverGapTop) {
      dragOverCls = 'drag-over-gap-top';
    } else if (props.dragOverGapBottom) {
      dragOverCls = 'drag-over-gap-bottom';
    }

    const filterCls = props.filterTreeNode(this) ? 'filter-node' : '';

    const noopSwitcher = () => {
      let IconFormat = props.iconFormat && getComponent(props.iconFormat.leaf, props);
      const cls = {
        [`${prefixCls}-switcher`]: true,
      };
      if (isString(IconFormat)) {
        cls[`${prefixCls}-switcher-format`] = true;
        cls[`${IconFormat}`] = true;
      } else if (!IconFormat) {
        cls[`${prefixCls}-switcher-noop`] = !props.showLine;
        cls[`${prefixCls}-showLine-noop`] = props.showLine;
        cls[`${IconPrefixCls}-file-o`] = props.showLine;
      }
      if (props.showLine) {
        cls[`${prefixCls}-center_docu`] = !props.last;
        cls[`${prefixCls}-bottom_docu`] = props.last;
      } else {
        cls[`${prefixCls}-noline_docu`] = true;
      }
      if (React.isValidElement(IconFormat)) {
        return React.cloneElement(IconFormat, {className: classNames(cls, `${prefixCls}-switcher-format`, IconFormat.props.className)});
      }
      return <span className={classNames(cls)}></span>;
    };

    return (
      <li {...liProps} ref="li"
        className={classNames(props.className, disabledCls, dragOverCls, filterCls) }
      >
        {canRenderSwitcher ? this.renderSwitcher(props, expandedState) : noopSwitcher()}
        {props.checkable ? this.renderCheckbox(props) : null}
        {selectHandle()}
        {newChildren}
      </li>
    );
  }
}

TreeNode.isTreeNode = 1;

TreeNode.propTypes = {
  prefixCls: PropTypes.string,
  disabled: PropTypes.bool,
  disableCheckbox: PropTypes.bool,
  checkHalfable: PropTypes.bool,
  expanded: PropTypes.bool,
  isLeaf: PropTypes.bool,
  root: PropTypes.object,
  onSelect: PropTypes.func,
};

TreeNode.defaultProps = {
  title: defaultTitle,
  checkHalfable: true,
};

export default TreeNode;
