import { findDOMNode } from 'react-dom';
import { isObject, isEmpty } from 'lodash-compat';
import { isEmptyString, buildMultiSelectData, buildSelectData } from '../util/data';
import M from '../util';

// 是否是单选下拉
export function isSingleMode(props) {
  return !props.combobox && !props.multiple;
}

// 是否多选下拉显示选项框
export function isCheckboxShow(props) {
  return props.multiple && props.checkbox;
}
// 是否多选下拉不显示选项框
export function isMultiUnCheckable(props) {
  return props.multiple && !props.checkbox;
}

// 是否显示全选
export function isAllSelectShow(props) {
  return isCheckboxShow(props) && props.allCheck;
}

// 来处理接收的value
export function getRenderValue(value, props = {}, needWarn) {
  const { model, multiple, combobox } = props;
  if (multiple) {
    if (Array.isArray(value) && value.length > 0) {
      value = buildMultiSelectData({model}, value, needWarn);
    } else {
      return [];
    }
  } else if (!combobox) {
    if (isEmptyString(value)) {
      return null;
    }
    value = buildSelectData({model}, value, needWarn);
  }
  return value;
}

// 来自控件内部的数据
export function getShowValue(value) {
  if (isEmptyString(value)) {
    return {
      label: '',
      value: ''
    }
  }
  // 智能提示模式
  if (typeof value === 'string') {
    return {
      label: value,
      value: value
    }
  }
  return value;
}

// 来处理从后端获取到的可选项
export function getShowData(data, props = {}, value = []) {
  if (Array.isArray(data) && data.length > 0) {
    const { model, multiple, checkbox } = props;
    let item = [];
    (data || []).forEach(v => {
      // 对于多选来说  如果不显示checkbox, 则筛掉已选择的条目
      if (value && multiple && !checkbox && value.find(opt => opt.value === (v[model.idField] || v))) {
        return;
      } else if (typeof v === 'string') {
        item.push({
          label: v,
          value: v
        });
      } else {
        item.push({
          ...v,
          value: v[model.idField],
          label: model.showTpl ? M.template(model.showTpl, v) : v[model.showField]
        });
      }
    });
    return item;
  }
  return [];
}

/**
 * 获取要传递出去的value
 * @param model  select 的模板
 * @param showData  当前的可选项
 * @param value  当前选中的值
 * @returns {*}
 */
export function getServerValue(model, showData, value) {
  if (Array.isArray(value)) { // 如果是多选
    return buildMultiSelectData({model}, value);
  } else if (_.isObject(value)) { // 如果是单选
    return buildSelectData({model}, value);
  } else if (typeof(value) === "string") {
    return value;
  }
}

/**
 * 计算输入框的宽度, 只对 `multiple` 可编辑的时候有效
 * @param container 组件
 * @return {Boolean} 是否高度有变化
 */
export function calculateInputWidth(container, input) {
  const $container = findDOMNode(container);
  if (!$container) {
    return;
  }
  const $input = input ? findDOMNode(input) : $container.querySelector('input');
  if (!$input) {
    return;
  }
  var width = $container.getBoundingClientRect().width - 25; // 减去container 的 padding 及 border 及可能出现的滚动条
  const $selectedList = $container.querySelector('ul');
  if ($selectedList) {
    let sum = 0, $list = Array.from($selectedList.querySelectorAll('li'));
    // 计算每个 li 的宽度
    $list.forEach(($li, index) => {
      // 加6是由于 li 有margin
      var _liWidth = $li.getBoundingClientRect().width + 4; // 4: li 的margin
      var _plus = _liWidth + sum;
      if (index === $list.length - 1) { // 如果是最后一个元素, 判断是那种情况
        if (_plus > width) { // 需要这个元素去换行
          if (_liWidth + 50 > width) { // 需要 input 去换行(50: input 的最小宽度)
            sum = 0;
          } else {
            sum = _liWidth;
          }
        } else if (_plus + 50 > width) { // 需要 input 去换行(50: input 的最小宽度)
          sum = 0;
        } else { // 谁都不用换行
          sum = _plus;
        }
      } else {
        if(_plus > width){ // 需要这个元素去换行
          sum = _liWidth;
        } else { // 谁都不用换行
          sum = _plus;
        }
      }
    });
    // 4: input 的 margin
    $input.style.width = (width - sum - 4) + 'px';
  } else {
    $input.style.width = (width - 4) + 'px';
  }
}

/**
 * 是否在嵌套的数组里找到某个元数据
 * @param array 嵌套的数组 [1,'2',{'a': '1', 'b': ['2']}]
 * @param res
 * @returns {boolean|*}
 */
export function isFindInArray(array, res) {
  return !isEmpty(res) && Array.isArray(array) && array.length > 0 && array.some(prop => {
    if (['string', 'number'].some(v => v === (typeof prop))) {
      return prop === res.code;
    } else if (isObject(prop) && !isEmpty(prop)) {
      return Object.keys(prop).some(p => {
        if (['string', 'number'].some(v => v === (typeof prop[p]))) {
          return prop[p] === res[p];
        } else if (Array.isArray(prop[p]) && prop[p].length > 0) {
          return prop[p].some(v => v === res[p]);
        }
      })
    }
  });
}
