import React, { Component, PropTypes } from 'react';
import RcTable from './rc-table-4.6.0/index';
import Checkbox from '../checkbox';
import Radio from '../radio';
import FilterDropdown from './FilterDropdown';
import Pagination from '../pagination';
import Select from '../select';
import Spin from '../spin';
import Icon from '../icon';
import classNames from 'classnames';
import { flatArray, treeMap, getValidColumns, isMultiTh } from './util';
import { IconPrefixCls, stopPropagationEvent, noop } from '../util/data';
import M from '../util';

const assign = Object.assign;

const defaultLocale = {
  filterTitle: '筛选',
  filterConfirm: '确定',
  filterReset: '重置',
  emptyText: <span><Icon type="frown"/>暂无数据</span>,
};

const defaultPagination = {
  onChange: noop,
  onShowSizeChange: noop,
};


let TableRowSelection;
let TableColumnConfig;

if (PropTypes) {
  TableRowSelection = PropTypes.shape({
    type: PropTypes.oneOf(['checkbox', 'radio']),
    //selectedRowKeys: PropTypes.string,
    onChange: PropTypes.func,
    getCheckboxProps: PropTypes.func,
    onSelect: PropTypes.func,
    onSelectAll: PropTypes.func,
  });
  TableColumnConfig = PropTypes.shape({
    title: PropTypes.oneOfType[PropTypes.string, PropTypes.node],
    key: PropTypes.string,
    dataIndex: PropTypes.string,
    render: PropTypes.func,
    filters: PropTypes.array,
    onFilter: PropTypes.func,
    filterMultiple: PropTypes.bool,
    filterDropdown: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    filterPopupContainer: PropTypes.func,
    sorter: PropTypes.oneOfType[
      PropTypes.bool,
        PropTypes.func
      ],
    colSpan: PropTypes.number,
    width: PropTypes.oneOfType[
      PropTypes.string,
        PropTypes.number
      ],
    className: PropTypes.string,
    fixed: PropTypes.oneOfType[
      PropTypes.bool,
        PropTypes.oneOf(['left', 'right'])
      ],
    filteredValue: PropTypes.any,
    sortOrder: PropTypes.oneOfType[
      PropTypes.bool,
        PropTypes.oneOf(['ascend', 'descend'])
      ],
  })
}

class AntTable extends Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    rowSelection: PropTypes.oneOfType([
      PropTypes.bool,
      TableRowSelection
    ]),
    pagination: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object
    ]),
    size: PropTypes.oneOf(['small', 'default']),
    dataSource: PropTypes.arrayOf(PropTypes.object),
    columns: PropTypes.array.isRequired,
    rowKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ]),
    rowClassName: PropTypes.func,
    expandedRowRender: PropTypes.any,
    defaultExpandedRowKeys: PropTypes.arrayOf(PropTypes.string),
    expandedRowKeys: PropTypes.arrayOf(PropTypes.string),
    expandIconAsCell: PropTypes.bool,
    onChange: PropTypes.func,
    loading: PropTypes.bool,
    locale: PropTypes.object,
    indentSize: PropTypes.number,
    onRowClick: PropTypes.func,
    useFixedHeader: PropTypes.bool,
    bordered: PropTypes.bool,
    showHeader: PropTypes.bool,
    hidePaginationIfOnePage: PropTypes.bool,
    zebra: PropTypes.bool,
    footer: PropTypes.node,
    title: PropTypes.node,
    scroll: PropTypes.shape({
      x: PropTypes.oneOfType([PropTypes.number, PropTypes.bool, PropTypes.string]),
      y: PropTypes.oneOfType([PropTypes.number, PropTypes.bool, PropTypes.string]),
    }),
    childrenColumnName: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    dataSource: [],
    prefixCls: 'mt',
    useFixedHeader: false,
    rowSelection: null,
    className: '',
    size: 'default',
    loading: false,
    bordered: false,
    indentSize: 20,
    onChange: noop,
    onSortOrderChange: noop,
    locale: {},
    rowKey: 'key',
    zebra: false,
    hidePaginationIfOnePage: false,
    childrenColumnName: 'children',
  };

  constructor(props) {
    super(props);

    const pagination = props.pagination || {};

    this.columns = getValidColumns(props);
    this.state = assign({}, this.getSortStateFromColumns(), {
      // 减少状态
      selectedRowKeys: (props.rowSelection || {}).selectedRowKeys || [],
      filters: this.getFiltersFromColumns(),
      selectionDirty: false,
      pagination: this.hasPagination() ?
        assign({}, defaultPagination, pagination, {
          current: pagination.defaultCurrent || pagination.current || 1,
          pageSize: pagination.defaultPageSize || pagination.pageSize || 10,
        }) : {},
    });
  }

  getCheckboxPropsByItem(item) {
    const { rowSelection = {} } = this.props;
    if (!rowSelection.getCheckboxProps) {
      return {};
    }
    return rowSelection.getCheckboxProps(item);
  }

  getDefaultSelection() {
    const { rowSelection = {} } = this.props;
    if (!rowSelection.getCheckboxProps) {
      return [];
    }
    return this.getFlatData()
      .filter(item => this.getCheckboxPropsByItem(item).defaultChecked)
      .map((record, rowIndex) => this.getRecordKey(record, rowIndex));
  }

  getLocale() {
    let locale = {};
    if (this.context.antLocale && this.context.antLocale.Table) {
      locale = this.context.antLocale.Table;
    }
    return assign({}, defaultLocale, locale, this.props.locale);
  }

  componentWillReceiveProps(nextProps) {
    if (('pagination' in nextProps) && nextProps.pagination !== false) {
      this.setState(previousState => {
        const newPagination = assign({}, defaultPagination, previousState.pagination, nextProps.pagination);
        newPagination.current = newPagination.current || 1;
        return {pagination: newPagination};
      });
    }
    // dataSource 的变化会清空选中项
    if ('dataSource' in nextProps &&
      nextProps.dataSource !== this.props.dataSource) {
      this.setState({
        selectionDirty: false,
      });
    }
    if (nextProps.rowSelection &&
      'selectedRowKeys' in nextProps.rowSelection) {
      this.setState({
        selectedRowKeys: nextProps.rowSelection.selectedRowKeys || [],
      });
      const { rowSelection } = this.props;
      if (rowSelection && (
          nextProps.rowSelection.getCheckboxProps !== rowSelection.getCheckboxProps
        )) {
      }
    }
    this.columns = getValidColumns(nextProps);
    if (this.getSortOrderColumns(this.columns).length > 0) {
      const sortState = this.getSortStateFromColumns(this.columns);
      if (sortState.sortColumn !== this.state.sortColumn ||
        sortState.sortOrder !== this.state.sortOrder) {
        this.setState(sortState);
      }
    }

    const filteredValueColumns = this.getFilteredValueColumns(this.columns);
    if (filteredValueColumns.length > 0) {
      const filtersFromColumns = this.getFiltersFromColumns(this.columns);
      const newFilters = assign({}, this.state.filters);
      Object.keys(filtersFromColumns).forEach(key => {
        newFilters[key] = filtersFromColumns[key];
      });
      if (this.isFiltersChanged(newFilters)) {
        this.setState({filters: newFilters});
      }
    }
  }

  setSelectedRowKeys(selectedRowKeys, { selectWay, record, checked, changeRowKeys }) {
    const { rowSelection = {} } = this.props;
    if (rowSelection && !('selectedRowKeys' in rowSelection)) {
      this.setState({selectedRowKeys});
    }
    const data = this.getFlatData();
    if (!rowSelection.onChange && !rowSelection[selectWay]) {
      return;
    }
    const selectedRows = data.filter(
      (row, i) => selectedRowKeys.indexOf(this.getRecordKey(row, i)) >= 0
    );
    if (rowSelection.onChange) {
      rowSelection.onChange(selectedRowKeys, selectedRows);
    }
    if (selectWay === 'onSelect' && rowSelection.onSelect) {
      rowSelection.onSelect(record, checked, selectedRows);
    } else if (selectWay === 'onSelectAll' && rowSelection.onSelectAll) {
      const changeRows = data.filter(
        (row, i) => changeRowKeys.indexOf(this.getRecordKey(row, i)) >= 0
      );
      rowSelection.onSelectAll(checked, selectedRows, changeRows);
    }
  }

  hasPagination() {
    return this.props.pagination !== false;
  }

  isFiltersChanged(filters) {
    let filtersChanged = false;
    if (Object.keys(filters).length !== Object.keys(this.state.filters).length) {
      filtersChanged = true;
    } else {
      Object.keys(filters).forEach(columnKey => {
        if (filters[columnKey] !== this.state.filters[columnKey]) {
          filtersChanged = true;
        }
      });
    }
    return filtersChanged;
  }

  getSortOrderColumns(columns) {
    return (columns || this.columns || []).filter(column => 'sortOrder' in column);
  }

  getFilteredValueColumns(columns) {
    return (columns || this.columns || []).filter(column => column.filteredValue);
  }

  getFiltersFromColumns(columns) {
    let filters = {};
    this.getFilteredValueColumns(columns).forEach(col => {
      filters[this.getColumnKey(col)] = col.filteredValue;
    });
    return filters;
  }

  getSortStateFromColumns(columns) {
    // return fisrt column which sortOrder is not falsy
    const sortedColumn =
      this.getSortOrderColumns(columns).filter(col => col.sortOrder)[0];
    if (sortedColumn) {
      return {
        sortColumn: sortedColumn,
        sortOrder: sortedColumn.sortOrder,
      };
    }
    return {
      sortColumn: null,
      sortOrder: null,
    };
  }

  getSorterFn() {
    const { sortOrder, sortColumn } = this.state;
    if (!sortOrder || !sortColumn ||
      typeof sortColumn.sorter !== 'function') {
      return;
    }
    return (a, b) => {
      const result = sortColumn.sorter(a, b);
      if (result !== 0) {
        return (sortOrder === 'descend') ? -result : result;
      }
      return 0;
    };
  }

  toggleSortOrder(order, column) {
    let { sortColumn, sortOrder } = this.state;
    // 只同时允许一列进行排序，否则会导致排序顺序的逻辑问题
    let isSortColumn = this.isSortColumn(column);
    if (!isSortColumn) {  // 当前列未排序
      sortOrder = order;
      sortColumn = column;
    } else {                      // 当前列已排序
      if (sortOrder === order) {  // 切换为未排序状态
        sortOrder = '';
        sortColumn = null;
      } else {                    // 切换为排序状态
        sortOrder = order;
      }
    }
    const newState = {
      sortOrder,
      sortColumn,
    };

    // Controlled
    if (this.getSortOrderColumns().length === 0) {
      this.setState(newState);
    }

    this.props.onSortOrderChange(order, column);
    this.props.onChange.apply(null, this.prepareParamsArguments(assign({}, this.state, newState)));
  }

  handleFilter = (column, nextFilters) => {
    const props = this.props;
    let pagination = assign({}, this.state.pagination);
    const filters = assign({}, this.state.filters, {
      [this.getColumnKey(column)]: nextFilters,
    });
    // Remove filters not in current columns
    const currentColumnKeys = this.columns.map(c => this.getColumnKey(c));
    Object.keys(filters).forEach((columnKey) => {
      if (currentColumnKeys.indexOf(columnKey) < 0) {
        delete filters[columnKey];
      }
    });

    if (props.pagination) {
      // Reset current prop
      pagination.current = 1;
      pagination.onChange(pagination.current);
    }

    const newState = {
      selectionDirty: false,
      pagination,
      filters: {},
    };
    const filtersToSetState = assign({}, filters);
    // Remove filters which is controlled
    this.getFilteredValueColumns().forEach(col => {
      const columnKey = this.getColumnKey(col);
      if (columnKey) {
        delete filtersToSetState[columnKey];
      }
    });
    if (Object.keys(filtersToSetState).length > 0) {
      newState.filters = filtersToSetState;
    }
    // Controlled current prop will not respond user interaction
    if (props.pagination && 'current' in props.pagination) {
      newState.pagination = assign({}, pagination, {
        current: this.state.pagination.current,
      });
    }

    this.setState(newState, () => {
      props.onChange.apply(null, this.prepareParamsArguments(assign({}, this.state, {
        selectionDirty: false,
        filters,
        pagination,
      })));
    });
  }

  handleSelect = (record, rowIndex, e) => {
    const checked = e.target.checked;
    const defaultSelection = this.state.selectionDirty ? [] : this.getDefaultSelection();
    let selectedRowKeys = this.state.selectedRowKeys.concat(defaultSelection);
    let key = this.getRecordKey(record, rowIndex);
    if (checked) {
      selectedRowKeys.push(this.getRecordKey(record, rowIndex));
    } else {
      selectedRowKeys = selectedRowKeys.filter((i) => key !== i);
    }
    this.setState({
      selectionDirty: true,
    });
    this.setSelectedRowKeys(selectedRowKeys, {
      selectWay: 'onSelect',
      record,
      checked,
    });
  }

  handleRadioSelect = (record, rowIndex, checked, e) => {
    const defaultSelection = this.state.selectionDirty ? [] : this.getDefaultSelection();
    let selectedRowKeys = this.state.selectedRowKeys.concat(defaultSelection);
    let key = this.getRecordKey(record, rowIndex);
    selectedRowKeys = [key];
    this.setState({
      selectionDirty: true,
    });
    this.setSelectedRowKeys(selectedRowKeys, {
      selectWay: 'onSelect',
      record,
      checked,
    });
  }

  handleSelectAllRow = (e) => {
    const checked = e.target.checked;
    const data = this.getFlatCurrentPageData();
    const defaultSelection = this.state.selectionDirty ? [] : this.getDefaultSelection();
    const selectedRowKeys = this.state.selectedRowKeys.concat(defaultSelection);
    const changableRowKeys = data
      .filter(item => !this.getCheckboxPropsByItem(item).disabled)
      .map((item, i) => this.getRecordKey(item, i));

    // 记录变化的列
    const changeRowKeys = [];
    if (checked) {
      changableRowKeys.forEach(key => {
        if (selectedRowKeys.indexOf(key) < 0) {
          selectedRowKeys.push(key);
          changeRowKeys.push(key);
        }
      });
    } else {
      changableRowKeys.forEach(key => {
        if (selectedRowKeys.indexOf(key) >= 0) {
          selectedRowKeys.splice(selectedRowKeys.indexOf(key), 1);
          changeRowKeys.push(key);
        }
      });
    }
    this.setState({
      selectionDirty: true,
    });
    this.setSelectedRowKeys(selectedRowKeys, {
      selectWay: 'onSelectAll',
      checked,
      changeRowKeys,
    });
  }

  handlePageChange = (current) => {
    const props = this.props;
    let pagination = assign({}, this.state.pagination);
    if (current) {
      pagination.current = current;
    } else {
      pagination.current = pagination.current || 1;
    }
    pagination.onChange(pagination.current);

    const newState = {
      selectionDirty: false,
      pagination,
    };
    // Controlled current prop will not respond user interaction
    if (props.pagination && 'current' in props.pagination) {
      newState.pagination = assign({}, pagination, {
        current: this.state.pagination.current,
      });
    }
    this.setState(newState);

    this.props.onChange.apply(null, this.prepareParamsArguments(assign({}, this.state, {
      selectionDirty: false,
      pagination,
    })));
  }

  renderSelectionRadio = (value, record, index) => {
    let rowIndex = this.getRecordKey(record, index); // 从 1 开始
    const props = this.getCheckboxPropsByItem(record);
    let checked;
    if (this.state.selectionDirty) {
      checked = this.state.selectedRowKeys.indexOf(rowIndex) >= 0;
    } else {
      checked = (this.state.selectedRowKeys.indexOf(rowIndex) >= 0 ||
      this.getDefaultSelection().indexOf(rowIndex) >= 0);
    }
    checked = checked || props.checked;
    return (
      <span onClick={stopPropagationEvent}>
        <Radio disabled={props.disabled}
               onChange={(checked, e) => this.handleRadioSelect(record, rowIndex, checked, e)}
               value={rowIndex} checked={checked}
        />
      </span>
    );
  }

  renderSelectionCheckBox = (value, record, index) => {
    let rowIndex = this.getRecordKey(record, index); // 从 1 开始
    const props = this.getCheckboxPropsByItem(record);
    let checked;
    if (this.state.selectionDirty) {
      checked = this.state.selectedRowKeys.indexOf(rowIndex) >= 0;
    } else {
      checked = (this.state.selectedRowKeys.indexOf(rowIndex) >= 0 ||
      this.getDefaultSelection().indexOf(rowIndex) >= 0);
    }
    checked = checked || props.checked;
    return (
      <span onClick={stopPropagationEvent}>
        <Checkbox
          checked={checked}
          disabled={props.disabled}
          onChange={(e) => this.handleSelect(record, rowIndex, e)}
        />
      </span>
    );
  };

  getRecordKey(record, index) {
    const rowKey = this.props.rowKey;
    if (typeof rowKey === 'function') {
      return rowKey(record, index);
    }
    return record[rowKey] || index;
  }

  renderRowSelection() {
    const columns = this.columns.concat();
    if (this.props.rowSelection) {
      const prefixCls = this.props.prefixCls + '-table';
      const allData = this.getFlatCurrentPageData();
      const data = this.getFlatCurrentPageData().filter((item) => {
        if (this.props.rowSelection.getCheckboxProps) {
          return !this.getCheckboxPropsByItem(item).disabled;
        }
        return true;
      });
      let checked;
      if (!data.length) {
        checked = false;
      } else {
        checked = this.state.selectionDirty
          ? data.every((item, i) =>
        this.state.selectedRowKeys.indexOf(this.getRecordKey(item, i)) >= 0)
          : (
          data.every((item, i) =>
          this.state.selectedRowKeys.indexOf(this.getRecordKey(item, i)) >= 0) ||
          data.every(item => this.getCheckboxPropsByItem(item).defaultChecked)
        );
      }
      if (allData.length > 0) {
        checked = checked || allData.every(item => this.getCheckboxPropsByItem(item).checked);
      }
      let selectionColumn;
      if (this.props.rowSelection.type === 'radio') {
        selectionColumn = {
          key: 'selection-column',
          render: this.renderSelectionRadio,
          className: `${prefixCls}-selection-column`,
        };
      } else {
        const checkboxAllDisabled = data.every(item => this.getCheckboxPropsByItem(item).disabled);
        const checkboxAll = (
          <Checkbox checked={checked}
                    disabled={checkboxAllDisabled}
                    onChange={this.handleSelectAllRow}
          />
        );
        selectionColumn = {
          key: 'selection-column',
          title: checkboxAll,
          render: this.renderSelectionCheckBox,
          className: `${prefixCls}-selection-column`,
        };
      }
      if (columns.some(column => column.fixed === 'left' || column.fixed === true)) {
        selectionColumn.fixed = 'left';
      }
      if (columns[0] && columns[0].key === 'selection-column') {
        columns[0] = selectionColumn;
      } else {
        columns.unshift(selectionColumn);
      }
    }
    return columns;
  }

  getColumnKey(column, index) {
    return column.key || column.dataIndex || index;
  }

  getMaxCurrent(total) {
    const { current, pageSize } = this.state.pagination;
    if ((current - 1) * pageSize >= total) {
      return current - 1;
    }
    return current;
  }

  isSortColumn(column) {
    const { sortColumn } = this.state;
    if (!column || !sortColumn) {
      return false;
    }
    return this.getColumnKey(sortColumn) === this.getColumnKey(column);
  }

  renderColumnsDropdown(columns) {
    const locale = this.getLocale();
    return treeMap(columns, (originColumn, i) => {
      let column = assign({}, originColumn);
      const sortOrder = column.sortOrder || this.state.sortOrder;
      let key = this.getColumnKey(column, i);
      let filterDropdown;
      let sortButton;
      const prefixCls = this.props.prefixCls + '-table';
      if ((column.filters && column.filters.length > 0) || column.filterDropdown) {
        let colFilters = this.state.filters[key] || [];
        filterDropdown = (
          <FilterDropdown
            locale={locale}
            column={column}
            getPopupContainer={column.filterPopupContainer}
            selectedKeys={colFilters}
            confirmFilter={this.handleFilter}
            prefixCls={prefixCls}
          />
        );
      }
      if (column.sorter) {
        let isSortColumn = column.sortOrder || this.isSortColumn(column);
        if (isSortColumn) {
          column.className = column.className || '';
          if (sortOrder) {
            column.className += ` ${prefixCls}-column-sort`;
          }
        }
        const isAscend = isSortColumn && sortOrder === 'ascend';
        const isDescend = isSortColumn && sortOrder === 'descend';
        sortButton = (
          <div className={`${prefixCls}-column-sorter`}>
            <span className={`${prefixCls}-column-sorter-up ${isAscend ? 'on' : 'off'}`}
                  title="↑"
                  onClick={() => this.toggleSortOrder('ascend', column)}
            >
              <Icon type="caret-up"/>
            </span>
            <span className={`${prefixCls}-column-sorter-down ${isDescend ? 'on' : 'off'}`}
                  title="↓"
                  onClick={() => this.toggleSortOrder('descend', column)}
            >
              <Icon type="caret-down"/>
            </span>
          </div>
        );
      }
      column.title = (
        <span>
          {column.title}
          {sortButton}
          {filterDropdown}
        </span>
      );
      return column;
    });
  }

  handleShowSizeChange = (current, pageSize) => {
    const pagination = this.state.pagination;
    pagination.onShowSizeChange(current, pageSize);
    const nextPagination = assign({}, pagination, {pageSize, current});
    this.setState({pagination: nextPagination});
    this.props.onChange.apply(null, this.prepareParamsArguments(assign({}, this.state, {
      pagination: nextPagination,
    })));
  }

  renderPagination() {
    // 强制不需要分页
    if (!this.hasPagination()) {
      return null;
    }
    let size = 'default';
    const { pagination } = this.state;
    if (pagination.size) {
      size = pagination.size;
    } else if (this.props.size === 'middle' || this.props.size === 'small') {
      size = 'small';
    }
    let total = pagination.total || this.getLocalData().length;
    if (total <= 0 || this.props.hidePaginationIfOnePage && total <= pagination.pageSize) {
      return null;
    }
    return <Pagination
      {...pagination}
      selectComponentClass={pagination.selectComponentClass || Select}
      className={`${this.props.prefixCls}-table-pagination`}
      onChange={this.handlePageChange}
      total={total}
      size={size}
      current={this.getMaxCurrent(total)}
      onShowSizeChange={this.handleShowSizeChange}
    />;
  }

  prepareParamsArguments(state) {
    // 准备筛选、排序、分页的参数
    const pagination = state.pagination;
    const filters = state.filters;
    const sorter = {};
    if (state.sortColumn && state.sortOrder) {
      sorter.column = state.sortColumn;
      sorter.order = state.sortOrder;
      sorter.field = state.sortColumn.dataIndex;
      sorter.columnKey = this.getColumnKey(state.sortColumn);
    }
    return [pagination, filters, sorter];
  }

  findColumn(myKey) {
    return this.columns.filter(c => this.getColumnKey(c) === myKey)[0];
  }

  getCurrentPageData() {
    let data = this.getLocalData();
    let current;
    let pageSize;
    let state = this.state;
    // 如果没有分页的话，默认全部展示
    if (!this.hasPagination()) {
      pageSize = Number.MAX_VALUE;
      current = 1;
    } else {
      pageSize = state.pagination.pageSize;
      current = this.getMaxCurrent(state.pagination.total || data.length);
    }

    // 分页
    // ---
    // 当数据量少于等于每页数量时，直接设置数据
    // 否则进行读取分页数据
    if (data.length > pageSize || pageSize === Number.MAX_VALUE) {
      data = data.filter((item, i) => {
        return i >= (current - 1) * pageSize && i < current * pageSize;
      });
    }
    return data;
  }

  getFlatData() {
    return flatArray(this.getLocalData());
  }

  getFlatCurrentPageData() {
    return flatArray(this.getCurrentPageData());
  }

  recursiveSort(data, sorterFn) {
    const { childrenColumnName } = this.props;
    return data.sort(sorterFn).map(item => (item[childrenColumnName] ? assign(
      {},
      item, {
        [childrenColumnName]: this.recursiveSort(item[childrenColumnName], sorterFn),
      }
    ) : item));
  }

  getLocalData() {
    const state = this.state;
    const { dataSource } = this.props;
    let data = dataSource || [];
    // 优化本地排序
    data = data.slice(0);
    const sorterFn = this.getSorterFn();
    if (sorterFn) {
      data = this.recursiveSort(data, sorterFn);
    }
    // 筛选
    if (state.filters) {
      Object.keys(state.filters).forEach((columnKey) => {
        let col = this.findColumn(columnKey);
        if (!col) {
          return;
        }
        let values = state.filters[columnKey] || [];
        if (values.length === 0) {
          return;
        }
        data = col.onFilter ? data.filter(record => {
          return values.some(v => col.onFilter(v, record));
        }) : data;
      });
    }
    return data;
  }

  render() {
    let { style, className, prefixCls, zebra, ...restProps } = {...this.props};
    const data = this.getCurrentPageData();
    let columns = this.renderRowSelection();
    const expandIconAsCell = this.props.expandedRowRender && this.props.expandIconAsCell !== false;
    const locale = this.getLocale();

    prefixCls += '-table';
    const classString = classNames({
      [`${prefixCls}-${this.props.size}`]: true,
      [`${prefixCls}-bordered`]: this.props.bordered,
      [`${prefixCls}-zebra`]: zebra,
      [`${prefixCls}-empty`]: !data.length,
    });

    columns = this.renderColumnsDropdown(columns);
    let addKey = (column, i) => {
      const newColumn = assign({}, column);
      newColumn.key = this.getColumnKey(newColumn, i);
      return newColumn;
    };
    columns = isMultiTh(this.props) ? getValidColumns(this.props, columns).map(v => v.map(addKey)) : columns.map(addKey);

    let table = (
      <RcTable {...restProps}
        data={data}
        prefixCls={prefixCls}
        columns={columns}
        className={classString}
        expandIconColumnIndex={(columns[0] && columns[0].key === 'selection-column') ? 1 : 0}
        expandIconAsCell={expandIconAsCell}
        emptyText={() => locale.emptyText}
      />
    );
    // if there is no pagination or no data,
    // the height of spin should decrease by half of pagination
    const paginationPatchClass = (this.hasPagination() && data && data.length !== 0)
      ? `${prefixCls}-with-pagination`
      : `${prefixCls}-without-pagination`;
    const spinClassName = this.props.loading ? `${paginationPatchClass} ${prefixCls}-spin-holder` : '';
    return (
      <div className={`${className} ${prefixCls}-clearfix`} style={style}>
        {table}
        {this.renderPagination()}
        {this.props.loading && <Spin className={spinClassName} />}
      </div>
    );
  }
}

class Table extends M.BaseComponent {
  render() {
    let { columns, data, idField, hideColumnIf, onRowClick } = this.props;
    if (columns == null) return null;

    columns = getValidColumns(this.props)
      .filter(col => !(hideColumnIf && hideColumnIf(col)))
      .map(col => ({
        title: col.label,
        dataIndex: col.code,
        key: col.code,
        render: this.renderCell.bind(this, col),
        ...col,
      }));
    columns = getValidColumns(this.props, columns);
    isMultiTh(this.props) && columns.forEach((v, k) => {
      if (k !== columns.length - 1) {
        columns[k] = columns[k].map(col => ({...col, title: col.label}))
      }
    });
    return (
      <AntTable
        dataSource={data}
        rowKey={idField}
        {...this.props}
        columns={columns}
        onRowClick={onRowClick && this.handleRowClick}
      />
    );
  }
  renderCell(col, cell, row, index) {
    if (typeof col.format === 'function') return col.format(row, col, index);
    let { format } = this.props;
    return format && format(row, col, index) || cell;
  }
  handleRowClick(data, index, e) {
    let { onRowClick } = this.props;
    let el = e.target;
    while (el && el.tagName !== 'TD') {
      if (el.tagName === 'INPUT' || el.tagName === 'BUTTON' || el.tagName === 'TEXTAREA') return;
      el = el.parentNode;
    }
    onRowClick(...arguments);
  }
}

export default Table;
