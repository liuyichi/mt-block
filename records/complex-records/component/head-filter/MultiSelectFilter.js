import React from 'react';
import M from '../../../../util';
import Checkbox from '../../../../checkbox';
import Button from '../../../../button';
import { isFunction, pick as _pick, isArray } from 'lodash-compat';
import MultiSelectDropdown from '../multi-select-dropdown';
import Icon from '../../../../icon';

class MultiSelectFilter extends M.BaseComponent {
  constructor(props) {
    super(props);
    let { model } = props;
    let { filteredFullValue, filters, filterModel } = model || {};
    //如果有传入onFetchData，则默认不使用filters的数据
    let data = isFunction(filterModel.onFetchData)? [] : (isArray(filters)? filters.slice() : []);
    Object.assign(this.state, {
      data,
      showData: this._getShowData(data, filterModel),
      selectedKeys: (filteredFullValue || []).map(v => v.value),
      loading: false,
      showSearch: filterModel.showSearch, //是否显示搜索框
      value: filteredFullValue || [],
    });
    //FIXME 是否统一处理组件值，目前：selectedKeys是无搜索框，由本组件实现的；value是嵌入了MultiSelectDropdown
  }
  componentDidMount() {
    //如果不显示搜索框，则在组件刚加载时获取数据
    if (!this.state.showSearch) {
      this._onFetchData();
    }
  }
  componentWillReceiveProps(nextProps) {
    let { model } = nextProps;
    let { filteredFullValue } = model || {};
    let { value } = this.state;
    this.setState({
      selectedKeys: (filteredFullValue || []).map(v => v.value),
      value: isArray(filteredFullValue) && filteredFullValue.length == 0? [] : value,
    });
  }
  render() {
    let { model } = this.props;
    let { filterModel } = model || {};
    let { type, ...m } = filterModel || {};
    let { showData, selectedKeys, showSearch, loading, value } = this.state;
    let baseCls = 'multi-select-filter';
    //显示搜索框时，loading状态由内部决定
    if (showSearch) {
      //FIXME 过滤传入select的参数
      let selectProps = {
        ...m,
        model: _pick(m, ['idField', 'showField', 'tpl', 'showTpl', 'format']),
        onFetchData: this._onFetchData,
        size: 'small',
      };
      return (
        <div className={baseCls}>
          <MultiSelectDropdown selectProps={selectProps}
                               type={type}
                               value={value}
                               onCancel={this._onCancel}
                               onConfirm={this._onConfirm} />
        </div>
      );
    } else {
      let listItems;
      if (loading) {
        listItems = (
          <li className={`${baseCls}__loading`}>
            <Icon className={`${baseCls}__loading-icon`} type="loading" />
          </li>
        );
      } else if (!showData || showData.length == 0) {
        return null;
      } else {
        listItems = (showData || []).map((d, i) => {
          let { value, label } = d;
          let checked = selectedKeys.includes(value);
          return (
            <li key={i}
                className={M.classNames(`${baseCls}__item`, {
                  active: checked,
                })}>
              <Checkbox className={`${baseCls}__item-checkbox`}
                        size="small"
                        checked={checked}
                        onChange={this._onSelect.bind(this, value)}
                        domProps={{ title: label}}>
                {label}
              </Checkbox>
            </li>
          );
        });
      }
      return (
        <div className={baseCls}>
          <ul className={`${baseCls}__list`}>
            {listItems}
          </ul>
          <div className={`${baseCls}__operation`}>
            <Button className={`${baseCls}__btn reset-btn`}
                    type="default"
                    shape="no-outline"
                    size="small"
                    label="重置"
                    onClick={this._onReset} />
            <Button className={`${baseCls}__btn confirm-btn`}
                    type="primary"
                    shape="no-outline"
                    size="small"
                    label="确定"
                    onClick={this._onConfirm} />
          </div>
        </div>
      );
    }
  }
  _onSelect(key, e) {
    let { checked } = e.target;
    let { selectedKeys } = this.state;
    let index = selectedKeys.indexOf(key);
    if (index == -1 && checked) {
      selectedKeys.push(key)
    } else if (index != -1 && !checked) {
      selectedKeys.splice(index, 1);
    }
    this.setState({ selectedKeys });
  }
  _onReset() {
    this.setState({ selectedKeys: [] });
  }
  _onConfirm(value) {
    let { showSearch } = this.state;
    if (showSearch) {
      this.setState({
        value
      }, () => {
        let { onConfirm } = this.props;
        onConfirm && onConfirm(value);
      });
    } else {
      let { onConfirm } = this.props;
      let { selectedKeys, showData } = this.state;
      onConfirm && onConfirm(showData.filter(d => selectedKeys.includes(d.value)));
    }
  }
  _onCancel() {
    let { onCancel } = this.props;
    onCancel && onCancel();
  }
  async _onFetchData(filter, callback) {
    let { showSearch } = this.state;
    if (showSearch) {
      let { model: { filterModel } } = this.props;
      let { onFetchData } = filterModel;
      if (isFunction(onFetchData)) {
        let res = await onFetchData(filter);
        this.setState({
          data: res,
          showData: this._getShowData(res, filterModel),
        }, isFunction(callback) && callback.bind(this, res));
      }
    } else {
      let { model: { filterModel } } = this.props;
      let { onFetchData } = filterModel;
      if (isFunction(onFetchData)) {
        try {
          this.setState({ loading: true });
          let res = await onFetchData();
          if (res) {
            this.setState({
              data: res,
              showData: this._getShowData(res, filterModel),
            });
          }
        } finally {
          this.setState({ loading: false });
        }
      }
    }
  }

  _getShowData(data, model) {
    let { idField, showField } = model;
    return (data || []).map(d => {
      return { ...d, label: d[showField], value: d[idField] };
    });
  }
}

export default MultiSelectFilter;
