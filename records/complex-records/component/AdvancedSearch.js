import React from 'react';
import M from '../../../util';
import Icon from '../../../icon';
import Button from '../../../button';
import Bill from '../../../bill';
import { isObject, isArray, find as _find } from 'lodash-compat';

/**
 * 高级搜索条件
 */
class AdvancedSearch extends M.BaseComponent {
  constructor(props) {
    super(props);
    this.searchData = { ...this.props.searchData } || {};
  }
  render() {
    let { model, billData } = this.props;
    return (
      <div className={this.classNames("advanced-search")}>
        <div className="advanced-search__header">
          <div>高级搜索</div>
          <Icon className="advanced-search__close-icon"
                type="close" domProps={{ onClick: this._close }}/>
        </div>
        <div className="advanced-search__content">
          <Bill ref="bill"
                model={model}
                data={billData}
                onFieldChange={this._onFieldChange} />
        </div>
        <div className="advanced-search__footer">
          <Button className="advanced-search__operation-btn" label="重置" onClick={this._reset} />
          <Button className="advanced-search__operation-btn" type="primary" label="搜索" onClick={this._confirm} />
        </div>
      </div>
    );
  }

  _close() {
    let { onClose } = this.props;
    onClose && onClose();
  }

  _reset() {
    this.refs.bill.reset();
  }

  _confirm() {
    let { onConfirm } = this.props;
    onConfirm && onConfirm(this.searchData);
  }

  _onFieldChange(code, value, bill) {
    // bill.getData()是打平的数据，默认存储的数据
    let model = bill.getFieldModel(code);
    switch(model.type) {
      case 'select':
      case 'treeSelect':
        // 如果value是对象且value.value是假值
        if (isObject(value) && !value.value) {
          value = undefined;
        }
        break;
      case 'rangeDate':
        // 如果开始和结束都不存在且不是至今
        if (!value[0] && !value[1] && !value[2]) {
          value = [];
        }
        break;
      case 'radio':
      case 'checkbox':
        // 封装value
        const range = model.range || model.conf.range || model.conf.model || [];
        if (isArray(value)) {
          value = value.map((item) => {
            return _find(range, { value: item });
          });
        } else {
          value = _find(range, { value });
        }
        break;
    }
    this.searchData[code] = value;
  }
}

export default AdvancedSearch;
