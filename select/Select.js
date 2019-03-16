import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { findDOMNode } from 'react-dom';
import M from '../util';
import _ from 'lodash-compat';
import scrollIntoViewIfNeeded from '../util/shim/scrollIntoViewIfNeeded';
import { Checkbox } from '../checkbox';
import Trigger from '../trigger';
import {
  KEYCODE, IconPrefixCls,
  isFunction, isEmptyString, toArray, noop, getPattern, getString, getComponent,
  preventDefaultEvent, stopPropagationEvent
} from '../util/data';
import {
  getRenderValue, getShowValue, getShowData, calculateInputWidth,
  isSingleMode, isMultiUnCheckable, isAllSelectShow, isCheckboxShow, isFindInArray
} from './util';

let valueObjectShape;
let modelObjectShape;

if (PropTypes) {
  valueObjectShape = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      value: PropTypes.oneOfType[PropTypes.string, PropTypes.number],
      label: PropTypes.oneOfType[PropTypes.string, PropTypes.number],
    }),
  ]);
  modelObjectShape = PropTypes.shape({
    idField: PropTypes.string,
    showField: PropTypes.string,
    tpl: PropTypes.string,
    showTpl: PropTypes.string,
    format: PropTypes.function, // TODO 搜索图标
    height: PropTypes.oneOfType[PropTypes.number, PropTypes.string],
  })
}

class Select extends M.BaseComponent {
  static propTypes = {
    prefixCls: PropTypes.string,
    triggerClassName: PropTypes.string,
    mode: PropTypes.oneOf(['default', 'view']),
    combobox: PropTypes.bool,
    multiple: PropTypes.bool,
    unsearchable: PropTypes.bool,
    value: PropTypes.oneOfType([
      valueObjectShape,
      PropTypes.arrayOf(valueObjectShape),
    ]),
    defaultValue: PropTypes.oneOfType([
      valueObjectShape,
      PropTypes.arrayOf(valueObjectShape),
    ]),
    model: modelObjectShape,
    size: PropTypes.oneOf(['default', 'small']),
    trigger: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    validation: PropTypes.string,
    showCount: PropTypes.bool,
    maxLength: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    overLengthValidation: PropTypes.string,
    cutIfOverLength: PropTypes.bool,
    cutIfDisMatchPattern: PropTypes.bool,
    validator: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    clearIcon: PropTypes.bool,
    selectOnlyOptionAtBeginning: PropTypes.bool,
    selectFirstOptionAtBeginning: PropTypes.bool,
    focusAfterClear: PropTypes.bool,
    focusAfterSelect: PropTypes.bool,
    clearSearchwordAfterSelect: PropTypes.bool,
    notFoundContent: PropTypes.string,
    codesToShowFetchError: PropTypes.array,
    noCache: PropTypes.bool,
    noChangeIfDuplicated: PropTypes.bool,
    noSearchIfNoKeyword: PropTypes.bool,
    defaultActiveFirstOption: PropTypes.bool,
    delay: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    separator: PropTypes.string,
    checkbox: PropTypes.bool,
    allCheck: PropTypes.bool,
    emptyLabel: PropTypes.string,
    align: PropTypes.object,
    getPopupContainer: PropTypes.func,
    fetchDataAction: PropTypes.func,
    onFetchData: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onSelect: PropTypes.func,
    onDeselect: PropTypes.func,
    onSearch: PropTypes.func,
    onClear: PropTypes.func,
    onKeyDown: PropTypes.func,
    domProps: PropTypes.object,
    checkValueConstructor: PropTypes.bool,
  };
  static defaultProps = {
    prefixCls: 'mt',
    triggerClassName: "",   // 直接传给 trigger 的样式名称
    mode: 'default',        // 设置控件的查看状态，可选值为 default|view 或者不设
    combobox: false,        // 是否是联想模式
    multiple: false,        // 是否多选
    unsearchable: false,    // 不支持搜索
    model: {
      idField: 'value',
      showField: 'label',
    },             // 显示的配置
    size: null,             // 设置输入框大小，可选值为 small 或者不设
    trigger: 'onBlur',      // 触发 onChange 的时机，可选值为 onBlur|onChange, 只对 `combobox` 有效
    placeholder: '',        // 默认提示
    disabled: false,        // 设置控件的禁用状态
    required: false,        // 设置控件是否必填
    validation: null,       // 未填时的提示
    validator: null,        // 校验的配置, `validator` object态只对 `combobox` 有效
    clearIcon: true,        // 是否显示清空按钮
    selectOnlyOptionAtBeginning: false,   // 是否一开始就去获取数据, 并在只有一条时选中它
    selectFirstOptionAtBeginning: false,   // 是否一开始就去获取数据, 并选中第一条
    focusAfterClear: true,  // 清空后是否使输入框获得焦点
    focusAfterSelect: true,  // 选择一项后是否使输入框获得焦点
    clearSearchwordAfterSelect: false,  // 对 `multiple` 有效, 设置是否在选择一项后清空搜索关键字
    showCount: false,       // 是否显示长度限制，只对 `combobox` 有效
    maxLength: Infinity,        // 对 `multiple` 而言是指最大可选个数, 对 `combobox` 而言是指最大字符数
    overLengthValidation: "超过最大字符数",        // 超过最大字符限制, 只对 `combobox` 有效
    cutIfOverLength: false, // 是否超过最大长度截断, 只对 `combobox` 有效
    cutIfDisMatchPattern: false, // 是否不符合校验的字符截断, 只对 `combobox` 有效
    noChangeIfDuplicated: true, // 设置在选择同一项时不触发 onChange
    notFoundContent: '无数据', // 有搜索值时, 下拉列表为空显示的提示
    codesToShowFetchError: null, // 当搜索失败时结果中某些指定数据存在, 在弹框中显示失败的 message
    noCache: false, // 是否不缓存
    noSearchIfNoKeyword: false, // 空串不搜索
    defaultActiveFirstOption: false, //是否默认高亮第一个选项
    delay: 500,             // 延迟搜索，避免目标明确的输入多次联想
    separator: ",",        // 只读时的分隔符, 只对 `multiple` 有效
    checkbox: true,        // 是否显示 checkbox, 只对 `multiple` 有效, 如果设置为false, 则选择过的数据不会显示在列表里
    allCheck: false,        // 是否显示全选按钮, 配合 checkbox 一起使用, 只对 `multiple` 有效
    emptyLabel: '',        // mode 为 view 时,显示的文字
    getPopupContainer: null, // 弹出框要弹出到的父节点
    fetchDataAction: null,   // 键入搜索条件时搜索
    onFetchData: noop,   // 键入搜索条件时搜索
    onChange: noop,          // 值改变时触发事件
    onFocus: noop,           // 获得焦点触发事件
    onBlur: noop,            // 失去焦点触发事件
    onSelect: noop,          // 选择一项触发事件
    onDeselect: noop,        // 取消选择时触发的事件, 只对 `multiple` 有效
    onSearch: noop,          // 搜索时触发事件
    onClear: noop,           // 清空时触发事件
    onKeyDown: noop,         // 响应键盘敲击事件
    domProps: {},           // 传递给 input 原生的属性
    checkValueConstructor: true, // 是否需要检验数据的格式 label value 格式需要报警
  };

  constructor(props) {
    super(props);
    let { idField, showField } = props.model || {};
    if ((idField === "label" || showField === "value") && idField !== showField) {
      console.error("Select 中使用了 value 与 label, 请使用其他的属性作为 idField 和 showField");
    }
    if (props.fetchDataAction) {
      console.warn("Select 组件接收属性 fetchDataAction 请替换成 onFetchData");
    }
    this.warned = false;
    this.state = {
      value: getRenderValue(props.value, props, props.checkValueConstructor),
      searchword: '',
      data: [],
      showData: null,
      allSelect: false,
      visible: false,
      valid: true,
      fetchErrorMessage: ''
    }
  }

  componentWillMount() {
    const { defaultValue, checkValueConstructor } = this.props;
    if (defaultValue && !this.state.value) { // 只在这个时候来初始值
      checkValueConstructor && (this.warned = true);
      this.setState({value: getRenderValue(defaultValue, this.props, checkValueConstructor && !this.warned) || []});
    } else {
      this._selectOptionAtBeginningHandler();
    }
  }
  componentDidMount() {
    // 点击了非控件内区域  关闭弹窗
    this.removeMenu = (e) => {
      if (!this.state.visible || !this.refs.container) {
        return;
      }
      const popup = this.refs.trigger && this.refs.trigger.getPopupDOMNode();
      if (!(findDOMNode(this.refs.container).contains(e.target) || (popup && popup.contains(e.target)))) {
        this.hideDropdown();
      }
    };
    window.addEventListener('click', this.removeMenu, true);
    window.addEventListener('resize', this.resizeCalc, false);
    this.calculateNodeWidth();
  };

  componentWillReceiveProps(nextProps) {
    //如果有value设置同步
    if (nextProps.hasOwnProperty('value') && nextProps.value !== undefined) {
      this.props.checkValueConstructor && (this.warned = true);
      this.setState({value: getRenderValue(nextProps.value, this.props, this.props.checkValueConstructor && !this.warned)}, this.calculateNodeWidth);
    }
  }

  componentDidUpdate() {
    //每次组件更新重算input宽度，处理didMount时无滚动条之后又出现的情况
    //需要重置记忆的高度, 弹出框才能重新定位
    this.resizeCalc();
  }

  componentWillUnmount() {
    // 卸载后将延时器清掉
    this.timeout && clearTimeout(this.timeout);
    window.removeEventListener('click', this.removeMenu, true);
    window.removeEventListener('resize', this.resizeCalc, false);
  }
  resizeCalc = () => {
    let { multiple, disabled, mode } = this.props;
    if (disabled || mode === 'view') return;
    if (multiple) {
      // 先把input的宽度调小,这样外层的selection的宽度才是正常的, 避免屏幕缩小时算不对,避免trigger位置不对
      findDOMNode(this.refs.input).style.width = '50px';
      this._rememberSelectionHeight();
    }
    this.calculateNodeWidth();
  };
  calculateNodeWidth = () => {
    let { multiple, disabled, mode } = this.props;
    if (disabled || mode === 'view') return;
    if (multiple) {
      const { selection, trigger, input } = this.refs;
      calculateInputWidth(selection, input);
      if (selection.offsetHeight !== this.lastHeight || selection.offsetWidth !== this.lastWidth) {
        trigger.forceAlign();
      }
    }
  };

  // 供多选使用 记忆当前多选框的高度和宽度
  _rememberSelectionHeight = () => {
    let { offsetWidth, offsetHeight } = findDOMNode(this.refs.selection) || {};
    this.lastHeight = offsetHeight;
    this.lastWidth = offsetWidth;
  };

  /**
   * 获取默认的高亮条目
   */
  _getDefaultAO = () => {
    this._updateActiveOptionHandle(this.props.defaultActiveFirstOption ? 0 : null);
  };

  /**
   * 当前数据中全部被选中  高亮全选, 否则灰掉全选
   * @param {selectedArray} 当前已选中的条目
   * @param {showData} 当前可选的条目
   * @returns {boolean} 当前是否需要高亮全选
   */
  _isAllSelect = (selectedArray, showData) => {
    if (!isAllSelectShow(this.props)) {
      return;
    }
    showData = showData || this.state.showData || [];
    const value = selectedArray || this.state.value || [];
    return showData.every(v => value.some(item => item.value === v.value));
  };

  /**
   * 点击清空按钮 进行清空当前选中的值
   *  清除后使输入框再次获得焦点
   * @param e
   */
  _clearDataHandle = (e) => {
    let { multiple, combobox, focusAfterClear, onClear, onChange } = this.props;
    if (multiple) {
      return;
    }
    let value = combobox ? '' : getShowValue();
    this.setState({value, searchword: ''}, () => {
      if (focusAfterClear) {
        // 输入框获得焦点
        this._fetchDataHandle();
        this.focusInput();
      }
    });
    onClear && onClear(e);
    onChange && onChange(value, e);
    // 阻止 input 发生点击事件
    stopPropagationEvent(e);
  };

  /**
   * 搜索
   *  如果是联想模式, 同时改变它的 value, 并在 trigger 为 onChange 时触发响应校验
   * @param e
   */
  _changeHandle = (e) => {
    const { onSearch, trigger, combobox, multiple, onChange, maxLength, cutIfOverLength, cutIfDisMatchPattern, pattern } = this.props;
    let state = {...this.state};
    let value = _.cloneDeep(state.value);
    if (multiple && (value || []).length >= maxLength) {
      return;
    }
    var searchword = e.target.value;
    if (combobox) {
      if (pattern && cutIfDisMatchPattern) {  // 如果需要截止不符合校验的字符
        var regexp = getPattern(pattern);
        if (regexp && !regexp.test(searchword)) {
          return;
        }
      }
      value = searchword;
      if (cutIfOverLength && searchword.length > maxLength) {
        // 输入/粘贴时截断
        value = searchword.substring(0, maxLength);
      }
    }
    this.setState({searchword, value}, () => {
      this._fetchDataHandle(searchword, () => {
        onSearch(searchword, e);
        combobox && this.validate("onChange");
      });
    });
    combobox && trigger === 'onChange' && onChange(value, e);
  };

  /**
   * 单选和联想模式的选择  选择后关闭下拉窗
   * @param index 当前选中条目在下拉选项中的索引
   * @param e
   */
  _selectHandle = (index, callback, e) => {
    const { combobox, onSelect, onChange, noChangeIfDuplicated } = this.props;
    const state = {...this.state};
    let value = (state.showData || [])[index];
    if (!value) {
      return;
    }
    if (combobox) {
      value = value.label;
    } else {
      if (noChangeIfDuplicated && isSingleMode(this.props) && getShowValue(state.value).value === value.value) { // 单选并且选择了同一项
        this.hideDropdown();
        callback && callback();
        onSelect(value, e);
        return;
      }
    }
    this.setState({value}, () => {
      this.hideDropdown();
      callback && callback();
      if (combobox) {
        this.validate('onChange');
        this.validate('onBlur');
      }
    });
    onSelect(value, e);
    onChange(value, e);
  };

  /**
   * 多选模式的选择
   *  如果有设置 checkbox, 选择后删除这条数据,删除后恢复这条数据
   * @param index 当前选中条目在下拉选项中的索引
   * @param e
   * @private valueIndex 当前传入的条目在已选择的集合中的索引
   */
  _multiSelectHandle = (index, callback, e) => {
    let { allSelect, searchword } = this.state;
    const { checkbox, onChange, onSelect, maxLength, clearSearchwordAfterSelect, focusAfterSelect } = this.props;
    let value = _.cloneDeep(this.state.value || []), showData = (this.state.showData || []).slice();
    let item = showData[index];
    if (!item) { // 无数据 enter 时, item 为 undefined
      return;
    }
    var valueIndex = value.findIndex(v => v.value === item.value);
    if (valueIndex !== -1) { // 删除已选择的条目
      this._multiDeSelectHandle(valueIndex, e);
    } else { // 添加一条选项
      if (isEmptyString(item.value)) { // 如果快速双击, 第二次的点击也会处理一遍添加的逻辑, 此时做一下保护
        return;
      }
      const currentLength = value.length;
      if (currentLength + 1 > maxLength) {
        return;
      }
      value = currentLength > 0 ? value.concat(item) : [item];
      // 如果没有 checkbox, 选择后这一条数据筛选掉
      if (!checkbox) {
        showData.splice(index, 1);
      }
      allSelect = this._isAllSelect(value);
      let oldSearch = searchword;
      clearSearchwordAfterSelect && (searchword = "");
      this.setState({value, showData, searchword, allSelect}, () => {
        //this.resizeCalc();  componentDidUpdate 监听数据的改变
        if (clearSearchwordAfterSelect && oldSearch) {
          this._fetchDataHandle();
        }
        callback && callback();
      });
      onSelect(item, e);
      onChange(value, e);
    }
    focusAfterSelect && this.focusInput();
  };

  /**
   * 取消选中某项
   *  如果没有设置 checkbox, 取消选择后会将这一条数据显示在列表里
   * @param index 删除的条目在当前选中的集合中的索引
   * @param e 当前事件
   * @param callback 回调函数
   */
  _multiDeSelectHandle = (index, e, callback) => {
    let { allSelect, data } = this.state;
    let value = _.cloneDeep(this.state.value || []), showData = (this.state.showData || []).slice();
    if (!value[index]) {
      return;
    }
    const { onChange, onDeselect, checkbox, model } = this.props;
    // 如果没有 checkbox, 删除后将这一条数据渲染出来
    var option = value[index];
    value.splice(index, 1);
    const newData = data.filter(v => showData.some(item => item.value === v[model.idField]) || v[model.idField] === option.value);
    if (!checkbox) {
      showData = getShowData(newData, this.props, value);
    }
    allSelect = this._isAllSelect(value);
    this.setState({value, showData, allSelect}, () => {
      //this.resizeCalc();  componentDidUpdate 监听改变
      _.isEmpty(this.state.showData) && this._fetchDataHandle();
      callback && callback();
    });
    onChange(value, e);
    onDeselect(option, e);
  };

  /**
   * 点击删除按钮删除已选中的条目 并校验有效性
   * @param index 删除的条目在当前选中的集合中的索引
   */
  _removeHandle = (index, e) => {
    this._multiDeSelectHandle(index, e, this.validate);
    stopPropagationEvent(e);
  };

  /**
   * 全选/全不选
   * @param checked 是否当前在全选状态
   */
  _allSelectHandle = (checked) => {
    let { allSelect, showData } = this.state;
    let value = _.cloneDeep(this.state.value || []);
    allSelect = !checked;
    if (value.length === 0) {
      value = checked ? [] : showData || [];
    } else {
      if (!checked) {
        value = value.concat((showData || []).filter(v => value.every(opt => opt.value !== v.value)));
      } else {
        value = value.filter(opt => (showData || []).every(v => v.value !== opt.value));
      }
    }
    const { onChange } = this.props;
    this._rememberSelectionHeight();
    this.setState({value, allSelect}, () => {
      this.calculateNodeWidth();
    });
    onChange(value);
  };

  /**
   * 关闭弹窗 并清空搜索关键字
   *  对于多选模式, 只做校验
   *  对于单选模式, 如果没有选择值的话, 会把 focus 时置成提示的值再重新置回来
   *  对于联想模式, 会把当前选择的值转换成 string 传递出去, 如果有设置 trigger 为 onBlur 的话, 会触发相应的校验事件
   * @param e
   */
  _blurHandle = (e) => {
    const { multiple, combobox, onChange, onBlur, trigger } = this.props;
    if (multiple) {
      onBlur(e);
      return;
    }
    let value = _.cloneDeep(this.state.value || []);
    if (combobox) {
      value = getShowValue(value).value;
    }
    this.setState({value}, () => {
      if (combobox) {
        // 联想类型需要处理校验
        this.validate("onBlur");
      }
    });
    combobox && trigger === 'onBlur' && onChange(value, e);
    onBlur(e);
  };

  /**
   * 显示弹窗 并判断是否重新获取下拉列表的数据
   *  对于单选模式, 将当前选中的值置成 placeholder 提示显示
   * @param e
   */
  _focusHandle = (e) => {
    const { combobox, onFocus, noCache } = this.props;
    let { showData, value, searchword } = this.state;
    let filter = combobox ? value : searchword;
    this.searching = true;
    this._rememberSelectionHeight();
    this.setState({visible: true, valid: true}, () => {
      if (noCache || !showData) {
        this._fetchDataHandle(filter || "", () => {
          this.calculateNodeWidth();
          onFocus(e);
        });
      } else {
        this.calculateNodeWidth();
        onFocus(e);
      }
    });
  };

  /**
   * 获取数据 延时搜索,并在搜索时显示转圈loading
   *  多选情况下,如果超过可选条数,则不发搜索请求
   * @param filter 搜索关键字
   * @param callback 回调函数
   * @private
   */
  _fetchDataHandle = (filter, callback) => {
    const { multiple, fetchDataAction, onFetchData, delay, maxLength, align, noSearchIfNoKeyword, codesToShowFetchError } = this.props;
    if (noSearchIfNoKeyword && isEmptyString(filter)) {
      return;
    }
    if (multiple && (this.state.value || []).length + 1 > maxLength) {
      return;
    }
    let showLoading = delay > 0; // 如果 delay === 0, 直接不显示 loading 转圈
    this._updateActiveOptionHandle();
    this.setState({loading: showLoading}, ()=>{
      showLoading && align && this.refs.trigger.forceAlign();
    });
    this.timeout && clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      (fetchDataAction || onFetchData)(filter || '', this.raceSafe((data) => {
        showLoading && Object.assign(this.state, {loading: false});
        Object.assign(this.state, {fetchErrorMessage: ''});
        this.fillOptions(data, callback);
      }, 'fetchData'), this.raceSafe((res) => {
        showLoading && Object.assign(this.state, {loading: false});
        if (Array.isArray(codesToShowFetchError) && _.isObject(res)) {
          Object.assign(this.state, {fetchErrorMessage: (isFindInArray(codesToShowFetchError, res) && res.message) || ''});
        }
        this.fillOptions([], callback);
      }, 'fetchDataFailed'));
    }, delay);
  };
  /**
   * 一开始就去获取数据并选中一项
   */
  _selectOptionAtBeginningHandler = () => {
    if (!this._isSelectOptionAtBeginning()) return;
    // 去获取数据, 判断是否只有一条, 如果是, 选中
    this._fetchDataHandle("", () => {
      let { selectOnlyOptionAtBeginning, selectFirstOptionAtBeginning } = this.props;
      let showData = this.state.showData || [], length = showData.length;
      if ((selectOnlyOptionAtBeginning && length === 1) || (selectFirstOptionAtBeginning && length > 0)) {
        let firstOption = showData[0];
        if (!firstOption.value) {
          return;
        }
        this.setState({value: firstOption});
        this.props.onChange(firstOption);
      }
    });
  };
  _isSelectOptionAtBeginning = () => {
    return !this.state.value && isSingleMode(this.props) && (this.props.selectOnlyOptionAtBeginning || this.props.selectFirstOptionAtBeginning);
  };

  /**
   * 键选
   *  多选状态下  如果没有关键字时  delete键会执行删除操作
   * @param e
   */
  _keyDownHandle = (e) => {
    const props = this.props;
    let { multiple, onKeyDown } = props;
    let { value, showData, loading } = {...this.state};
    let triggerContent = this.refs.triggerContent;
    onKeyDown = onKeyDown && onKeyDown.bind(null, e);
    if (e.keyCode !== KEYCODE.BACKSPACE && !triggerContent) {
      onKeyDown && onKeyDown();
      return;
    }
    let activeOption = triggerContent ? triggerContent.getActiveOption() : null;
    showData = showData || [];
    const length = (showData || []).length;
    switch (e.keyCode) {
      case KEYCODE.BACKSPACE:
        // 多选时当前搜索框里没值时, 删除按钮可删除最近选择的条目
        multiple && !e.target.value && value && value.length > 0 && this._multiDeSelectHandle(value.length -1, e);
        break;
      case KEYCODE.ARROW_UP:
        if (activeOption === null) {
          activeOption = 0;
        } else {
          activeOption = activeOption === 0 ? length - 1 : activeOption - 1;
        }
        this._updateActiveOptionHandle(activeOption, () => {
          var ele = findDOMNode(triggerContent.refs["option_" + activeOption]);
          ele && ele.scrollIntoViewIfNeeded(false);
        });
        onKeyDown(showData[activeOption]);
        break;
      case KEYCODE.ARROW_DOWN:
        if (activeOption === null) {
          activeOption = 0;
        } else {
          activeOption = activeOption === length - 1 ? 0 : activeOption + 1;
        }
        this._updateActiveOptionHandle(activeOption, () => {
          var ele = findDOMNode(triggerContent.refs["option_" + activeOption]);
          ele && ele.scrollIntoViewIfNeeded(false);
        });
        onKeyDown(showData[activeOption]);
        break;
      case KEYCODE.ENTER:
        if (loading || activeOption === null || length === 0) {
          onKeyDown();
          return;
        }
        if (multiple) {
          this._multiSelectHandle(activeOption, null, e);
          onKeyDown(showData[activeOption]);
        } else {
          this._selectHandle(activeOption, null, e);
          onKeyDown(showData[activeOption]);
          setTimeout(this.blurInput, 0);
        }
        break;
      default:
        onKeyDown();
    }
  };

  /**
   * 更新焦点
   *  当鼠标进入时 清除上下键焦距的条目
   *  上下键选时, 使获得焦点的选项可见
   * @param e
   */
  _updateActiveOptionHandle = (index, callback) => {
    let ref = this.refs.triggerContent;
    if (!ref) {
      return;
    }
    ref.setActiveOption && ref.setActiveOption(index);
    index != null && callback && callback();
  };

  // 渲染输入框
  renderSelect() {
    let { prefixCls, size, disabled, placeholder, mode, clearIcon, combobox, emptyLable, multiple, unsearchable, noSearchIfNoKeyword, domProps } = this.props;
    let { value, visible, searchword, valid } = this.state;
    prefixCls = prefixCls + '-select' + (multiple ? '-multiple' : '');
    unsearchable = !combobox && unsearchable;
    const showAngleDown = isSingleMode(this.props) && (!noSearchIfNoKeyword || (this.searching && !isEmptyString(searchword)));
    let outerCls = classNames({
      [`${prefixCls}-input`]: true,
      [`${prefixCls}-input-unsearchable`]: unsearchable,
      [`${prefixCls}-input-disabled`]: mode !== 'view' && disabled,
      [`${prefixCls}-input-sm`]: size === 'small',
      [`${prefixCls}-input-angle`]: showAngleDown,
      'has-error': !valid,
    });

    value = multiple ? value : getShowValue(value);
    let showLabel = '';
    if (multiple) { // 多选  一直显示搜索关键字
      showLabel = searchword;
    } else if (combobox) {
      showLabel = value.label;
    } else { // 单选, 搜索时显示搜索关键字, 否则显示选中项的文本
      showLabel = value.label;
      placeholder = "";
    }
    const showClear = !multiple && !disabled && clearIcon && !isEmptyString(value.value);

    if ( mode === 'view' || disabled) {
      showLabel = getString(showLabel) || emptyLable;
      if (disabled && (multiple ? (value || []).length === 0 : isEmptyString(showLabel))){
        outerCls += ` ${prefixCls}-placeholder`;
        showLabel = this.props.placeholder;
      }
      return <div className={outerCls}>
        {showLabel || '\xa0'}
        {mode !== 'view' && showAngleDown && <i className={`${prefixCls}-arrow ${IconPrefixCls} ${IconPrefixCls}-angle-down`}></i>}
      </div>
    }

    const arrowHandler = !disabled && (visible ? this.hideDropdown : this.focusInput);
    return (
      <div className={outerCls} ref="inputWrap" title={multiple ? '' : showLabel}>
        {(unsearchable || isSingleMode(this.props)) && <div ref={multiple ? "input" : "label"} className={classNames({
      [`${prefixCls}-searching`]: this.searching,
      [`${prefixCls}-placeholder`]: (!unsearchable && this.searching) || !showLabel,
      [`${prefixCls}-label`]: true
    })} onClick={this._focusHandle}>
          {searchword ? '' : showLabel || this.props.placeholder}
        </div>}
        {!unsearchable && <input {...domProps}
          ref="input"
          value={isSingleMode(this.props) ? searchword : showLabel || ''}
          placeholder={placeholder}
          disabled={disabled}
          onChange={this._changeHandle}
          onBlur={this._blurHandle}
          onFocus={this._focusHandle}
          onKeyDown={this._keyDownHandle}
        />}
        {showClear && <i className={`${prefixCls}-input-clearIcon ${IconPrefixCls} ${IconPrefixCls}-cross-circle`}
                         onClick={this._clearDataHandle}></i>}
        {showAngleDown && <i className={`${prefixCls}-arrow ${IconPrefixCls} ${IconPrefixCls}-angle-down`} onClick={arrowHandler}></i>}
      </div>
    );
  }

  // 渲染多选
  renderMultiSelect() {
    let { disabled, mode, prefixCls, emptyLabel, separator } = this.props;
    let { value } = this.state;
    prefixCls = prefixCls + '-select-multiple';
    const outerCls = classNames({
      [`${prefixCls}-selection`]: true,
    });
    const hasValue = (value || []).length > 0;
    if (mode === 'view') {
      var showLabel = hasValue ? value.map(v => v.label).join(separator + " ") : emptyLabel;
      return (
        <div className={outerCls}>{showLabel}</div>
      )
    }
    return (
      <div className={outerCls} ref="selection" onClick={this.focusInput}>
        {hasValue && <ul>
          {value.map((v, k) => <li key={k} onClick={stopPropagationEvent}>
            <span>{v.label}</span>
            {!disabled && <i className={`${prefixCls}-delete ${IconPrefixCls} ${IconPrefixCls}-cross`}
                             onClick={this._removeHandle.bind(this, k)}></i>}
          </li>)}
        </ul>}
        {this.renderSelect(prefixCls)}
      </div>
    )
  };

  render() {
    const props = {...this.props};
    let { prefixCls, triggerClassName, className, size, disabled, style, mode, combobox, multiple, maxLength, showCount,
      getPopupContainer, align,
      notFoundContent, noSearchIfNoKeyword } = props;
    let { visible, valid, explain, showData, loading, searchword, value, fetchErrorMessage } = this.state;
    prefixCls += '-select' + (multiple ? '-multiple' : '');
    const showTrigger = mode !== 'view' && !disabled;

    const cls = classNames({
      [`${prefixCls}`]: true,
      [`${prefixCls}-combobox`]: combobox,
      [`${prefixCls}-sm`]: size === 'small',
      [`${prefixCls}-${mode}`]: mode === 'view',
      [`${prefixCls}-disabled`]: mode !== 'view' && disabled,
      [`${prefixCls}-visible`]: visible,
      [className]: className,
      'has-error': !valid
    });
    const hasData = (showData || []).length > 0;
    if (visible) {
      if (!hasData && (combobox || (!loading && isEmptyString(notFoundContent)))) { // 联想输入框没数据时, 或者 notFoundContent 为空且无数据时, 都不显示下拉窗
        visible = false;
      }
      if (this.searching && isEmptyString(combobox ? value : searchword) && noSearchIfNoKeyword) { // noSearchIfNoKeyword 为 true 而关键字为空时不显示下拉窗
        visible = false;
      }
    }
    let countContent;
    if (combobox && mode !== "view" && showCount) { // 联想输入框编辑态实时计数
      value = getShowValue(value);
      let labelLength = value.label.length;
      let showCountCls = combobox && classNames({
          [`${prefixCls}-showCount`]: true,
          [`${prefixCls}-showCount-overCount`]: labelLength > maxLength,
        });
      countContent = <span className={showCountCls}><i>{labelLength}</i>/{maxLength}</span>;
    }
    return (
      <div className={cls} style={style} ref="container">
        {multiple ? this.renderMultiSelect() : this.renderSelect()}
        {countContent}
        {!valid && <span className={`has-explain ${prefixCls}-explain`}>{explain}</span>}
        {showTrigger && <Trigger visible={visible}
                                 className={triggerClassName}
                                 align={align}
                                 ref="trigger"
                                 autoDestory={align ? align.autoDestory : true}
                                 equalTargetWidth={align ? align.equalTargetWidth : true}
                                 getPopupContainer={getPopupContainer}
                                 target={()=>findDOMNode(this)}>
          <Select.TriggerContent {...props} {...this.state} loading={loading}
                                                            parent={this}
                                                            notFoundContent={fetchErrorMessage || notFoundContent}
                                                            ref="triggerContent"/>
        </Trigger>}
      </div>
    )
  }

  /**
   * 校验 外部校验时所有的都触发
   * @param type 校验的时机
   * @returns {boolean}
   */
  validate = (type) => {
    const { mode, required, pattern, maxLength, overLengthValidation, validation, multiple, combobox } = this.props;
    let { validator } = this.props;
    if (mode === 'view') {
      !this.state.valid && this.setState({valid: true});
      return true;
    }
    var flag = true, value = this.state.value, explain = '';
    //非空校验和自定义校验

    if (type !== "onChange" && required) {
      let noValue = false;
      if (multiple) {
        noValue = toArray(value).length === 0;
      } else if (combobox) {
        noValue = !value;
      } else {
        noValue = !value || isEmptyString(getShowValue(value).value);
      }
      if (noValue) {
        explain = validation || '';
        flag = false;
      }
    }
    if (flag && type !== "onChange" && combobox) {
      const preRules = [];
      pattern && preRules.push({pattern, message: validation});
      maxLength !== Infinity && maxLength && preRules.push({maxLength, message: overLengthValidation});
      flag = this.doValidate(type, preRules);
    }

    if (flag && validator) {
      //自定义校验
      if (combobox) {
        if (isFunction(validator)) {
          validator = {
            "onBlur": [
              {validator: this.props.validator}
            ]
          }
        }
        var blurRule = validator['onBlur'] || [];
        var changeRule = validator['onChange'] || [];
        if (type == "onChange") {
          this.doValidate(type, changeRule);
        } else if (type == "onBlur") {
          this.doValidate(type, blurRule);
        } else {
          this.doValidate(type, blurRule.concat(changeRule));
        }
        this.forceUpdate();
        return this.state.valid;
      }
      if (isFunction(validator)) {
        explain = this.props.validator(value);
      }
      //返回字符串 不为空表示校验没通过 且返回错误提示
      if (!isEmptyString(explain)) {
        flag = false;
      } else {
        explain = '';
      }
    }
    this.state.explain = explain;
    this.state.valid = flag;
    this.forceUpdate();
    return flag;
  };
  /**
   * 响应校验的事件 只对 combobox 类型有效
   * @param rules 需要校验的规则集合
   */
  doValidate = (type, rules) => {
    if (!this.props.combobox) {
      return;
    }
    var valid = true, rule, value = getShowValue(this.state.value).value, explain = "";
    for (var i = 0; i < rules.length; i += 1) {
      rule = rules[i];
      // required不为空  whitespace不全为空串  pattern正则表达式  validator 校验不通过提示message
      for (var prop in rule) {
        //必填项校验
        if (prop === "required" && rule[prop]) {
          if (isEmptyString(value)) {
            valid = false;
            explain = rule['message'];
            break;
          }
        }
        //全为空校验
        if (prop === "whitespace" && rule[prop]) {
          if (value.trim() === "") {
            valid = false;
            explain = rule['message'];
            break;
          }
        }
        //正则校验
        if (prop === "pattern") {
          var pattern = getPattern(rule[prop]);
          if (pattern && !pattern.test(value)) {
            valid = false;
            explain = rule['message'];
            break;
          }
        }
        //最大长度校验
        if (prop === "maxLength") {
          if ((value || "").length > rule[prop]) {
            valid = false;
            explain = rule['message'];
            break;
          }
        }
        //自定义校验
        if (prop === "validator" && isFunction(rule[prop])) {
          explain = rule[prop](value);
          //返回字符串 不为空表示校验没通过 且返回错误提示
          if (!isEmptyString(explain)) {
            valid = false;
            break;
          } else {
            explain = "";
          }
        }
      }
      if(!valid){
        break;
      }
    }
    // onBlur 后如果校验通过  就去记忆最近一次 onChange 后的校验结果
    if (type === "onChange") {
      this.rememberExplain = {valid, explain};
    } else if (valid && this.rememberExplain) {
      // 如果当前的校验通过了, 记忆之前的校验状态
      explain = this.rememberExplain.explain;
      valid = this.rememberExplain.valid;
    }
    this.setState({explain, valid});
    return valid;
  };

  /**
   * 重置控件，清空数据并清空校验状态
   */
  reset = () => {
    if (this.props.mode !== "view") {
      let resetValue = getRenderValue(this.props.defaultValue, this.props) || null;
      this._getDefaultAO();
      this.clearOption();
      this.setState({value: resetValue, valid: true, explain: "", showData: null, data: [], allSelect: false, searchword: ''}, () => {
        if (this._isSelectOptionAtBeginning()) {
          this._selectOptionAtBeginningHandler();
        } else {
          this.props.onChange(resetValue);
        }
      });
    }
  };

  /**
   * 清空异常状态，校验提示等
   */
  clear = () => {
    this.setState({valid: true, explain: ""});
  };

  /**
   * 清空下拉数据
   */
  clearOption = () => {
    this.setState({
      data: [],
      showData: null,
      allSelect: false,
      fetchErrorMessage: ''
    });
  };

  /**
   * 刷新数据
   * @param data 需要刷新成的数据
   * @param callback 回调函数
   */
  fillOptions = (data, callback) => {
    let { value } = this.state;
    const showData = getShowData(data, this.props, value);
    this._getDefaultAO();
    this.setState({
      data,
      showData,
      allSelect: this.props.multiple ? this._isAllSelect(value, showData) : false
    }, ()=>{
      this.props.align && (this.props.align.points || this.props.align.overflow) && this.refs.trigger.forceAlign();
      callback && callback();
    });
  };
  /**
   * 获取当前的下拉可选项
   */
  getOptions = () => {
    return this.state.showData;
  };

  /**
   * 使输入框获得焦点
   */
  focusInput = () => {
    const input = findDOMNode(this.refs.input);
    (input && input.focus) ? input.focus() : this._focusHandle();
  };

  /**
   * 使输入框失去焦点
   */
  blurInput = () => {
    const input = findDOMNode(this.refs.input);
    input && input.blur && input.blur();
  };

  /**
   * 隐藏弹窗
   */
  hideDropdown = () => {
    var oldsearch = this.state.searchword;
    this.searching = false;
    this.setState({visible: false, searchword: ''}, () => {
      this.timeout && clearTimeout(this.timeout);
      this._getDefaultAO();
      oldsearch && this.clearOption();
      this.validate();
    });
  };
}

// 渲染弹出框中的内容
// TODO 文字超长时不折行只省略  并添加 toolTips 来显示全文
class TriggerContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeOption: props.defaultActiveFirstOption ? 0 :null
    }
  }
  render() {
    let props = this.props;
    let { parent, loading, showData, value, allSelect, prefixCls, model, multiple, combobox, notFoundContent, maxLength, size, ellipsis } = props;
    let { activeOption } = this.state;
    prefixCls = prefixCls + '-select' + (multiple ? '-multiple' : '');

    const hasData = (showData || []).length > 0;
    if (!hasData && combobox) {  // 如果没有数据  联想模式不显示下拉框
      return null;
    }

    const outerCls = classNames({
      [`${prefixCls}-dropdown`]: true,
      [`${prefixCls}-dropdown-sm`]: size === 'small',
    });

    if (loading) { // 加载中
      return (
        <div className={outerCls} style={{maxHeight: model.height || 'auto'}}>
          <ul className={`${prefixCls}-list`}>
            <li className={`${prefixCls}-loading`}>
              <i className={`${IconPrefixCls} ${IconPrefixCls}-loading`}></i>
            </li>
          </ul>
        </div>
      );
    }
    if (multiple && (value || []).length + 1 > maxLength) { // 超过最大可选条数
      return (
        <div className={outerCls} style={{maxHeight: model.height || 'auto'}}>
          <ul className={`${prefixCls}-list`}>
            <li className={`${prefixCls}-outLength`} onClick={parent.hideDropdown}>您最多只能选择{maxLength}条</li>
          </ul>
        </div>
      );
    }
    if (!hasData) { // 没有数据
      return (
        <div className={outerCls} style={{maxHeight: model.height || 'auto'}}>
          <ul className={`${prefixCls}-list`}>
            <li className={`${prefixCls}-notfound`} onClick={parent.hideDropdown}>{notFoundContent}</li>
          </ul>
        </div>
      );
    }
    return (
      <div className={outerCls} ref="container" style={{maxHeight: model.height || 'auto'}}>
        {isAllSelectShow(props) && (
          <div className={`${prefixCls}-allCheck`}
               onClick={parent._allSelectHandle.bind(this, allSelect)}>
            <Checkbox size={size} checked={allSelect} /><span>全选</span>
          </div>
        )}
        <ul className={`${prefixCls}-list`}>
          {(showData || []).map((v, k) => {
            const isMultipleOptionActive = multiple && (value || []).some(item => item.value === v.value);
            // FIXME ellipsis 超长是否省略显示
            const liCls = classNames({
              'active': value && (multiple ? (allSelect || isMultipleOptionActive) : value.value === v.value),
              'focus': activeOption === k,
              [`${prefixCls}-ellipsis`]: ellipsis
            });
            let showLabel = "";
            if (model.format) {
              showLabel = getComponent(model.format, {...v, index: k});
            } else {
              var _showLabel = model.tpl ? M.template(model.tpl, v) : v[model.showField];
              showLabel = <div title={_showLabel}>{_showLabel}</div>;
            }
            return (
              <li key={k}
                  onClick={parent[multiple ? '_multiSelectHandle' : '_selectHandle'].bind(null, k, null)}
                  className={liCls}
                  onMouseEnter={this.setActiveOption.bind(this, k)}
                  ref={'option_' + k}>
                {isCheckboxShow(props) ? <Checkbox prefixCls={prefixCls}
                                                   size={size}
                                                   checked={!!isMultipleOptionActive}>{showLabel}</Checkbox> : showLabel}
              </li>
            )
          })}
        </ul>
      </div>
    );
  }

  setActiveOption = (activeOption) => {
    this.setState({activeOption});
  };
  getActiveOption = () => {
    return this.state.activeOption;
  }
}

Select.TriggerContent = TriggerContent;

export default Select;
