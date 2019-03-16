import React from 'react';
import M from '../../../util';
import Icon from '../../../icon';
import { isArray, isObject } from 'lodash-compat';

/**
 * 搜索条件展示区
 */
class SearchCondition extends M.BaseComponent.Mixin(
  M.ContextMixin('records')
) {
  render() {
    const { className: baseCls } = this.props;
    const { records } = this.context;
    const condition = records._getCondition();
    const searchFields = records._getSearchFieldsMap();
    return (
      <div className={this.classNames()}>
        <ul className={`${baseCls}__list`}>
          {condition.map((v, k) => {
            const showContent = this._format(searchFields[k], v);
            return (
              <li key={k} className={`${baseCls}__list-item`}
                  onClick={this._onDelete.bind(this, k)}>
                <span className={`${baseCls}__item-text`} title={showContent}>
                  {showContent}
                </span>
                <Icon className={`${baseCls}__delete-icon`} type="close" />
              </li>
            );
          }).toArray()}
          {condition.size > 0 && (
            <li key="clearAll" className={`${baseCls}__clear-all`}
                onClick={this._onDeleteAll}>
              取消筛选
            </li>
          )}
        </ul>
      </div>
    );
  }
  _onDelete(key) {
    const { records } = this.context;
    records._setCondition({ [key]: undefined });
  }
  _onDeleteAll() {
    const { records } = this.context;
    records.reset();
  }
  _format(field, v) {
    const format = field.conf && field.conf.format || '%Y-%m-%d';
    let content;
    switch(field.type) {
      case 'date':
        content = M.formatDatetime(v, format);
        break;
      case 'rangeDate':
        if (isArray(v)) {
          content = M.formatDatetime(v[0], format);
          content += ' ~ ';
          if (v[2]) {
            content += '至今';
          } else if (v[1]) {
            content += M.formatDatetime(v[1], format);
          }
        }
        break;
      default:
        if (isArray(v)) {
          content = (v || []).map(item => isObject(item)? item.label : item);
        } else {
          content = [isObject(v)? v.label : v];
        }
        content = content.join('/');
    }
    return `${field.label}：${content}`;
  }
}

export default SearchCondition;
