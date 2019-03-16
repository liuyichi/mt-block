import React from 'react';
import { findDOMNode } from 'react-dom';
import M from '../../../util';
import Spin from '../../../spin';
import Bill from '../../../bill';
import { buildEvents } from '../util';
import { isObject, isArray, isFunction, cloneDeep, isEmpty } from 'lodash-compat';
import Icon from '../../../icon';
import Popover from './popover';
import CustomFilter from './custom-filter';
import SlidingPanel from './sliding-panel';
import AdvancedSearch from './AdvancedSearch';
import KeyCode from '../../../util/rc-util/KeyCode';
import MultiSelect from './MultiSelect';

/**
 * 搜索条件
 */
class Search extends M.BaseComponent {
  render() {
    const { className: baseCls, model, getInstanceRef } = this.props;
    const { mode, ...conf } = model;
    let content;
    switch (mode) {
      case 'simple':
        content = <Search.Simple ref={getInstanceRef} model={conf} className={`${baseCls}--simple`} />;
        break;
      case 'complex':
        content = <Search.Complex ref={getInstanceRef} model={conf} className={`${baseCls}--complex`} />;
        break;
    }
    return (
      <div className={this.classNames()}>{content}</div>
    );
  }
}

class SimpleSearch extends M.BaseComponent.Mixin(
  M.ContextMixin('records')
) {
  constructor(props) {
    super(props);
    const { model } = this.props;
    const eventFactory = buildEvents(model);
    Object.assign(this.state, {
      loading: false,
      eventFactory,
    });
  }
  componentDidMount() {
    this._fetchData();
  }
  render() {
    const { className: baseCls, model: { fields }} = this.props;
    const { loading } = this.state;
    return (
      <div className={this.classNames()}>
        <ul className={`${baseCls}__list`}>
          {fields.map(f => this._renderField(f))}
        </ul>
        {loading && <div className={`${baseCls}__loading`}><Spin /></div>}
      </div>
    );
  }
  _renderField(field) {
    const condition = this.context.records._getCondition();
    const { remoteData } = this.state;
    const { code, label, model, data, type } = field;
    let current = condition.get(code); //当前值
    const multiple = type == 'multiSelect';
    if (multiple) {
      current = (current || []).map(item => isObject(item)? item.value : item);
    } else {
      current = !!current && (isObject(current)? current.value : current);
    }
    return (
      <li key={field.code} className="simple-search__item">
        <div className="simple-search__item__title">
          <div>{label}：</div>
        </div>
        <ul className={M.classNames("simple-search__item__data-list", { multiple })}>
          {(data || (remoteData && remoteData[field.code]) || []).map((d, i) => {
            let k, v, showContent;
            if (model) { //object传入
              const { idField, showField, showTpl } = model;
              showContent = showTpl? M.template(showTpl, d) : d[showField];
              k = d[idField];
              v = Object.assign({}, d, { value: k, label: showContent });
            } else { //纯字符串传入
              k = v = showContent = d;
            }
            return (
              <li key={k}
                  className={M.classNames('simple-search__item__data-list-item', {
                    active: !!current && (multiple? current.includes(k) : current == k),
                  })}
                  onClick={this._onSelect.bind(this, i, v, field)}>
                {showContent}
              </li>
            );
          })}
        </ul>
      </li>
    );
  }
  _onSelect(i, v, field) {
    const { records } = this.context;
    const condition = records._getCondition();
    const { code, type } = field;
    let current = condition.get(code); //当前值
    const multiple = type == 'multiSelect';

    //如果当前值与选中值相同则清除
    let value = (current == v) || (isObject(current) && current.value == v.value)? undefined : v;
    if (multiple) {
      //多选存在切换选中状态
      if (!current) {
        current = [];
      }
      const index = current.findIndex(item => isObject(v)? v.value == item.value : v == item);
      if (index == -1) {
        value = current.concat([v]);
      } else {
        value = current.slice();
        value.splice(index, 1);
      }
    }

    records._setCondition({ [code]: value });
  }
  async _fetchData() {
    const { model } = this.props;
    const { eventFactory } = this.state;
    let codeList = [], fetchEvents = [];
    // 可能定义事件并不是在events字段上，所以对全字段筛选
    model.fields.forEach(f => {
      const handler = eventFactory(f.code, 'bind');
      if (handler) {
        codeList.push(f.code);
        fetchEvents.push(eventFactory(f.code, 'bind')());
      }
    });
    this.setState({ loading: true });
    try {
      const res = await Promise.all(fetchEvents);
      const data = {};
      res.forEach((r, i) => {
        data[codeList[i]] = r;
      });
      this.setState({ remoteData: data });
    } finally {
      this.setState({ loading: false });
    }
  }
}
Search.Simple = SimpleSearch;

class ComplexSearch extends M.BaseComponent.Mixin(
  M.ContextMixin('records')
) {
  constructor(props) {
    super(props);
    let { model } = props;
    let { fields, advanced, filter, ...modelExtra } = model;
    let fieldsMap = {};
    let basicBillFields = [], advancedBillFields = [];
    for (let i = 0, length = fields.length; i < length; i++) {
      let f = fields[i];
      let { code, label, show, onlyShowIn } = f;
      if (!onlyShowIn || onlyShowIn === 'basic') {
        basicBillFields.push({
          code, label,
          show: show !== false,
        });
      }
      if (!onlyShowIn || onlyShowIn === 'advanced') {
        advancedBillFields.push({
          code, label,
        });
      }
      fieldsMap[f.code] = f;
    }
    let eventFactory = buildEvents(model);
    Object.assign(this.state, {
      fieldsMap, // 字段code映射关系，原始数据
      filter, // 是否有自定义的条件展示
      basicBillFields, // 只显示在表格上方的标准搜索区的字段
      advancedBillFields, // 只显示在高级搜索区的字段
      modelExtra, // 除fields等其他需要传给bill的字段
      showFilter: false, // 是否展示条件过滤器
      advanced: advanced || false, // 是否开启高级搜索
      eventFactory,
    });
    // 初始化搜索区bill的字段改造后的映射
    this.searchBillFieldsMap = this._initSearchBillFieldsMap();
    this.searchBillModel = this._initSearchBillModel();
    this.searchData = {};
  }

  componentDidMount() {
    this.windowEventListener('click', (e) => {
      let { showFilter } = this.state;
      let { filter } = this.refs;
      if (showFilter && !findDOMNode(filter).contains(e.target)) {
        this._toggleFilter(false);
      }
    });
  }

  componentDidUpdate(prevProps, prevState, preContext) {
    //在更新之后重新给bill赋值
    let { records } = this.context;
    let condition = records._getCondition();
    let changedKeys = records._getChangedKeys();
    // 如果是过滤器发生改变，强制重新调整激活状态
    if (this.filterChanged || !condition.equals(this.lastCondition) && changedKeys.length > 0) {
      //condition驱动激活状态的变化，不外乎添加和删除两种
      let { bill } = this.refs;
      changedKeys.map(key => {
        let model = bill.getFieldModel(key);
        let isExist = condition.has(key);
        // 搜索条件改变时，调整激活状态
        if (model) {
          M.mergeModel(model, {
            'conf.className': M.classNames('bill-item-content', { 'active-condition': isExist }),
          });
          M.mergeModel(this.searchBillModel, {
            [`forms[0].fields.${key}`]: model,
          });

          // 如果组件内存储的搜索数据为空，但是有传入新的搜索条件，表示传入了初始搜索条件
          if (isEmpty(this.searchData) && condition.size > 0) {
            let { fieldsMap } = this.state;
            condition.forEach((value, key) => {
              // 只存储搜索条件，过滤掉表头筛选字段
              if (fieldsMap[key]) {
                this.searchData[key] = value;
              }
            });
          }

          //对于input、time，需要回传值，设置新值或删除旧值
          //input，需要展示当前值
          //time，选中时触发了change但是没有收起下拉框
          //自定义多选组件，需要回传值
          if (['text', 'password', 'number', 'time'].includes(model.type)
            || ['multiSelect', 'treeMultiSelect', 'checkbox'].includes(model._type_)
          ) {
            //如果是新增的字段，保留
            if (isExist) {
              bill.setFieldsData({ [key]: this.searchData[key] });
            } else {
              bill.setFieldsData({ [key]: undefined });
            }
          }

          bill.setFieldModel(key, model);
        }

        //如果是删除的字段，从本地存储中删除，操作来源是直接删除条件字段或者全部删除
        !isExist && this.searchData && (delete this.searchData[key]);
      });
      this.filterChanged = false;
    }
    this.lastCondition = condition;
  }

  render() {
    let { className: baseCls } = this.props;
    let { filter, basicBillFields, showFilter, advanced } = this.state;
    return (
      <div ref="container" className={this.classNames()}>
        <Bill ref="bill"
              initModel={this.searchBillModel}
              getPopupContainer={() => this.refs.container}
              onFieldChange={this._onFieldChange} />
        {(advanced || filter) && (
          <div className={`${baseCls}__extend-search`}>
            {advanced && <div className={`${baseCls}__advanced-search-entry`}
                              onClick={this._showAdvancedSearch}>高级搜索</div>}
            {filter && (
              <div ref="filter" className={`${baseCls}__custom-filter-wrapper`}>
                <Icon className={`${baseCls}__custom-filter-icon`}
                      type="settings" domProps={{ onClick: this._toggleFilter.bind(this, !showFilter) }}/>
                <Popover className={`${baseCls}__popover-tip`} placement="top">设置默认筛选条件</Popover>
                {showFilter && (
                  <Popover className={`${baseCls}__popover-filter`}>
                    <CustomFilter className={`${baseCls}__custom-filter`}
                                  data={basicBillFields}
                                  onConfirm={this._onFilterChange}
                                  onCancel={this._toggleFilter.bind(this, false)} />
                  </Popover>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  /**
   * 生成搜索区bill的全字段映射关系
   * @private
   */
  _initSearchBillFieldsMap() {
    let { fieldsMap, basicBillFields, eventFactory } = this.state;
    let searchBillFieldsMap = {};
    basicBillFields.forEach(f => {
      let nf = cloneDeep(fieldsMap[f.code]);
      // 初始化show属性
      nf.show = f.show;
      if (!nf.conf) {
        nf.conf = {};
      }

      if (nf.type == 'rangeDate') {
        console.warn('搜索条件当前不支持"rangeDate"类型，推荐使用"date"类型实现开始和结束时间');
      }

      // 单选|多选用下拉实现
      if (['radio', 'checkbox'].includes(nf.type)) {
        const data = nf.range || nf.conf.range || nf.conf.model || [];
        delete nf.conf.model; // 清除容易误解的属性
        nf._type_ = nf.type; //记录一下原type
        if (nf.type === 'radio') {
          nf.type = 'select';
          nf.onBind = (bill, code, filter, callback) => {
            const filteredData = data.filter(item => item.label.indexOf(filter) !== -1);
            callback(filteredData);
          };
        } else {
          nf._selectType_ = 'multiSelect';
          nf.type = 'custom';
          nf.Component = MultiSelect;
          nf.onFetchData = (bill, code, filter, callback) => {
            const filteredData = data.filter(item => item.label.indexOf(filter) !== -1);
            callback(filteredData);
          }
        }
        nf.model = {
          idField: 'value',
          showField: 'label',
        };
      }

      //在针对类型作变换之前，将multiSelect转换为自定义组件
      if (['multiSelect', 'treeMultiSelect'].includes(nf.type)) {
        nf._type_ = nf.type; //记录一下原type
        nf._selectType_ = nf.type;
        nf.type = 'custom';
        nf.Component = MultiSelect;
        nf.onFetchData = (bill, code, filter, callback, errCallback) => {
          const handler = eventFactory(code, 'bind', bill);
          handler(filter, callback, errCallback);
        }
        if (nf._selectType_ === 'treeMultiSelect') {
          nf.onFetchNodeData = (bill, code, node, callback) => {
            const handler = eventFactory(code, 'bindNode', bill);
            handler(node, callback);
          }
        }
      }

      //默认placeholder
      nf.conf.placeholder = nf.conf.placeholder || nf.label;
      //不显示label
      nf.showHeader = false;
      //清除所有的clearIcon
      nf.conf.clearIcon = false;

      //在字段上绑定onChange，阻止bill自动更新字段值并阻止了onControl和onFetch，同时调用传给bill的字段改变回调
      let changeFunc = nf.onChange;
      nf.onChange = (value, bill, onFieldChange, doAction) => {
        bill.setFieldsData({ [nf.code]: value }, () => {
          onFieldChange(nf.code, value, bill);
          isFunction(changeFunc) && (changeFunc.call(this, value, bill));
        }, 'notNowUpdate', 'noWarn');
      };

      //处理需要下拉高亮的字段
      if (['select', 'treeSelect', 'date', 'time'].includes(nf.type)) {
        //获取焦点时传值回组件，使得下拉选项高亮
        let focusFunc = nf.conf.onFocus;
        nf.conf.onFocus = function(code, ...args) {
          if (this.searchData && this.searchData[code]) {
            this.refs.bill.setFieldsData({ [code]: this.searchData[code] });
          }
          isFunction(focusFunc) && (focusFunc.call(null, ...args));
        }.bind(this, nf.code);

        //失焦时移除值
        let blurFunc = nf.conf.onBlur;
        nf.conf.onBlur = function(code, ...args) {
          this.refs.bill.setFieldsData({ [code]: undefined });
          isFunction(blurFunc) && (blurFunc.call(null, ...args));
        }.bind(this, nf.code);
      }

      //对字段的特殊处理 FIXME 整理一下吧
      switch(nf.type) {
        case 'text':
        case 'password':
        case 'number':
          nf.addonAfter = createAddonAfter(nf.addonAfter, this._updateCondition.bind(this, false));
          nf.conf.trigger = 'onChange';
          if (!nf.conf.domProps) {
            nf.conf.domProps = {};
          }
          //回车时确认搜索
          let keyDownFunc = nf.conf.domProps.onKeyDown;
          Object.assign(nf.conf.domProps, {
            onKeyDown: (...args) => {
              let e = args[0];
              if (e.keyCode == KeyCode.ENTER) {
                this._updateCondition();
              }
              isFunction(keyDownFunc) && (keyDownFunc.call(null, ...args));
            },
          });
          let blurFunc = nf.conf.onBlur;
          nf.conf.onBlur = (...args) => {
            // 输入框失去焦点时需要通知外部条件更新但不触发搜索
            this._updateCondition(true);
            isFunction(blurFunc) && (blurFunc.call(null, ...args));
          };
          break;
        case 'select':
        case 'treeSelect':
          if (!nf.model) {
            nf.model = {};
          }
          Object.assign(nf.model, {
            //默认展示6条的高度
            height: nf.model.height || 216,
          });
          break;
        case 'date':
          nf.conf.trigger = 'onConfirm';
          break;
        case 'rangeDate':
          //时间段的placeholder必须是个数组
          nf.conf.placeholder = nf.conf.placeholder == nf.label?
            [nf.label, nf.label] : nf.conf.placeholder;
          break;
      }

      searchBillFieldsMap[nf.code] = nf;
    });
    return searchBillFieldsMap;
  }

  /**
   * 生成搜索区的bill model
   * @returns {{forms: [*]}}
   * @private
   */
  _initSearchBillModel() {
    let { basicBillFields, modelExtra } = this.state;
    let fields = [];
    basicBillFields.forEach((item) => {
      if (item.show) {
        fields.push(this.searchBillFieldsMap[item.code]);
      }
    });
    return { forms: [{ fields }], ...modelExtra };
  }

  /**
   * 生成高级搜索区的bill model
   * @private
   */
  _formAdvancedSearchBillModel() {
    let { fieldsMap, advancedBillFields, modelExtra } = this.state;
    let fields = advancedBillFields.map(item => {
      // 传入bill之前把所有字段的show属性删除
      delete fieldsMap[item.code].show;
      return fieldsMap[item.code];
    });
    return { forms: [{ fields }], ...modelExtra, column: 1 };
  }

  /**
   * 展示的搜索条件改变时只切换在bill中的显示状态
   * @param basicBillFields
   * @private
   */
  _onFilterChange(basicBillFields) {
    this._toggleFilter(false);
    this.setState({ basicBillFields }, this._setSearchBillFields);
  }

  /**
   * 重新设定字段的显示状态和顺序
   * @private
   */
  _setSearchBillFields() {
    let { bill } = this.refs;
    let { basicBillFields } = this.state;
    let fields = [];
    basicBillFields.forEach((item) => {
      // 更新显示状态
      this.searchBillFieldsMap[item.code].show = item.show;
      if (item.show) {
        fields.push(this.searchBillFieldsMap[item.code]);
      }
    });
    this.searchBillModel.forms[0].fields = fields;

    bill.setModel(this.searchBillModel, () => {
      // 过滤器变化设定字段
      this.filterChanged = true;
      this.forceUpdate();
      let { records } = this.context;
      let { basicBillFields } = this.state;
      records._onSearchFieldsFilter(basicBillFields.filter(f => f.show).map(f => f.code),
        basicBillFields);
    });
  }

  /**
   * 简易搜索字段变化时只存储条件到本地
   * @param code
   * @param value
   * @param bill
   * @private
   */
  _onFieldChange(code, value, bill) {
    let model = bill.getFieldModel(code);
    switch(model.type) {
      case 'select':
      case 'treeSelect':
        //如果value是对象且value.value是假值
        if (isObject(value) && !value.value) {
          value = undefined;
        }
        break;
      case 'rangeDate':
        //如果开始和结束都不存在且不是至今
        if (!value[0] && !value[1] && !value[2]) {
          value = [];
        }
        break;
    }
    Object.assign(this.searchData, { [code]: value });
    //这几种类型的字段非立即搜索
    if (!['text', 'password', 'number'].includes(model.type)) {
      this._updateCondition();
    } else {
      // 输入框的值始终让bill记忆
      bill.setFieldsData({ [code]: value });
    }
  }

  /**
   * 通知外部更新搜索条件
   * @private
   */
  _updateCondition(isTemporary) {
    let { records } = this.context;
    records._setCondition(this.searchData, isTemporary);
  }

  _toggleFilter(show) {
    this.setState({
      showFilter: show,
    });
  }

  _showAdvancedSearch() {
    let { className: baseCls } = this.props;
    let { fieldsMap } = this.state;
    let model = this._formAdvancedSearchBillModel();
    let billData = {};
    for (let field in this.searchData) {
      const model = fieldsMap[field];
      if (model) {
        const searchValue = this.searchData[field];
        if (model.type === 'radio') {
          billData[field] = searchValue && searchValue.value;
        } else if (model.type === 'checkbox') {
          billData[field] = ((isArray(searchValue) ? searchValue : [searchValue])
            || []).map(item => item.value);
        } else {
          billData[field] = searchValue;
        }
      }
    }
    SlidingPanel.show((props) => (
        <AdvancedSearch className={`${baseCls}__advanced-search`}
                        model={model}
                        searchData={this.searchData}
                        billData={billData}
                        onClose={this._hideAdvancedSearch}
                        onConfirm={this._confirmAdvancedSearch} />
      ), { className: `${!!model.code ? `sliding-panel__${model.code}` : ''}` });
  }

  _hideAdvancedSearch() {
    SlidingPanel.hide();
  }

  _confirmAdvancedSearch(searchData, billData) {
    this._hideAdvancedSearch();
    this.searchData = searchData;
    this._updateCondition();
  }

  _doControl(control) {
    const { show, hide, editable, disabled } = control;
    const { bill } = this.refs;
    (show || []).forEach((key) => {
      const model = bill.getFieldModel(key);
      M.mergeModel(model, {
        show: true,
      });
      M.mergeModel(this.searchBillModel, {
        [`forms[0].fields.${key}`]: model,
      });
      bill.setFieldModel(key, model);
    });
    (hide || []).forEach((key) => {
      const model = bill.getFieldModel(key);
      M.mergeModel(model, {
        show: false,
      });
      M.mergeModel(this.searchBillModel, {
        [`forms[0].fields.${key}`]: model,
      });
      bill.setFieldModel(key, model);
    });
    (editable || []).forEach((key) => {
      const model = bill.getFieldModel(key);
      M.mergeModel(model, {
        disabled: false,
      });
      M.mergeModel(this.searchBillModel, {
        [`forms[0].fields.${key}`]: model,
      });
      bill.setFieldModel(key, model);
    });
    (disabled || []).forEach((key) => {
      const model = bill.getFieldModel(key);
      M.mergeModel(model, {
        disabled: true,
      });
      M.mergeModel(this.searchBillModel, {
        [`forms[0].fields.${key}`]: model,
      });
      bill.setFieldModel(key, model);
    });
  }
}
Search.Complex = ComplexSearch;

/**
 * 对于输入框类型，需要在后面加搜索放大镜
 * 如果传入的ReactElement是在组件内调用生成的，则该Element会获得当前的ReactOwner
 * 造成Bill首次渲染延迟300多ms，更新渲染延迟600多ms
 * 因此在外层先生成无owner的组件，用cloneElement实现组件的自定义
 */
class StandardAddonAfter extends M.BaseComponent {
  render() {
    let { children, onSearch } = this.props;
    return (
      <div className="bill-item-addon-after__inner">
        <Icon className="bill-item-addon-after__search-icon"
              type="search" domProps={{ onClick: onSearch }} />
        {children}
      </div>
    );
  }
}

let standardAddonAfter = <StandardAddonAfter />;
function createAddonAfter(addonAfter, search) {
  return React.cloneElement(standardAddonAfter, { children: addonAfter, onSearch: search });
}

export default Search;
