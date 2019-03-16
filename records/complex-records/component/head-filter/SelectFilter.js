import React from 'react';
import M from '../../../../util';
import Input from '../../../../input';
import { isFunction, isArray } from 'lodash-compat';
import Icon from '../../../../icon';
import { getComponent } from '../../../../util/data';

class SelectFilter extends M.BaseComponent {
  static defaultProps = {
    delay: 500,
  };
  constructor(props) {
    super(props);
    let { model } = props;
    let { filteredFullValue, filters, filterModel } = model || {};
    //如果有传入onFetchData，则默认不使用filters的数据
    let data = isFunction(filterModel.onFetchData)? [] : (isArray(filters)? filters.slice() : []);
    Object.assign(this.state, {
      data,
      showData: this._getShowData(data, filterModel),
      value: filteredFullValue && filteredFullValue[0] || null,
      keyword: '',
      loading: false,
      showSearch: filterModel.showSearch, //是否显示搜索框
    });
  }
  componentDidMount() {
    //如果不显示搜索框，则在组件刚加载时获取数据
    if (!this.state.showSearch) {
      this._fetchData();
    } else {
      //FIXME 直接调用会使得页面滚动到顶部
      this.setTimeout(() => {
        this.refs.input.focus();
      }, 0);
    }
  }
  componentWillReceiveProps(nextProps) {
    let { model } = nextProps;
    let { filteredFullValue } = model || {};
    this.setState({
      value: filteredFullValue && filteredFullValue[0] || null,
    });
  }
  render() {
    let { model } = this.props;
    let { filterModel } = model || {};
    let { placeholder, format } = filterModel || {};
    let { value: v, keyword, showData, loading, showSearch } = this.state;
    let baseCls = 'select-filter';

    let listItems;
    if (loading) {
      listItems = (
        <li className={`${baseCls}__loading`}>
          <Icon className={`${baseCls}__loading-icon`} type="loading" />
        </li>
      );
    } else if (!showSearch && (!showData || showData.length == 0)) {
      //既不显示搜索框又没有data的时候，也非loading时
      return null;
    } else {
      listItems = (showData || []).map((d, i) => {
        let { label, value } = d;

        return (
          <li key={i}
              className={M.classNames(`${baseCls}__item`, {
                active: value == (v && v.value),
              })}
              onClick={this._onClick.bind(this, d, i)}
              title={label}>
            {format ? getComponent(format, d) : label}
          </li>
        );
      });
    }

    return (
      <div className={baseCls}>
        {showSearch && (
          <div className={baseCls}>
            <Input ref="input"
                   className={`${baseCls}__input`}
                   size="small"
                   value={keyword}
                   placeholder={placeholder}
                   trigger="onChange"
                   onChange={this._onChange} />
          </div>
        )}
        <ul className={`${baseCls}__list`}>
          {listItems}
        </ul>
      </div>
    );
  }
  _onClick(v) {
    let { onConfirm } = this.props;
    onConfirm && onConfirm(v);
  }
  _onChange(keyword) {
    this.setState({ keyword }, () => {
      this.timeout && clearTimeout(this.timeout);
      this.timeout = this.setTimeout(this._fetchData, this.props.delay);
    });
  }
  async _fetchData() {
    let { keyword } = this.state;
    let { model: { filterModel } } = this.props;
    let { onFetchData, noSearchIfNoKeyword } = filterModel;
    if (isFunction(onFetchData) && (!noSearchIfNoKeyword || keyword.length !== 0)) {
      try {
        this.setState({ loading: true });
        let res = await onFetchData(keyword);
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
  _getShowData(data, model) {
    let { idField, showField } = model;
    return (data || []).map(d => {
      return { ...d, label: d[showField], value: d[idField] };
    });
  }
}

export default SelectFilter;
