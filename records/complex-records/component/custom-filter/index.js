import React from 'react';
import M from '../../../../util';
import Input from '../../../../input';
import Checkbox from '../../../../checkbox';
import Button from '../../../../button';
import Icon from '../../../../icon';
import Draggable from '../../../../draggable';

import './index.scss';

class CustomFilter extends M.BaseComponent {
  constructor(props) {
    super(props);
    const data = (props.data || []).map(item => {
      return { ...item };
    });
    Object.assign(this.state, {
      keyword: '',
      data,
      showData: data.slice(),
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      const data = (nextProps.data || []).map(item => {
        return { ...item };
      });
      this.setState({
        data,
        showData: data.slice(),
      })
    }
  }

  render() {
    const baseCls = `custom-filter`;
    const { custom } = this.props;
    const { keyword, showData } = this.state;

    const draggableProps = {
      className: `${baseCls}__list`,
      data: showData,
      idField: 'code',
      itemClass: `${baseCls}__list-item`,
      options: {
        sort: true,
        onUpdate: (dragInfo) => {
          const { data: d, oldIndex, newIndex } = dragInfo;
          const { data } = this.state;
          data.splice(oldIndex, 1);
          data.splice(newIndex, 0, d);
          this.setState({ data, showData: data.slice() });
        },
      },
      format: (item, key, index, array) => {
        const { label, code, show } = item;
        return (
          <div key={code}>
            <Checkbox className={`${baseCls}__item-checkbox`}
                      checked={show}
                      onChange={this._toggleSelected.bind(this, index)}>
              {label}
            </Checkbox>
            {!keyword && <Icon className={`${baseCls}__item-drag-icon`} type="round-bars" />}
          </div>
        );
      },
    };

    return (
      <div className={baseCls}>
        <div className={`${baseCls}__search`}>
          <Input value={keyword}
                 size="small"
                 trigger="onChange"
                 placeholder="搜索列表选项"
                 onChange={this._onKeywordChange}/>
        </div>
        <Draggable {...draggableProps} />
        <div className={`${baseCls}__operation`}>
          <div className={`${baseCls}__operation__custom`}>{custom}</div>
          <div className={`${baseCls}__operation__base`}>
            <Button className={`${baseCls}__operation__base-btn`}
                    size="small" label="取消" onClick={this._cancel} />
            <Button className={`${baseCls}__operation__base-btn`}
                    size="small" type="primary" label="确定" onClick={this._confirm} />
          </div>
        </div>
      </div>
    );
  }

  _onKeywordChange(keyword) {
    const { data } = this.state;
    const showData = this._filterData(data, keyword);
    //根据keyword过滤展示的数据
    this.setState({ keyword, showData });
  }

  _filterData(data, keyword) {
    return data.filter(item => {
      return item.label.indexOf(keyword) != -1;
    });
  }

  _cancel() {
    const { onCancel } = this.props;
    onCancel && onCancel();
  }

  _confirm() {
    const { data } = this.state;
    const { onConfirm } = this.props;
    onConfirm && onConfirm(data);
  }

  _toggleSelected(index, e) {
    const { checked } = e.target;
    let { data, showData, keyword } = this.state;
    data.find(item => item.code == showData[index].code).show = checked;
    showData = this._filterData(data, keyword);
    this.setState({ data, showData });
  }
}

export default CustomFilter;
