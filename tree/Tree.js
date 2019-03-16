import React from 'react';
import RcTree from './rc-tree';
import U from '../util';

class Tree extends U.BaseComponent {
  static defaultProps = {
    prefixCls: 'mt',
    data: [],
    leafField: 'leaf',
    checkable: false,
    selectFolderable: true,
    showIcon: false,
  };
  constructor(props) {
    super(props);
    this.resolveRelationship(this.props);
    for (let k of Object.keys(this.props)) {
      if (k.indexOf('Key') !== -1) {
        console.error(`方法 ${k} 已经废弃，请立即迁移到 ${k.replace('Key', 'Id')} 方法`);
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    this.resolveRelationship(nextProps);
  }
  render() {
    let { data, prefixCls, checkable, onExpand, loadData } = this.props;
    if (data == null || data.length === 0) return null;
    return (
      <RcTree
        {...this.props}
        prefixCls={prefixCls + '-tree'}
        checkable={checkable && <span className={`${prefixCls}-checkbox-inner`} />}
        defaultExpandAll={undefined}
        defaultExpandedIds={this.resolveDefaultExpandedIds()}
        loadData={loadData && this.handleLoadData}
        children={this.renderNodes(this.getRootIds())}
      />
    );
  }
  renderNodes(nodeIds) {
    let { leafField, format=Tree.defaultFormat, checkHalfable, selectFolderable, iconFormat } = this.props;
    if (nodeIds.length === 0) return undefined;
    return (
      nodeIds.map(nodeId => {
        let node = this.getNode(nodeId);
        return (
          <RcTree.TreeNode
            key={nodeId}
            data={node}
            id={nodeId}
            iconFormat={iconFormat}
            title={format(node, this)}
            disabled={node.disabled}
            disableCheckbox={node.disableCheckbox}
            selectable={(node[leafField] || selectFolderable) && (node.selectable === undefined || node.selectable)}
            isLeaf={node[leafField]}
            checkHalfable={checkHalfable}
            children={this.renderNodes(this.getChildIds(nodeId))}
          />
        );
      })
    );
  }

  resolveRelationship(props) {
    let { data, idField, leafField, parentIdField, childrenField, resolveRelationship, useTreeData } = props || this.props;
    if (resolveRelationship != null) return resolveRelationship.call(this, props);
    this._nodeMap = {};
    this._rootIdsList = [];
    this._childIdsMap = {};
    this._parentIdMap = {};
    if (useTreeData) {
      var find = (nodes) => {
        nodes.forEach(node => {
          let nodeId = node[idField];
          if (childrenField in node && node[childrenField].length > 0) {
            if (this._childIdsMap[nodeId] == null) {
              this._childIdsMap[nodeId] = [];
            }
            let childIds = node[childrenField].map(v => v[idField]);
            this._childIdsMap[nodeId] = childIds;
            childIds.forEach(v => {
              this._parentIdMap[v] = nodeId;
            });
            find(node[childrenField]);
            node[leafField] = false;
          } else if (!(childrenField in node)) {
            node[leafField] = true;
          }
          this._nodeMap[nodeId] = node;
        })
      };
      find(data);
      this._rootIdsList = data.map(v => v[idField]);
      return;
    }
    for (let node of data) {
      let nodeId = node[idField];
      let parentId = node[parentIdField];
      this._nodeMap[nodeId] = node;
      if (this._childIdsMap[parentId] == null) {
        this._childIdsMap[parentId] = [];
      }
      this._childIdsMap[parentId].push(nodeId);
      this._parentIdMap[nodeId] = parentId;
    }
    for (let node of data) {
      let nodeId = node[idField];
      let parentId = node[parentIdField];
      if (this._nodeMap[parentId] == null) {
        this._rootIdsList.push(nodeId);
      }
    }
  }
  resolveDefaultExpandedIds() {
    let { idField, defaultExpandAll, defaultExpandedIds } = this.props;
    if (defaultExpandedIds != null) return defaultExpandedIds;
    if (!defaultExpandAll) return [];
    return Object.values(this._nodeMap).map(node => node[idField]).filter(nodeId => this.getChildIds(nodeId).length > 0);
  }

  handleLoadData(node) {
    let nodeId = node.props.id;
    if (this.getChildIds(nodeId).length > 0) return { then: () => {} };  // FIXME
    let { loadData } = this.props;
    return loadData(node.props.id);
  }
  
  getNode(nodeId) {
    return this._nodeMap[nodeId];
  }
  getRootIds() {
    return this._rootIdsList;
  }
  getChildIds(nodeId) {
    return this._childIdsMap[nodeId] || [];
  }
  getParentId(nodeId) {
    return this._parentIdMap[nodeId];
  }

  static defaultFormat(node, tree) {
    let { idField, showField } = tree.props;
    return showField != null ? node[showField] : node[idField];
  }
}

// Tree.propTypes = Object.assign({
//
// }, RcTree.propTypes);

export default Tree;
