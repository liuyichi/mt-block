
import React from 'react';
import M from '../util';
import _ from 'lodash-compat';
import { Bill } from '../bill';
import { Console } from '../console';
import { Table } from '../table';

@M.reactExtras
class Records extends M.BaseComponent.Mixin(
  M.ContextMixin.ChildGetter({
    // 使子组件可以通过 context.records 访问到所属 Records 的实例
    records: function () { return this; },
  })
) {
  static defaultProps = {
    model: undefined,
    fetchData: undefined,
  };
  constructor(props) {
    super(props);
    Object.assign(this.state, {
      data: null,  // 当前数据
      dataAmount: 0,  // 数据总条数，主要用于展示分页
      page: 1,  // 当前页码
      pageSize: props.model.pageSize || this.defaultPageSize,  // 每页数据条数
      filter: {},  // 搜索条件
      selection: [],  // 已选中数据项的标识
      loading: false,  // 是否正在加载数据
    });
  }
  componentDidMount() {
    let { model } = this.props;
    if (model.initialSearch !== false) {
      this.search();
    }
  }
  componentWillReceiveProps(nextProps) {
    let { pageSize } = nextProps.model;
    // pageSize 有两个来源（model 里和从界面上选），这里认为更晚变化的来源有效
    if (pageSize != this.props.model.pageSize) {
      this.setState({ pageSize: pageSize || this.defaultPageSize });
    }
  }
  /**
   * render 方法在继承时被重写的可能性较高，所以这里的实现尽量保持简短
   */
  render() {
    let { model } = this.props;
    return (
      <div className={this.classNames('mt-records')}>
        <Records.FilterBill model={model.search} />
        <Records.Console model={model.console} data={this.getSelection()} />
        <Records.DataGrid model={model.grid} />
      </div>
    );
  }
  /**
   * 渲染一行数据的操作面板
   */
  renderRowConsole(data, model) {
    let buttons = model.buttons || this.props.model.console.buttons;
    return (
      <Records.Console model={{ buttons }} data={[data]} inRow />
    );
  }
  /**
   * 获取数据标识的字段名
   * @returns {string}
   */
  getIdField() {
    let { model } = this.props;
    return model.idField || model.grid.idField;  // 后者用于兼容历史用法
  }
  /**
   * 获取已选中数据项的完整对象列表，不包括在当前数据中不存在的条目
   * @returns {Array<Object>}
   */
  getSelection() {
    let { data, selection } = this.state;
    let dataById = M.toObject(data, this.getIdField());
    return selection.map(i => dataById[i]).filter(Boolean);
  }
  /**
   * 设置搜索条件，新的条件会被合并（Object.assign）进现有条件
   */
  async setFilter(nextFilter) {
    await this.setStateAsync(state => ({ filter: { ...state.filter, ...nextFilter } }));
  }
  /**
   * 设置分页条件，置空参数将被忽略
   * 比如 setPagination(2) 只设置当前页码为 2，setPagination(undefined, 10) 只设置分页大小为 10
   */
  async setPagination(page, pageSize) {
    await this.setStateAsync(_.pick({ page, pageSize }, Boolean));
    await this.fetchData();
  }
  /**
   * 根据当前搜索条件和分页条件重新获取并设置数据
   */
  async fetchData() {
    let { fetchData } = this.props;
    let { filter, page: pageNo, pageSize } = this.state;
    let page = { pageNo, pageSize };
    let condition = { ...filter, page };
    this.setState({ loading: true });
    try {
      var res = await fetchData(condition);
    } finally {
      this.setState({ loading: false });
    }
    await this.setStateAsync({
      data: res.pageList || [],
      dataAmount: _.get(res, 'page.totalCount', 0),
    });
  }
  /**
   * 根据新的条件重新进行搜索，搜索时当前页码会被置为 1
   * @param filter 新的搜索条件，会与现有条件合并
   */
  async search(filter) {
    await this.setStateAsync({ page: 1 });
    filter && await this.setFilter(filter);
    await this.fetchData();
  }
  /**
   * 重置搜索条件，然后进行搜索
   * Records 本身没有对“默认搜索条件”的支持，重置后会置空还是会置回默认值依赖于搜索子组件的实现
   */
  async reset() {
    await this.search(_.mapValues(this.state.filter, _.constant(undefined)));
  }
  /**
   * 操作时触发的事件，一般会在操作面板中的按钮被点击时调用
   * @param data 操作关联的数据
   * @param model 操作按钮的配置
   * @param args
   */
  async action(data, model, ...args) {
    let action = model.action || this.defaultActions[model.code];
    if (action == null) return null;
    data.ids = () => data.map(_.property(this.getIdField()));
    await action(this, data, model, ...args);
  }
  /**
   * 默认操作
   */
  defaultActions = {
    search: records => records.search(),
    reset: records => records.reset(),
  };
  /**
   * 分页大小
   */
  defaultPageSize = 20;
}

/**
 * Records 子组件的基类，目前只是读取了 context 中的 records 属性
 */
@M.reactExtras
class RecordsComponent extends M.BaseComponent.Mixin(M.ContextMixin('records')) { }
Records.Component = RecordsComponent;

@M.reactExtras
class RecordsFilterBill extends Records.Component {
  render() {
    // 未配置搜索面板时，仍然渲染了 Bill 组件是为了回避一些访问 refs.bill 出错的情况
    if (this.props.model == null) return <Bill ref="bill" notice={false} />;
    let { fields, initData, elementFactory, dataFactory, actionFactory,
          fieldAction, onFieldChange, ...modelExtras } = this.props.model;
    return (
      <Bill
        ref="bill"
        noDataChanged={true}
        className={this.classNames('mt-records_filter-bill')}
        initModel={{ forms: [{ fields }], ...modelExtras }}
        initData={initData}
        elementFactory={elementFactory}
        dataFactory={dataFactory}
        actionFactory={actionFactory}
        notice={false}
        fieldAction={fieldAction}
        onFieldChange={onFieldChange}
      />
    );
  }
  componentWillMount() {
    let { records } = this.context;
    records.decorate('setFilter', orig => async (...args) => {
      await orig(...args);
      await M.promisify(this.refs.bill.setData)(records.state.filter);
    });
    records.decorate('search', orig => async (...args) => {
      let { bill } = this.refs;
      if (!bill.validate()) return null;
      await records.setFilter(bill.getData());
      await orig(...args);
    });
    records.decorate('reset', orig => async (...args) => {
      let { bill } = this.refs;
      bill.reset();
      await records.setStateAsync({ filter: {} });
      await records.search();
    });
  }
  componentDidMount() {
    let { records } = this.context;
    records.bill = this.refs.bill;
  }
}
Records.FilterBill = RecordsFilterBill;

@M.reactExtras
class RecordsConsole extends Records.Component {
  render() {
    let { model, data, inRow } = this.props;
    let { records } = this.context;
    if (model == null) return null;
    let Console_ = this.props.Console || records.props.Console || records.Console || Console;
    model = { ...model, buttons: model.buttons.filter(b => b.hideIn != (inRow ? 'row' : 'main')) };
    return (
      <Console_
        {...this.props}
        {...model}
        className={this.classNames('mt-records_' + (inRow ? 'row-console' : 'console'))}
        data={data}
        action={records.action}
      />
    );
  }
}
Records.Console = RecordsConsole;

@M.reactExtras
class RecordsDataGrid extends Records.Component {
  render() {
    let { model } = this.props;
    let { records } = this.context;
    let { data, dataAmount, page, pageSize, selection, loading } = records.state;
    return (
      <Table
        {...model}
        className={this.classNames('mt-records_data-grid')}
        data={data}
        idField={records.getIdField()}
        format={this.format}
        pagination={model.pagination !== false && {
          ...model.pagination,
          current: page,
          total: dataAmount,
          pageSize: pageSize,
          onChange: records.setPagination,
          onShowSizeChange: records.setPagination,
        }}
        rowSelection={model.rowSelection === false ? undefined : {
          ...props.rowSelection,
          // ...model.rowSelection,
          // selectedRowKeys: selection,
          // onChange: selection => records.setState({ selection }),
        }}
        loading={loading}
      />
    );
  }
  format() {
    let { model } = this.props;
    let { records } = this.context;
    return (model.format || format).apply(records, arguments);
  }
}
Records.DataGrid = RecordsDataGrid;

function format(data, model) {
  let { type } = model;
  let value = data[model.code];
  if (model.range && !model.rangeMap) {
    model.rangeMap = M.toObject(model.range, _.property('value'), _.property('label'));
  }
  if (model.showCode) {
    return data[model.showCode];
  }
  if (model.tpl) {
    return M.template(model.tpl, data);
  }
  if (model.itemTpl) {
    return _.map(value, item => M.template(model.itemTpl, item)).join(', ');
  }
  if (type === 'console') {
    return this.renderRowConsole(data, model);
  }
  if (type === 'checkbox') {
    return _.map(value, _.propertyOf(model.rangeMap)).join(', ');
  }
  if (type === 'radio') {
    return model.rangeMap[value];
  }
  if (type === 'date') {
    return M.formatDatetime(value, model.format || '%Y-%m-%d');
  }
  if (type === 'rangeDate') {
    return _.map(value, x => M.formatDatetime(x, model.format || '%Y-%m-%d')).join(' - ');
  }
}
Records.format = format;

export default Records;
