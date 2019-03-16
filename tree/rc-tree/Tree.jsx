import React, { PropTypes } from 'react';
import assign from 'object-assign';
import classNames from 'classnames';
import {
  loopAllChildren, isInclude, getOffset,
  filterParentPosition, handleCheckState, getCheck,
  getStrictlyValue, arraysEqual,
} from './util';

function noop() {
}

class Tree extends React.Component {
  constructor(props) {
    super(props);
    ['onKeyDown', 'onCheck'].forEach((m) => {
      this[m] = this[m].bind(this);
    });
    this.contextmenuIds = [];
    this.checkedIdsChange = true;

    this.state = {
      expandedIds: this.getDefaultExpandedIds(props),
      checkedIds: this.getDefaultCheckedIds(props),
      selectedIds: this.getDefaultSelectedIds(props),
      dragNodesIds: '',
      dragOverNodeKey: '',
      dropNodeKey: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const expandedIds = this.getDefaultExpandedIds(nextProps, true);
    const checkedIds = this.getDefaultCheckedIds(nextProps, true);
    const selectedIds = this.getDefaultSelectedIds(nextProps, true);
    const st = {};
    if (expandedIds) {
      st.expandedIds = expandedIds;
    }
    if (checkedIds) {
      if (nextProps.checkedIds === this.props.checkedIds) {
        this.checkedIdsChange = false;
      } else {
        this.checkedIdsChange = true;
      }
      st.checkedIds = checkedIds;
    }
    if (selectedIds) {
      st.selectedIds = selectedIds;
    }
    this.setState(st);
  }

  onDragStart(e, treeNode) {
    this.dragNode = treeNode;
    this.dragNodesIds = this.getDragNodes(treeNode);
    const st = {
      dragNodesIds: this.dragNodesIds,
    };
    const expandedIds = this.getExpandedIds(treeNode, false);
    if (expandedIds) {
      // Controlled expand, save and then reset
      this.getRawExpandedIds();
      st.expandedIds = expandedIds;
    }
    this.setState(st);
    this.props.onDragStart({
      event: e,
      nodeId: treeNode.props.id,
    });
    this._dropTrigger = false;
  }

  onDragEnterGap(e, treeNode) {
    const offsetTop = (0, getOffset)(treeNode.refs.selectHandle).top;
    const offsetHeight = treeNode.refs.selectHandle.offsetHeight;
    const pageY = e.pageY;
    const gapHeight = 2;
    if (pageY > offsetTop + offsetHeight - gapHeight) {
      this.dropPosition = 1;
      return 1;
    }
    if (pageY < offsetTop + gapHeight) {
      this.dropPosition = -1;
      return -1;
    }
    this.dropPosition = 0;
    return 0;
  }

  onDragEnter(e, treeNode) {
    const enterGap = this.onDragEnterGap(e, treeNode);
    if (this.dragNode.props.eventKey === treeNode.props.eventKey && enterGap === 0) {
      this.setState({
        dragOverNodeKey: '',
      });
      return;
    }
    const st = {
      dragOverNodeKey: treeNode.props.eventKey,
    };
    const expandedIds = this.getExpandedIds(treeNode, true);
    if (expandedIds) {
      this.getRawExpandedIds();
      st.expandedIds = expandedIds;
    }
    this.setState(st);
    this.props.onDragEnter({
      event: e,
      nodeId: treeNode.props.id,
      expandedIds: expandedIds && [...expandedIds] || [...this.state.expandedIds],
    });
  }

  onDragOver(e, treeNode) {
    this.props.onDragOver({ event: e, nodeId: treeNode.props.id });
  }

  onDragLeave(e, treeNode) {
    this.props.onDragLeave({ event: e, nodeId: treeNode.props.id });
  }

  onDrop(e, treeNode) {
    const key = treeNode.props.eventKey;
    this.setState({
      dragOverNodeKey: '',
      dropNodeKey: key,
    });
    if (this.dragNodesIds.indexOf(key) > -1) {
      if (console.warn) {
        console.warn('can not drop to dragNode(include it\'s children node)');
      }
      return false;
    }

    const posArr = treeNode.props.pos.split('-');
    const res = {
      event: e,
      nodeId: treeNode.props.id,
      dragNode: this.dragNode,
      dragNodesIds: [...this.dragNodesIds],
      dropPosition: this.dropPosition + Number(posArr[posArr.length - 1]),
    };
    if (this.dropPosition !== 0) {
      res.dropToGap = true;
    }
    if (this.props.expandedIds) {
      res.rawExpandedIds = this._rawExpandedIds ? [...this._rawExpandedIds] : [...this.state.expandedIds];
    }
    this.props.onDrop(res);
    this._dropTrigger = true;
  }

  onExpand(treeNode) {
    const expanded = !treeNode.props.expanded;
    const controlled = 'expandedIds' in this.props;
    const expandedIds = [...this.state.expandedIds];
    const index = expandedIds.indexOf(treeNode.props.eventKey);
    if (expanded && index === -1) {
      expandedIds.push(treeNode.props.eventKey);
    } else if (!expanded && index > -1) {
      expandedIds.splice(index, 1);
    }
    if (!controlled) {
      this.setState({ expandedIds });
    }
    this.props.onExpand(expandedIds, { nodeId: treeNode.props.id, expanded });

    // after data loaded, need set new expandedIds
    if (expanded && this.props.loadData) {
      return this.props.loadData(treeNode).then(() => {
        if (!controlled) {
          this.setState({ expandedIds });
        }
      });
    }
  }

  onCheck(treeNode) {
    let checked = !treeNode.props.checked;
    if (treeNode.props.halfChecked) {
      checked = true;
    }
    const key = treeNode.props.eventKey;
    let checkedIds = [...this.state.checkedIds];
    const index = checkedIds.indexOf(key);

    const newSt = {
      event: 'check',
      nodeId: treeNode.props.id,
      checked,
    };

    if (this.props.checkStrictly && ('checkedIds' in this.props)) {
      if (checked && index === -1) {
        checkedIds.push(key);
      }
      if (!checked && index > -1) {
        checkedIds.splice(index, 1);
      }
      newSt.checkedNodes = [];
      loopAllChildren(this.props.children, (item, ind, pos, keyOrPos) => {
        if (checkedIds.indexOf(keyOrPos) !== -1) {
          newSt.checkedNodes.push(item);
        }
      });
      this.props.onCheck(getStrictlyValue(checkedIds, this.props.checkedIds.halfChecked), newSt);
    } else {
      if (checked && index === -1) {
        this.treeNodesStates[treeNode.props.pos].checked = true;
        const checkedPositions = [];
        Object.keys(this.treeNodesStates).forEach(i => {
          if (this.treeNodesStates[i].checked) {
            checkedPositions.push(i);
          }
        });
        handleCheckState(this.treeNodesStates, filterParentPosition(checkedPositions), true);
      }
      if (!checked) {
        this.treeNodesStates[treeNode.props.pos].checked = false;
        this.treeNodesStates[treeNode.props.pos].halfChecked = false;
        handleCheckState(this.treeNodesStates, [treeNode.props.pos], false);
      }
      const checkIds = getCheck(this.treeNodesStates);
      newSt.checkedNodes = checkIds.checkedNodes;
      newSt.checkedNodesPositions = checkIds.checkedNodesPositions;
      newSt.halfCheckedIds = checkIds.halfCheckedIds;
      this.checkIds = checkIds;

      this._checkedIds = checkedIds = checkIds.checkedIds;
      if (!('checkedIds' in this.props)) {
        this.setState({
          checkedIds,
        });
      }
      this.props.onCheck(checkedIds, newSt);
    }
  }

  onSelect(treeNode) {
    const props = this.props;
    const selectedIds = [...this.state.selectedIds];
    const eventKey = treeNode.props.eventKey;
    const index = selectedIds.indexOf(eventKey);
    let selected;
    if (index !== -1) {
      selected = false;
      selectedIds.splice(index, 1);
    } else {
      selected = true;
      if (!props.multiple) {
        selectedIds.length = 0;
      }
      selectedIds.push(eventKey);
    }
    const selectedNodes = [];
    if (selectedIds.length) {
      loopAllChildren(this.props.children, (item) => {
        if (selectedIds.indexOf(item.props.id || item.key) !== -1) {
          selectedNodes.push(item);
        }
      });
    }
    const newSt = {
      event: 'select',
      nodeId: treeNode.props.id,
      selected,
      selectedNodes,
    };
    if (!('selectedIds' in this.props)) {
      this.setState({
        selectedIds,
      });
    }
    props.onSelect(selectedIds, newSt);
  }

  onMouseEnter(e, treeNode) {
    this.props.onMouseEnter({ event: e, node: treeNode });
  }

  onMouseLeave(e, treeNode) {
    this.props.onMouseLeave({ event: e, node: treeNode });
  }

  onContextMenu(e, treeNode) {
    const selectedIds = [...this.state.selectedIds];
    const eventKey = treeNode.props.eventKey;
    if (this.contextmenuIds.indexOf(eventKey) === -1) {
      this.contextmenuIds.push(eventKey);
    }
    this.contextmenuIds.forEach((key) => {
      const index = selectedIds.indexOf(key);
      if (index !== -1) {
        selectedIds.splice(index, 1);
      }
    });
    if (selectedIds.indexOf(eventKey) === -1) {
      selectedIds.push(eventKey);
    }
    this.setState({
      selectedIds,
    });
    this.props.onRightClick({ event: e, node: treeNode });
  }

  // all keyboard events callbacks run from here at first
  onKeyDown(e) {
    e.preventDefault();
  }

  getFilterExpandedIds(props, expandKeyProp, expandAll) {
    const keys = props[expandKeyProp];
    if (!expandAll && !props.autoExpandParent) {
      return keys || [];
    }
    const expandedPositionArr = [];
    if (props.autoExpandParent) {
      loopAllChildren(props.children, (item, index, pos, newKey) => {
        if (keys.indexOf(newKey) > -1) {
          expandedPositionArr.push(pos);
        }
      });
    }
    const filterExpandedIds = [];
    loopAllChildren(props.children, (item, index, pos, newKey) => {
      if (expandAll) {
        filterExpandedIds.push(newKey);
      } else if (props.autoExpandParent) {
        expandedPositionArr.forEach(p => {
          if ((p.split('-').length > pos.split('-').length
            && isInclude(pos.split('-'), p.split('-')) || pos === p)
            && filterExpandedIds.indexOf(newKey) === -1) {
            filterExpandedIds.push(newKey);
          }
        });
      }
    });
    return filterExpandedIds.length ? filterExpandedIds : keys;
  }

  getDefaultExpandedIds(props, willReceiveProps) {
    let expandedIds = willReceiveProps ? undefined :
      this.getFilterExpandedIds(props, 'defaultExpandedIds',
        props.defaultExpandedIds.length ? false : props.defaultExpandAll);
    if (props.expandedIds) {
      expandedIds = (props.autoExpandParent && !willReceiveProps ?
        this.getFilterExpandedIds(props, 'expandedIds', false) :
        props.expandedIds) || [];
    }
    return expandedIds;
  }

  getDefaultCheckedIds(props, willReceiveProps) {
    let checkedIds = willReceiveProps ? undefined : props.defaultCheckedIds;
    if ('checkedIds' in props) {
      checkedIds = props.checkedIds || [];
      if (props.checkStrictly) {
        if (props.checkedIds.checked) {
          checkedIds = props.checkedIds.checked;
        } else if (!Array.isArray(props.checkedIds)) {
          checkedIds = [];
        }
      }
    }
    return checkedIds;
  }

  getDefaultSelectedIds(props, willReceiveProps) {
    const getIds = (keys) => {
      if (props.multiple) {
        return [...keys];
      }
      if (keys.length) {
        return [keys[0]];
      }
      return keys;
    };
    let selectedIds = willReceiveProps ? undefined : getIds(props.defaultSelectedIds);
    if ('selectedIds' in props) {
      selectedIds = getIds(props.selectedIds);
    }
    return selectedIds;
  }

  getRawExpandedIds() {
    if (!this._rawExpandedIds && ('expandedIds' in this.props)) {
      this._rawExpandedIds = [...this.state.expandedIds];
    }
  }

  getOpenTransitionName() {
    const props = this.props;
    let transitionName = props.openTransitionName;
    const animationName = props.openAnimation;
    if (!transitionName && typeof animationName === 'string') {
      transitionName = `${props.prefixCls}-open-${animationName}`;
    }
    return transitionName;
  }

  getDragNodes(treeNode) {
    const dragNodesIds = [];
    const tPArr = treeNode.props.pos.split('-');
    loopAllChildren(this.props.children, (item, index, pos, newKey) => {
      const pArr = pos.split('-');
      if (treeNode.props.pos === pos || tPArr.length < pArr.length && isInclude(tPArr, pArr)) {
        dragNodesIds.push(newKey);
      }
    });
    return dragNodesIds;
  }

  getExpandedIds(treeNode, expand) {
    const key = treeNode.props.eventKey;
    const expandedIds = this.state.expandedIds;
    const expandedIndex = expandedIds.indexOf(key);
    let exIds;
    if (expandedIndex > -1 && !expand) {
      exIds = [...expandedIds];
      exIds.splice(expandedIndex, 1);
      return exIds;
    }
    if (expand && expandedIds.indexOf(key) === -1) {
      return expandedIds.concat([key]);
    }
  }

  filterTreeNode(treeNode) {
    const filterTreeNode = this.props.filterTreeNode;
    if (typeof filterTreeNode !== 'function' || treeNode.props.disabled) {
      return false;
    }
    return filterTreeNode.call(this, treeNode);
  }

  renderTreeNode(child, index, level = 0) {
    const pos = `${level}-${index}`;
    const key = child.props.id || child.key || pos;
    const id = child.props.id;
    const state = this.state;
    const props = this.props;

    // prefer to child's own selectable property if passed
    let selectable = props.selectable;
    if (child.props.hasOwnProperty('selectable')) {
      selectable = child.props.selectable;
    }

    const cloneProps = {
      ref: `treeNode-${key}`,
      root: this,
      eventKey: id,
      pos,
      selectable,
      loadData: props.loadData,
      onMouseEnter: props.onMouseEnter,
      onMouseLeave: props.onMouseLeave,
      onRightClick: props.onRightClick,
      prefixCls: props.prefixCls,
      showLine: props.showLine,
      showIcon: props.showIcon,
      draggable: props.draggable,
      dragOver: state.dragOverNodeKey == key && this.dropPosition === 0,
      dragOverGapTop: state.dragOverNodeKey == key && this.dropPosition === -1,
      dragOverGapBottom: state.dragOverNodeKey == key && this.dropPosition === 1,
      _dropTrigger: this._dropTrigger,
      expanded: state.expandedIds.indexOf(id) !== -1,
      selected: state.selectedIds.indexOf(id) !== -1,
      openTransitionName: this.getOpenTransitionName(),
      openAnimation: props.openAnimation,
      filterTreeNode: this.filterTreeNode.bind(this),
    };
    if (props.checkable) {
      cloneProps.checkable = props.checkable;
      if (props.checkStrictly) {
        if (state.checkedIds) {
          cloneProps.checked = state.checkedIds.indexOf(key) !== -1 || false;
        }
        if (props.checkedIds.halfChecked) {
          cloneProps.halfChecked = props.checkedIds.halfChecked.indexOf(key) !== -1 || false;
        } else {
          cloneProps.halfChecked = false;
        }
      } else {
        if (this.checkedIds) {
          cloneProps.checked = this.checkedIds.indexOf(key) !== -1 || false;
        }
        cloneProps.halfChecked = this.halfCheckedIds.indexOf(key) !== -1;
      }

      if (this.treeNodesStates[pos]) {
        assign(cloneProps, this.treeNodesStates[pos].siblingPosition);
      }
    }
    return React.cloneElement(child, cloneProps);
  }

  render() {
    const props = this.props;
    const domProps = {
      className: classNames(props.className, props.prefixCls, {[props.prefixCls + '-showLine']: props.showLine}),
      role: 'tree-node',
    };
    if (props.focusable) {
      domProps.tabIndex = '0';
      domProps.onKeyDown = this.onKeyDown;
    }
    // console.log(this.state.expandedIds, this._rawExpandedIds, props.children);
    if (props.checkable && (this.checkedIdsChange || props.loadData)) {
      if (props.checkStrictly) {
        this.treeNodesStates = {};
        loopAllChildren(props.children, (item, index, pos, keyOrPos, siblingPosition) => {
          this.treeNodesStates[pos] = {
            siblingPosition,
          };
        });
      } else if (props._treeNodesStates) {
        this.treeNodesStates = props._treeNodesStates.treeNodesStates;
        this.halfCheckedIds = props._treeNodesStates.halfCheckedIds;
        this.checkedIds = props._treeNodesStates.checkedIds;
      } else {
        const checkedIds = this.state.checkedIds;
        let checkIds;
        if (!props.loadData && this.checkIds && this._checkedIds &&
          arraysEqual(this._checkedIds, checkedIds)) {
          // if checkedIds the same as _checkedIds from onCheck, use _checkedIds.
          checkIds = this.checkIds;
        } else {
          const checkedPositions = [];
          this.treeNodesStates = {};
          loopAllChildren(props.children, (item, index, pos, keyOrPos, siblingPosition) => {
            this.treeNodesStates[pos] = {
              node: item,
              key: keyOrPos,
              checked: false,
              halfChecked: false,
              siblingPosition,
            };
            if (checkedIds.indexOf(keyOrPos) !== -1) {
              this.treeNodesStates[pos].checked = true;
              checkedPositions.push(pos);
            }
          });
          // if the parent node's key exists, it all children node will be checked
          handleCheckState(this.treeNodesStates, filterParentPosition(checkedPositions), true);
          checkIds = getCheck(this.treeNodesStates);
        }
        this.halfCheckedIds = checkIds.halfCheckedIds;
        this.checkedIds = checkIds.checkedIds;
      }
    }

    return (
      <ul {...domProps} unselectable ref="tree">
        {React.Children.map(props.children, this.renderTreeNode, this)}
      </ul>
    );
  }
}

Tree.propTypes = {
  prefixCls: PropTypes.string,
  children: PropTypes.any,
  showLine: PropTypes.bool,
  showIcon: PropTypes.bool,
  selectable: PropTypes.bool,
  multiple: PropTypes.bool,
  checkable: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.node,
  ]),
  _treeNodesStates: PropTypes.object,
  checkStrictly: PropTypes.bool,
  draggable: PropTypes.bool,
  autoExpandParent: PropTypes.bool,
  defaultExpandAll: PropTypes.bool,
  defaultExpandedIds: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  expandedIds: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  defaultCheckedIds: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  checkedIds: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    PropTypes.object,
  ]),
  defaultSelectedIds: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  selectedIds: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  onExpand: PropTypes.func,
  onCheck: PropTypes.func,
  onSelect: PropTypes.func,
  loadData: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onRightClick: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragEnter: PropTypes.func,
  onDragOver: PropTypes.func,
  onDragLeave: PropTypes.func,
  onDrop: PropTypes.func,
  filterTreeNode: PropTypes.func,
  openTransitionName: PropTypes.string,
  openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

Tree.defaultProps = {
  prefixCls: 'rc-tree',
  showLine: false,
  showIcon: true,
  selectable: true,
  multiple: false,
  checkable: false,
  checkStrictly: false,
  draggable: false,
  autoExpandParent: true,
  defaultExpandAll: false,
  defaultExpandedIds: [],
  defaultCheckedIds: [],
  defaultSelectedIds: [],
  onExpand: noop,
  onCheck: noop,
  onSelect: noop,
  onDragStart: noop,
  onDragEnter: noop,
  onDragOver: noop,
  onDragLeave: noop,
  onDrop: noop,
};

export default Tree;
