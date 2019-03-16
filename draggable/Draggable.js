import React, { PropTypes } from 'react';
import M from '../util';
import SortableMixin from './react-mixin-sortablejs/react-mixin-sortable';
import { isArray, isFunction } from 'lodash-compat';

/**
 * options参数参考https://github.com/RubaXa/Sortable
 */

let defaultOptions = {
  group: 'name',
  sort: false,
  delay: 0,
  disabled: false,
  animation: 150,
  preventOnFilter: true,
  ghostClass: 'mt-draggable__ghost',
  chosenClass: 'mt-draggable__chosen',
  dragClass: "mt-draggable__drag",
  forceFallback: false,
  fallbackClass: 'mt-draggable__fallback',
  fallbackOnBody: false,
  fallbackTolerance: 0,
  scroll: true,
  scrollSensitivity: 30,
  scrollSpeed: 10,
};

class Draggable extends M.BaseComponent.Mixin(SortableMixin) {
  static propTypes = {
    prefixCls: PropTypes.string,
    data: PropTypes.array,
    dataControled: PropTypes.bool,
    options: PropTypes.shape({
      group: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({
        name: PropTypes.string,
        pull: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['clone']), PropTypes.func]),
        put: PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.string), PropTypes.func]),
        revertClone: PropTypes.bool,
      })]),
      sort: PropTypes.bool,
      delay: PropTypes.number,
      disabled: PropTypes.bool,
      animation: PropTypes.number,
      handle: PropTypes.string,
      filter: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      preventOnFilter: PropTypes.bool,
      ghostClass: PropTypes.string,
      chosenClass: PropTypes.string,
      dragClass: PropTypes.string,

      scroll: PropTypes.bool,
      scrollFn: PropTypes.func,
      scrollSensitivity: PropTypes.number,
      scrollSpeed: PropTypes.number,

      forceFallback: PropTypes.bool,
      fallbackClass: PropTypes.string,
      fallbackOnBody: PropTypes.bool,
      fallbackTolerance: PropTypes.number,

      setData: PropTypes.func,
      onStart: PropTypes.func,
      onEnd: PropTypes.func,
      onAdd: PropTypes.func,
      onClone: PropTypes.func,
      onFilter: PropTypes.func,
      onChoose: PropTypes.func,
      onSort: PropTypes.func,
      onRemove: PropTypes.func,
      onMove: PropTypes.func,
    }),
    format: PropTypes.func,
    idField: PropTypes.string,
    itemClass: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  };

  static defaultProps = {
    prefixCls: 'mt',
    options: {},
    dataControled: false,
    format: null,
    idField: '',
    itemClass: '',
  };

  constructor(props) {
    super(props);
    let { options, data } = props;
    Object.assign(this.state, {
      items: this._format(data || [], props),
    });
    let eventOptions = {};
    'onStart onEnd onAdd onClone onFilter onChoose onUpdate onSort onRemove onMove'.split(' ').forEach((name) => {
      eventOptions[name] = (...args) => {
        if (name == 'onChoose') {
          //把选中的数据写在实例上
          let { items } = this.state;
          this._sortableInstance.data = items[args[0].oldIndex].value;
        }
        options[name] && options[name](this._packData(args[0]), ...args);
      }
    });
    this.sortableOptions = Object.assign({}, defaultOptions,
      options, {
        ref: 'instance', //拖拽或放置功能的实例
        model: 'items', //渲染和传入SortableMixin的字段一致，因为SortableMixin内部会对这个状态进行处理
        dataIdAttr: 'data-id',
        stateHandler: '_handleNewSortableState',
      }, eventOptions);
  }

  componentWillReceiveProps(nextProps) {
    let { items } = this.state;
    if (nextProps.hasOwnProperty('data')) {
      items = this._format(nextProps.data || [], nextProps);
    }
    this.setState({ items });
  }

  render() {
    let { prefixCls, format, itemClass, options: { disabled } } = this.props;
    let { items } = this.state;
    return (
      <ul ref="instance"
           className={this.classNames(`${prefixCls}-draggable`, {
             [`${prefixCls}-draggable--disabled`]: disabled,
           })}>
        {items.map((item, index) => {
          let { key, value } = item;
          let children = typeof format === 'function' ? format(value, key, index, items) : value;
          let props = { 'data-id': key, key };
          return children.type !== 'li' ? (
            <li {...props} children={children}
                className={M.classNames(`${prefixCls}-draggable__item item-${key}`, isFunction(itemClass) ? itemClass(value, key, index) : itemClass)} />
          ) : (
            React.cloneElement(children, props)
          );
        })}
      </ul>
    );
  }

  /**
   * 格式化传入的数据为Object { key, value }
   * @param data
   * @param props
   * @private
   */
  _format(data, props) {
    let { idField } = props;
    let ts = Date.now();
    return data.map((item, index) => {
      //如果不设置idField，就以 [时间戳_索引] 为键值
      return {
        key: idField? item[idField] : `${ts}_${index}`,
        value: item,
      };
    });
  }

  _packData(e) {
    let { to, from, oldIndex, newIndex } = e;
    let toSortable = this._searchInstance(to);
    let fromSortable = this._searchInstance(from);
    return {
      to: toSortable, //源Sortable
      from: fromSortable, //目标Sortable
      oldIndex,
      newIndex,
      data: fromSortable.data, //当前移动的数据
    };
  }

  _searchInstance(ele) {
    let k = Object.keys(ele).find(k => k.startsWith('Sortable'));
    return ele[k];
  }

  _handleNewSortableState(state) {
    let { onChange, dataControled } = this.props;
    !dataControled && this.setState(state);
    if (onChange != null) {
      onChange(state.items.map(x => x.value));
    }
  }

  getInstance() {
    return this._sortableInstance;
  }

  setOption(name, value) {
    Object.assign(this.sortableOptions, { [name]: value });
    this._sortableInstance.option(name, value);
  }

  getOption(name) {
    return this._sortableInstance.option(name);
  }

  toArray() {
    return this._sortableInstance.toArray();
  }

  sort(order) {
    let { items } = this.state;
    let map = {};
    items.forEach(i => {
      map[i.key] = i;
    });
    let newItems = order.map(o => {
      return map[o];
    });
    this.setState({ items: newItems });
    this._sortableInstance.sort(order);
  }
}

export default Draggable;
