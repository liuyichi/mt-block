import React from 'react';
import { findDOMNode } from 'react-dom';
import M from '../../../../util';
import Select from '../../../../select';
import Button from '../../../../button';
import TreeSelect from '../../../../tree-select';

import './index.scss';

class MultiSelectDropdown extends M.BaseComponent {
  constructor(props) {
    super(props);
    Object.assign(this.state, {
      value: props.value && props.value.slice() || [],
    });
  }
  componentDidMount() {
    //FIXME 直接调用会使得页面滚动到顶部
    this.setTimeout(() => {
      this.refs.select.focusInput();
    }, 0);
  }
  render() {
    let baseCls = `multi-select-dropdown`;
    let { selectProps, type } = this.props;
    let { value } = this.state;
    let SelectComponent;
    switch (type) {
      case 'multiSelect':
        SelectComponent = Select;
        break;
      case 'treeMultiSelect':
        SelectComponent = TreeSelect;
        break;
    }
    return (
      <div className={baseCls}>
        <div ref="selectWrapper" className={`${baseCls}__select-wrapper`}>
          {SelectComponent && (
            <SelectComponent ref="select"
                             {...selectProps}
                             className={`${baseCls}__select`}
                             triggerClassName={`${baseCls}__trigger`}
                             getPopupContainer={() => findDOMNode(this.refs.selectWrapper)}
                             multiple={true}
                             value={value}
                             onChange={this._onChange}
                             onSelect={this._onSelect} />
          )}
        </div>
        <div className={`${baseCls}__operation`}>
          <Button className={`${baseCls}__btn`}
                  type="default"
                  size="xsmall"
                  label="取消"
                  onClick={this._cancel} />
          <Button className={`${baseCls}__btn`}
                  type="primary"
                  size="xsmall"
                  label="确定"
                  onClick={this._confirm} />
        </div>
      </div>
    );
  }
  _onChange(value) {
    this.setState({ value });
  }
  _cancel() {
    let { onCancel } = this.props;
    onCancel && onCancel(this.state.value);
  }
  _confirm() {
    let { onConfirm } = this.props;
    onConfirm && onConfirm(this.state.value);
  }
  _onSelect(v, e) {
    // FIXME 现象：设置了select的选中后清空关键字时，当输入关键字搜索并选中某项时，
    // 造成关键字被清空，触发了再次搜索，之前的选项被移出了DOM结构，触发了关闭表头筛选框
    // 这里处理为阻止冒泡来避免上述问题
    e.stopPropagation();
  }
}

export default MultiSelectDropdown;
