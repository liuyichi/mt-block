import React from 'react';
import M from '../../../util';
import Table from '../../../table';
import { map as _map, property as _property, propertyOf as _propertyOf } from 'lodash-compat';

/**
 * 数据展示区
 */
class DataGrid extends M.BaseComponent.Mixin(M.ContextMixin('records')) {
  render() {
    let { className: baseCls, model, data, loading } = this.props;
    let { records } = this.context;
    let columns = (model.columns || []).filter(c => c.show);
    return (
      <Table {...model}
             columns={columns.length == 0? undefined : columns}
             className={this.classNames()}
             data={data}
             idField={records._getIdField()}
             format={this._format}
             loading={loading} />
    );
  }
  _format() {
    let { model } = this.props;
    let { records } = this.context;
    return (model.format || format).apply(records, arguments);
  }
}

function format(data, model) {
  let { type } = model;
  let value = data[model.code];
  if (model.range && !model.rangeMap) {
    model.rangeMap = M.toObject(model.range, _property('value'), _property('label'));
  }
  if (model.showCode) {
    return data[model.showCode];
  }
  if (model.tpl) {
    return M.template(model.tpl, data);
  }
  if (model.itemTpl) {
    return _map(value, item => M.template(model.itemTpl, item)).join(', ');
  }
  if (type === 'console') {
    return this._renderRowConsole(data, model);
  }
  if (type === 'checkbox') {
    return _map(value, _propertyOf(model.rangeMap)).join(', ');
  }
  if (type === 'radio') {
    return model.rangeMap[value];
  }
  if (type === 'date') {
    return M.formatDatetime(value, model.format || '%Y-%m-%d');
  }
  if (type === 'rangeDate') {
    return _map(value, x => M.formatDatetime(x, model.format || '%Y-%m-%d')).join(' - ');
  }
}

export default DataGrid;
