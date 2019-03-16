import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { OrderedMap } from 'immutable';
import M from '../../util';
import { Search, SearchCondition, Console, Setting, DataGrid } from './component';
import { get as _get, pick as _pick, property as _property, isArray as _isArray,
  isObject as _isObject, isFunction as _isFunction, isEmpty as _isEmpty } from 'lodash-compat';
import { convertData } from './util';
import { isEmptyString } from '../../util/data';
import { TextFilter, SelectFilter, MultiSelectFilter } from './component/head-filter';
import Spin from '../../spin';

/**
 * FIXME: set和get方法输入与输出的格式不一致
 */
class ComplexRecords extends M.BaseComponent.Mixin(
  M.ContextMixin.ChildGetter({
    records: function() { return this; },
  })
) {
  // FIXME: 补全
  static propTypes = {
    prefixCls: PropTypes.string,
    model: PropTypes.shape({
      search: PropTypes.shape({
        mode: PropTypes.oneOf(['simple', 'complex']), //模式
        fields: PropTypes.array, //搜索字段
        events: PropTypes.array, //字段绑定事件
        filter: PropTypes.bool, //是否开启字段筛选设置
        advanced: PropTypes.bool, //是否开启高级搜索，在complex模式下有效
      }),
    }),
  };

  static defaultProps = {
    prefixCls: 'mt',
    mode: 'complex',
  };

  constructor(props) {
    super(props);
    const { model } = props;

    // 已经作为搜索的字段
    const searchFieldsMap = {};
    const { fields } = (model && model.search) || {};
    fields.forEach(item => searchFieldsMap[item.code] = item);
    // 表头筛选允许搜索的字段
    const { columns, scroll } = model && model.grid || {};
    const dataColumns = [];
    (columns || []).forEach((item) => {
      // FIXME: 这里需要注意：
      // 初始存入dataColumn的是不带有值的，之后每次操作修改同一对象，使得表头筛选组件接收到了新值，
      // 组件重新渲染，但是因为表头内部组件无法直接控制，暂时没别的办法处理值传递。
      dataColumns.push([item.code, Object.assign(this._formatTableHead(item), {
        show: item.show !== false,
      })]);
      // 如果存在表头筛选
      if (!!item.filterModel) {
        searchFieldsMap[item.code] = item;
        searchFieldsMap[item.code].filterType = item.filterModel.type;
      }
    });

    Object.assign(this.state, {
      condition: OrderedMap(), // 搜索条件
      changedKeys: [], // 当前变动的字段主键集合
      dataTotalCount: 0, // 数据总条数
      pageNo: 1, // 当前页码
      pageSize: model.pageSize || this.defaultPageSize, // 当前每页条数
      selection: [],  // 已选中数据项的标识
      data: [], //当前数据
      searchFieldsMap, //搜索字段配置
      dataColumns: OrderedMap(dataColumns), //数据列表配置
      gridScroll: scroll, //表格滚动设置
      loadingCondition: false, // 搜索条件
    });
  }

  async componentDidMount() {
    await this._initCondition();
  }

  render() {
    const { prefixCls, model } = this.props;
    const { pageNo, dataTotalCount, pageSize, selection, data, loading,
      dataColumns, gridScroll, loadingCondition } = this.state;
    const baseCls = `${prefixCls}-complex-records`;

    const grid = Object.assign({}, model.grid, {
      columns: dataColumns.toArray(),
      scroll: gridScroll, 
    });
    if (grid.pagination !== false) {
      grid.pagination = {
        size: 'small', //默认小号
        ...(grid.pagination || {}),
        current: pageNo,
        total: dataTotalCount,
        pageSize: pageSize,
        onChange: this._setPagination,
        onShowSizeChange: this._setPagination,
      };
    }
    if (grid.rowSelection !== false) {
      grid.rowSelection = {
        ...(grid.rowSelection || {}),
        selectedRowKeys: selection,
        onChange: selection => this.setState({ selection }),
      };
    }
    return (
      <div className={this.classNames(baseCls)}>
        <ComplexRecords.Search
          getInstanceRef={i => this.searchArea = i}
          className={`${baseCls}__search`}
          model={model.search} />
        <div className={`${baseCls}__search-info`}>
          <span className={`${baseCls}__result-number`}>
            搜索结果：{dataTotalCount}
          </span>
          <ComplexRecords.SearchCondition
            className={`${baseCls}__search-condition`}
            model={model.search} />
        </div>
        <div className={`${baseCls}__operation`}>
          <ComplexRecords.Console
            className={`${baseCls}__console`}
            model={model.console}
            data={this._getSelection()} />
          <ComplexRecords.Setting
            className={`${baseCls}__setting`}
            model={model.setting} />
        </div>
        <ComplexRecords.DataGrid
          className={`${baseCls}__data-grid`}
          model={grid}
          data={data}
          loading={loading} />
        {loadingCondition && <Spin className={`${baseCls}__loading`} />}
      </div>
    );
  }

  /**
   * 初始化搜索条件
   */
  async _initCondition() {
    const { onInitCondition, onInitFilter } = this.props;
    if (_isFunction(onInitCondition)) {
      console.warn('onInitCondition 即将弃用，请替换为 onInitFilter，用法不变');
    }
    const condition = {};
    const initCondition = (_isFunction(onInitFilter) && onInitFilter)
      || (_isFunction(onInitCondition) && onInitCondition)
    if (initCondition) {
      this.setState({ loadingCondition: true });
      const filter = await initCondition();
      const { searchFieldsMap } = this.state;
      Object.keys(filter).forEach((item) => {
        const field = searchFieldsMap[item];
        // 可能会处理到showCode，直接跳过
        if (field) {
          const fieldType = field.filterType || field.type;
          const isHeadFilter = !!field.filterType;
          switch (fieldType) {
            case 'select':
            case 'treeSelect':
              let model = field.model || (field.conf && field.conf.model);
              isHeadFilter && (model = field.filterModel);
              const { idField, showField } = model;
              let idFieldValue, showFieldValue;
              if (_isObject(filter[item])) {
                idFieldValue = filter[item][idField];
                showFieldValue = filter[item][showField];
              } else {
                const showCode = field.showCode || `${item}Name`;
                idFieldValue = filter[item];
                showFieldValue = filter[showCode];
              }
              condition[item] = {
                value: idFieldValue,
                label: showFieldValue,
                [idField]: idFieldValue,
                [showField]: showFieldValue,
              };
              break;
            case 'multiSelect':
            case 'multiTreeSelect':
              condition[item] = [];
              if (_isArray(filter[item])) {
                let model = field.model || (field.conf && field.conf.model);
                isHeadFilter && (model = field.filterModel);
                const { idField, showField } = model;
                filter[item].forEach((obj) => {
                  const idFieldValue = obj[idField];
                  const showFieldValue = obj[showField];
                  condition[item].push({
                    value: idFieldValue,
                    label: showFieldValue,
                    [idField]: idFieldValue,
                    [showField]: showFieldValue,
                  });
                });
              }
              break;
            case 'radio':
              const radioData = field.range || 
                (field.conf && (field.conf.range || field.conf.model)) || [];
              condition[item] = Object.assign({}, 
                radioData.find(obj => obj.value === filter[item]));          
              break;
            case 'checkbox':
              const checkboxData = field.range || 
                (field.conf && (field.conf.range || field.conf.model)) || [];
              condition[item] = [];
              filter[item].forEach((obj) => {
                const result = checkboxData.find(d => obj === d.value);
                if (result) {
                  condition[item].push({
                    value: result.value,
                    label: result.label,
                  });
                }
              });
              break;
            default:
              condition[item] = filter[item];
          }
        }
      });
      this.setState({ loadingCondition: false });
      !_isEmpty(condition) && this._setCondition(condition);
    } else {
      // 如果不用初始化条件，则直接搜索数据
      await this._fetchData();
    }
  }

  /**
   * 根据当前搜索条件和分页条件重新获取并设置数据
   */
  async _fetchData() {
    const { fetchData } = this.props;
    const filter = this.getFilter();
    this.setState({ loading: true });
    try {
      const res = fetchData && await fetchData(filter);
      if (res) {
        this.setState({
          data: res.pageList || [],
          dataTotalCount: _get(res, 'page.totalCount', 0),
        });
      }
    } finally {
      this.setState({ loading: false });
    }
  }

  /**
   * 设置分页条件，置空参数将被忽略
   * 比如 setPagination(2) 只设置当前页码为 2，setPagination(undefined, 10) 只设置分页大小为 10
   */
  async _setPagination(pageNo, pageSize) {
    this.setState(_pick({ pageNo, pageSize },
      v => !isEmptyString(v)), this._fetchData);
  }

  /**
   * 设置表头筛选
   * @param code
   * @param v
   * @private
   */
  _setHeadFilter(code, v) {
    this._setCondition({ [code]: v });
  }

  /**
   * 增加表头筛选
   * @param model
   * @returns {*}
   */
  _formatTableHead(model) {
    const m = { ...model };
    const { code, filterModel } = m;
    const { type: filterType } = filterModel || {};

    const extra = {};
    if (!!filterType) {
      // 默认弹在本组件
      extra.filterPopupContainer = () => findDOMNode(this);
      let Component;
      switch(filterType) {
        case 'text':
          Component = TextFilter;
          break;
        case 'select':
          // case 'treeSelect':
          Component = SelectFilter;
          break;
        case 'multiSelect':
          // case 'treeMultiSelect':
          Component = MultiSelectFilter;
          break;
      }
      if (Component) {
        // 排除掉filterDropdown的model向内传入
        delete m.filterDropdown;
        extra.filterDropdown = (
          <Component
            model={m}
            onCancel={() => {
              this._setFieldColumn(code,
                Object.assign(this.state.dataColumns.get(code), {
                  filterDropdownVisible: false,
                }));
              }}
            onConfirm={this._setHeadFilter.bind(this, code)} />
        );
      }
    }
    return Object.assign(m, extra);
  }

  /**
   * 搜索条件改变时的回调
   */
  async _onConditionChange() {
    const { onFilterChange } = this.props;
    const filter = this.getFilter();
    _isFunction(onFilterChange) && (await onFilterChange(filter));
  }

  /**
   * 获取搜索条件
   * @returns {*|OrderedMap<K, V>|OrderedMap<string, V>|condition|string|string}
   */
  _getCondition() {
    return this.state.condition;
  }

  /**
   * 接受多组键值对更新
   * value = '' | { label, value } | [{ label, value }, { label, value }, ...] //字段值
   * @param kvMap = { key1: value1, key2: value2, ... }
   * @param isTemporary 是否是暂存搜索条件
   * @private
   */
  async _setCondition(kvMap, isTemporary, dontNotice, dontSearch) {
    if (isTemporary) {
      this.temporaryCondition = kvMap;
    } else {
      // 将暂存的条件也更新上，这样当其他操作（比如直接删除搜索条件）更新搜索条件时不会丢失暂存
      if (this.temporaryCondition) {
        kvMap = Object.assign({}, this.temporaryCondition, kvMap);
        this.temporaryCondition = null;
      }
      let { condition, dataColumns } = this.state;

      for (let k in kvMap) {
        let v = kvMap[k];
        if (['', null, undefined].includes(v) || v.length == 0) {
          condition = condition.delete(k);
        } else {
          condition = condition.set(k, v);
        }
        //如果清除的是表头筛选的字段
        const column = dataColumns.get(k);
        if (column) {
          const filteredFullValue = (_isArray(v)? v : [v]).filter(item => !!item);
          const filteredValue = filteredFullValue.map(item => {
            return _isObject(item)? _get(item, 'value') : item;
          });
          dataColumns = dataColumns.set(k, Object.assign(column, {
            filterDropdownVisible: false,
            filtered: filteredFullValue.length > 0,
            filteredFullValue,
            filteredValue,
          }));
        }
      }

      const changedKeys = _isObject(kvMap) && Object.keys(kvMap) || [];
      const newState = {
        condition,
        changedKeys,
        dataColumns,
      };
      await this.setStateAsync(newState);
      !dontNotice && await this._onConditionChange();
      !dontSearch && await this.search();
    }
  }

  /**
   * 获取当前变化的字段主键集合
   * @returns {V[]|Array<V>|*|changedKeys|Array}
   */
  _getChangedKeys() {
    return this.state.changedKeys.slice();
  }

  /**
   * 获取数据标识的字段名
   * @returns {string}
   */
  _getIdField() {
    const { model } = this.props;
    return model.idField;
  }

  /**
   * 获取搜索条件model键值对
   * @returns {{}|*}
   */
  _getSearchFieldsMap() {
    return { ...this.state.searchFieldsMap };
  }

  /**
   * 获取已选中数据项的完整对象列表，不包括在当前数据中不存在的条目
   * @returns {Array<Object>}
   */
  _getSelection() {
    const { data, selection } = this.state;
    const dataById = M.toObject(data, this._getIdField());
    return selection.map(item => dataById[item]).filter(Boolean);
  }

  /**
   * 获取列表项
   */
  _getColumns() {
    return this.state.dataColumns.toArray();
  }

  /**
   * 设置全部列表项
   * @param columns
   * @param cb
   */
  _setColumns(columns, cb) {
    this.setState({
      dataColumns: OrderedMap(columns.map(d => [d.code, d])),
    }, cb);
  }

  /**
   * 设置单列
   * @param code
   * @param column
   * @param cb
   */
  _setFieldColumn(code, column, cb) {
    const { dataColumns } = this.state;
    this.setState({
      dataColumns: dataColumns.set(code, column),
    }, cb);
  }

  _getScroll() {
    return { ...this.state.gridScroll };
  }

  _setScroll(gridScroll) {
    this.setState({ gridScroll });
  }

  /**
   * 当搜索字段调整排序或显示状态时
   * @param currentFields 当前展示的字段
   * @param allFields 所有的字段
   */
  _onSearchFieldsFilter(currentFields, allFields, ...args) {
    const { onSearchFieldsFilter } = this.props;
    onSearchFieldsFilter && onSearchFieldsFilter(currentFields, allFields, ...args);
  }

  /**
   * 当列表字段调整排序或显示状态时
   * @param currentColumns 当前展示的列
   * @param allColumns 所有的列
   */
  _onColumnsFilter(currentColumns, allColumns, ...args) {
    const { onColumnsFilter } = this.props;
    onColumnsFilter && onColumnsFilter(currentColumns, allColumns, ...args);
  }

  /**
   * 操作时触发的事件，一般会在操作面板中的按钮被点击时调用
   * @param data 操作关联的数据
   * @param model 操作按钮的配置
   * @param args
   */
  async _action(data, model, ...args) {
    const action = model.action || this.defaultActions[model.code];
    if (action == null) return null;
    //传出的数据中增加ids方法可以直接获取主键数组
    data.ids = () => data.map(_property(this._getIdField()));
    await action(this, data, model, ...args);
  }

  /**
   * 渲染一行数据的操作面板
   * 针对type为console的列，如果未对该列传入buttons，则默认用定义在全局的buttons
   */
  _renderRowConsole(data, model) {
    const { prefixCls, model: m } = this.props;
    const buttons = model.buttons || m.console.buttons;
    return (
      <ComplexRecords.Console className={`${prefixCls}-complex-records__row-console`}
                              model={{ buttons }}
                              data={[data]} inRow />
    );
  }

  /**
   * 重置搜索条件
   */
  reset() {
    let { condition, dataColumns } = this.state;
    const changedKeys = condition.keySeq().toArray();
    changedKeys.forEach(k => {
      //如果清除的是表头筛选的字段，同时清空高亮状态
      let column = dataColumns.get(k);
      if (column) {
        dataColumns = dataColumns.set(k, Object.assign(column, {
          filtered: false,
          filteredFullValue: [],
          filteredValue: [],
        }));
      }
    });

    this.setState({
      condition: condition.clear(),
      changedKeys,
      dataColumns,
    }, async () => {
      await this._onConditionChange();
      await this.search();
    });
  }

  /**
   * 重置为第一页并搜索数据
   * 搜索条件改变后，可能当前页没有数据了
   */
  async search() {
    // 如果存在暂存搜索条件，则确认设置搜索条件
    if (this.temporaryCondition) {
      await this._setCondition(this.temporaryCondition);
      this.temporaryCondition = null;
    } else {
      // 否则直接搜索
      this.setState({ pageNo: 1 }, this._fetchData);
    }
  }

  /**
   * 获取当前搜索条件
   */
  getFilter() {
    const { condition, pageNo, pageSize, searchFieldsMap } = this.state;
    const page = { pageNo, pageSize };
    const filter = { page };
    condition.forEach((v, k) => {
      Object.assign(filter, convertData(v, searchFieldsMap[k]));
    });
    return filter;
  }

  /**
   * 控制字段属性，仅支持complex模式
   * @param {*} control 
   */
  doControl(control) {
    if (this.props.mode === 'complex') {
      this.searchArea._doControl(control);
    }
  }

  /**
   * 设置搜索条件
   * @param {*} data 
   */
  async setFieldsFilter(data) {
    await this._setCondition(data, null, true, true);
  }

  /**
   * 默认操作
   * 当传入button的code与action相同并没有自定义action时
   */
  defaultActions = {
    search: records => records.search(),
    reset: records => records.reset(),
  };

  /**
   * 默认分页大小
   */
  defaultPageSize = 20;
}

ComplexRecords.Search = Search;
ComplexRecords.SearchCondition = SearchCondition;
ComplexRecords.Console = Console;
ComplexRecords.Setting = Setting;
ComplexRecords.DataGrid = DataGrid;

export default ComplexRecords;
