import React from "react";
import ReactDOM, { findDOMNode } from "react-dom";
import U from '../util';
import Tree from '../tree/Tree';
import Select from '../select/Select';
import Trigger from '../trigger/Trigger';

import { IconPrefixCls, isEmptyString } from '../util/data';
import { getShowData, getServerValue } from '../select/util';

@U.reactExtras
class TreeSelect extends Select {
  constructor(props) {
    super(props);
    if (props.fetchNodeDataAction) {
      console.warn("TreeSelect 组件接受属性 fetchNodeDataAction 请替换成 onFetchNodeData");
    }
    this._treeId = 1;
    let { fillOptions } = this;
    this.fillOptions = (...args) => {
      this._treeId += 1;
      this.state.expandedIds = null;
      return fillOptions(...args);
    };
  }
  render() {
    const props = {...this.props};
    let { prefixCls, triggerClassName, className, size, disabled, style, mode, combobox, multiple, maxLength, showCount,
      getPopupContainer, align,
      notFoundContent, noSearchIfNoKeyword } = props;
    let { visible, valid, explain, showData, loading, searchword, value, allSelect } = this.state;
    prefixCls += '-select' + (multiple ? '-multiple' : '');
    const showTrigger = mode !== 'view' && !disabled;

    const cls = U.classNames({
      [`${prefixCls}`]: true,
      [`${prefixCls}-combobox`]: combobox,
      [`${prefixCls}-sm`]: size === 'small',
      [`${prefixCls}-${mode}`]: mode === 'view',
      [`${prefixCls}-disabled`]: mode !== 'view' && disabled,
      [`${prefixCls}-visible`]: visible,
      [className]: className,
      'has-error': !valid
    });
    const hasData = (showData || []).length > 0;
    if (visible) {
      if (!hasData && (combobox || (!loading && isEmptyString(notFoundContent)))) { // 联想输入框没数据时, 或者 notFoundContent 为空且无数据时, 都不显示下拉窗
        visible = false;
      }
      if (this.searching && isEmptyString(searchword) && noSearchIfNoKeyword) { // noSearchIfNoKeyword 为 true 而关键字为空时不显示下拉窗
        visible = false;
      }
    }

    let countContent;
    if (combobox && mode !== "view" && showCount) { // 联想输入框编辑态实时计数
      value = getShowValue(value);
      let labelLength = value.label.length;
      let showCountCls = combobox && classNames({
          [`${prefixCls}-showCount`]: true,
          [`${prefixCls}-showCount-overCount`]: labelLength > maxLength,
        });
      countContent = <span className={showCountCls}><i>{labelLength}</i>/{maxLength}</span>;
    }
    return (
      <div className={cls} style={style} ref="container">
        {multiple ? this.renderMultiSelect() : this.renderSelect()}
        {countContent}
        {!valid && <span className={`has-explain ${prefixCls}-explain`}>{explain}</span>}
        {showTrigger && <Trigger visible={visible}
                                 className={triggerClassName}
                                 align={align}
                                 ref="trigger"
                                 autoDestory={align ? align.autoDestory : true}
                                 equalTargetWidth={align ? align.equalTargetWidth : true}
                                 getPopupContainer={getPopupContainer}
                                 target={()=>findDOMNode(this)}>
          {this.renderTriggerContent()}
        </Trigger>}
      </div>
    )
  }
  // 渲染弹出框中的内容
  // TODO 文字超长时不折行只省略  并添加 toolTips 来显示全文
  renderTriggerContent() {
    let props = this.props;
    let { prefixCls, model, multiple, combobox, notFoundContent, maxLength, size } = props;
    let { loading, showData, value, data, expandedIds, searchword, fetchErrorMessage } = this.state;
    prefixCls = prefixCls + '-select' + (multiple ? '-multiple' : '');

    const hasData = (showData || []).length > 0;

    const outerCls = U.classNames({
      [`${prefixCls}-dropdown`]: true,
      [`${prefixCls}-dropdown-sm`]: size === 'small',
    });

    if (loading) { // 加载中
       return (
         <div className={outerCls} style={{maxHeight: model.height || 'auto'}}>
           <ul className={outerCls}>
             <li className={`${prefixCls}-loading`}>
               <i className={`${IconPrefixCls} ${IconPrefixCls}-loading`}></i>
             </li>
           </ul>
         </div>
       );
    }
    if (multiple && (value || []).length + 1 > maxLength) { // 超过最大可选条数
      return (
        <div className={outerCls} style={{maxHeight: model.height || 'auto'}}>
          <ul className={outerCls}>
            <li className={`${prefixCls}-outLength`} onClick={this.hideDropdown}>您最多只能选择{maxLength}条</li>
          </ul>
        </div>
      );
    }
    if (!hasData) { // 没有数据
      return (
        <div className={outerCls} style={{maxHeight: model.height || 'auto'}}>
          <ul className={outerCls}>
            <li className={`${prefixCls}-notfound`} onClick={this.hideDropdown}>{fetchErrorMessage || notFoundContent}</li>
          </ul>
        </div>
      );
    }
    return (
      <div className={outerCls} style={{maxHeight: model.height || 'auto'}}>
        {!multiple && (
          <Tree
            key={this._treeId}
            ref="tree"
            data={data}
            defaultExpandAll={true}
            expandedIds={expandedIds}
            onExpand={expandedIds => this.setState({ expandedIds })}
            {...model}
            filterTreeNode={model.filterTreeNode &&
              (treeNode => model.filterTreeNode(treeNode, searchword))}
            checkable={false}
            selectedIds={value ? [value.value] : []}
            loadData={this.handleTreeLoadData}
            onSelect={this.handleTreeSelect}
          />
        )}
        {multiple && (
          <Tree
            key={this._treeId}
            ref="tree"
            data={data}
            defaultExpandAll={true}
            expandedIds={expandedIds}
            onExpand={expandedIds => this.setState({ expandedIds })}
            {...model}
            filterTreeNode={model.filterTreeNode &&
              (treeNode => model.filterTreeNode(treeNode, searchword))}
            multiple={true}
            checkable={true}
            checkStrictly={true}
            checkedIds={(value || []).map(x => x.value)}
            selectedIds={(value || []).map(x => x.value)}
            onCheck={this.handleTreeCheck}
            loadData={this.handleTreeLoadData}
            onSelect={this.handleTreeMultiSelect}
          />
        )}
      </div>
    );
  };
  async handleTreeLoadData(nodeId) {
    let { fetchNodeDataAction, onFetchNodeData } = this.props;
    let { tree } = this.refs;
    let res = await U.promisify(fetchNodeDataAction || onFetchNodeData)(tree.getNode(nodeId));
    // throw 'xxx'; // TODO: 这里异常被静默隐藏了？
    let data = this.state.data.concat(...res);
    await this.setStateAsync({
      data,
      showData: getShowData(data, this.props, this),
    });
  }
  handleTreeSelect([ id ], e) {
    if (this.props.noChangeIfDuplicated && id == null) return;
    let { model, onSelect, onChange } = this.props;
    let { showTpl, showField } = model;
    let node = this.refs.tree.getNode(e.nodeId);
    let value = {
      ...node,
      value: e.nodeId,
      label: showTpl != null ? U.template(showTpl, node) : node[showField],
    };
    let oldsearch = this.state.searchword;
    this.setState({ value, searchword: '' }, () => {
      this.hideDropdown();
      oldsearch && this.clearOption();
      onSelect(node, e);
      onChange(value, e);
    });
  }
  handleTreeMultiSelect(ids, e) {
    let { model, onSelect, onChange, clearSearchwordAfterSelect } = this.props;
    let { tree } = this.refs;
    let { showTpl, showField } = model;
    let valueMap = U.toObject(this.state.value, 'value');
    let value = ids.map(id => {
      let node = tree.getNode(id);
      return node == null ? valueMap[id] : {
        ...tree.getNode(id),
        value: id,
        label: showTpl != null ? U.template(showTpl, node) : node[showField],
      }
    });
    let { searchword } = this.state;
    let oldSearch = searchword;
    ReactDOM.findDOMNode(this.refs.input).style.width = 50 + 'px'; // 在显示新选项时 先将input的宽度调小 避免trigger定位不准
    this._rememberSelectionHeight();
    clearSearchwordAfterSelect && (searchword = "");
    this.setState({ value, searchword }, () => {
      this.calculateNodeWidth();
      if (clearSearchwordAfterSelect && oldSearch) {
        this._fetchDataHandle();
      }
      onSelect(tree.getNode(e.nodeId), e);
      onChange(value, e);
      this.focusInput();
    });
  }
  handleTreeCheck(ids, e) {
    this.handleTreeMultiSelect(ids, e);
  }
}

export default TreeSelect;
