import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import _ from 'lodash-compat';
import { findDOMNode } from 'react-dom';
import Button from '../button';
import { filterObject, getString, isEmptyString, getPattern, IconPrefixCls, noop, numberToEn, isFunction, getComponent } from '../util/data';
import { calculateNodeHeight } from '../util/dom';
// TODO  ICON 引入
//import Icon from '../icon';

// TODO number view 模式下支持千位符显示, 支持精确度
// 为得到连贯的逐帧动画，函数中必须重新调用 requestAnimationFrame()。
function onNextFrame(cb) {
  // 在页面重绘之前，通知浏览器调用一个指定的函数，并返回一个标识符
  if (window.requestAnimationFrame) {
    return window.requestAnimationFrame(cb);
  }
  return window.setTimeout(cb, 1);
}

// 取消标识符 nextFrameId 的回调函数
function clearNextFrameAction(nextFrameId) {
  if (window.cancelAnimationFrame) {
    window.cancelAnimationFrame(nextFrameId);
  } else {
    window.clearTimeout(nextFrameId);
  }
}

// 把数据处理成组件需要的数据
function getRenderValue(value, props) {
  let { type, toFixed } = props;
  if (isEmptyString(value)) {
    return getString(value);
  }
  if (type === "number") { // 如果是数字类型 且要精确小数
    if (value === '.') {
      value = '0.0';
    } else if (("" + value).startsWith('.') || ("" + value).endsWith('.')) {
      value = +value; // 如果是 .12, 自动补充成 0.12; 如果是 2., 自动处理成 2
    }
    if (_.isFunction(toFixed)) {
      value = toFixed(+value);
    } else if (!isEmptyString(toFixed) && +toFixed >= 0) {
      value = (+value).toFixed(toFixed);
    }
  }
  return value;
}

export default class Input extends Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    mode: PropTypes.oneOf(['default', 'view']),
    type: PropTypes.string,
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    size: PropTypes.oneOf(['default', 'small']),
    trigger: PropTypes.oneOf(['onBlur', 'onChange']),
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    pattern: PropTypes.any,
    validation: PropTypes.string,
    validator: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    addonBefore: PropTypes.node,
    addonAfter: PropTypes.node,
    autocomplete: PropTypes.oneOf(['on', 'off']),
    clearIcon: PropTypes.bool,
    focusAfterClear: PropTypes.bool,
    rows: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    unfold: PropTypes.bool,
    showCount: PropTypes.bool,
    maxLength: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    numberToEn: PropTypes.bool,
    toFixed: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.func]),
    overLengthValidation: PropTypes.string,
    cutIfDisMatchPattern: PropTypes.bool,
    cutIfOverLength: PropTypes.bool,
    autosize: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    fetchDataAction: PropTypes.func,
    emptyLabel: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onClear: PropTypes.func,
    domProps: PropTypes.object,
  };
  static defaultProps = {
    prefixCls: 'mt',
    mode: 'default',        // 设置控件的查看状态，可选值为 default|view 或者不设
    type: 'text',           // 声明 input 类型，可支持 text|textarea|number|password 默认为text
    value: '',              // 当前值
    defaultValue: '',       // 设置初始默认值
    size: null,             // 设置输入框大小，可选值为 small 或者不设
    trigger: 'onBlur',      // 触发 onChange 的时机，可选值为 onBlur|onChange
    placeholder: '',        // 默认提示
    disabled: false,        // 设置控件的禁用状态
    required: false,        // 是否必填
    pattern: null,          // 校验规则
    validation: '',         // 校验失败后的提示信息
    validator: null,        // 校验的配置
    addonBefore: null,      // 设置前置标签
    addonAfter: null,       // 设置后置标签
    clearIcon: true,        // 当前值不为空并且聚焦状态下，显示清空按钮，对 `type="textarea"` 无效
    focusAfterClear: true,  // 清空后是否使输入框获得焦点
    rows: 2,                // 默认显示的行数，只对 `type="textarea"` 有效
    rowsIfView: null,          // 只读时收起状态下显示的行数, 可以收起展开, 配合 `unfold` 使用，只对 `type="textarea"` 有效, 如果不设, 则使用 rows 属性
    showUnfold: false,      // 只读时是否显示展开收起, 如果设置的行数大于真实数据的行数, 则直接展开, 并不显示收起展开，只对 `type='textarea'` 有效
    defaultUnfold: false,   // 只读时是否默认展开, 如果设置的行数大于真实数据的行数, 则直接展开, 并不显示收起展开，只对 `type='textarea'` 有效
    showCount: false,       // 是否显示长度限制，只对 `type="textarea"` 有效
    maxLength: Infinity,        // 最大长度，不会截断文本，但会在校验出错时报错
    numberToEn: false,        // 是否只读时插入千分符，只对 `type="number"` 有效
    toFixed: null,        // 精确到小数点后几位，只对 `type="number"` 有效
    overLengthValidation: "超过最大字符数",        // 超过最大长度的提示
    cutIfOverLength: false, // 是否超过最大长度截断
    cutIfDisMatchPattern: false, // 是否不符合校验的字符截断
    autosize: false,        // 自适应内容高度，只对 `type="textarea"` 有效，`true` or `false` or `{ minRows: 2, maxRows: 6 }`
    emptyLabel: '',         // 只读时无值情况下显示的文本
    onChange: noop,         // 值改变时触发时间
    onFocus: noop,          // 获得焦点触发事件
    onBlur: noop,           // 失去焦点触发事件
    onClear: noop,           // 清空时触发的时间
    domProps: {},     // 需要传给 button 的原生属性
  };
  constructor(props){
    super(props);
    let value = getRenderValue(props.value, props);
    this._value = value;
    this.state = {
      valid: true,
      options: [],
      unfold: props.defaultUnfold,
      isEllipsis: false,
      activeIndex: null,
      value,
      explain: '',
      textareaStyles: null
    };
  }

  componentDidMount() {
    //只在这个时候来初始值
    if (!isEmptyString(this.props.defaultValue) && isEmptyString(this.state.value)) {
      var value = getRenderValue(this.props.defaultValue, this.props);
      this.setState({value: value}, this.resizeTextarea);
    } else {
      this.resizeTextarea();
    }
  }

  componentWillReceiveProps(nextProps) {
    // 设置 value 同步
    if(nextProps.hasOwnProperty('value') && nextProps.value !== undefined){
      let value = getRenderValue(nextProps.value, this.props);
      this.setState({value}, () => {
        this._value = value;
        // 如果需要的话,重新计算文本框的高度
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(()=>{ // 避免多次计算
          if (this.nextFrameActionId) {
            clearNextFrameAction(this.nextFrameActionId);
          }
          this.nextFrameActionId = onNextFrame(this.resizeTextarea);
        }, 300);
      });
    }
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  // 清空当前值
  _clearDataHandle = (e) => {
    const { onChange, onClear, focusAfterClear } = this.props;
    // 先触发清空, 再进行聚焦 (例如 select 在进行删除时, 先清空value, 再处理后续逻辑)
    this.setState({value: ''}, () => {
      this._value = "";
      // 输入框获得焦点
      if (focusAfterClear) {
        this.focus();
        this.validate('onChange');
      } else {
        this.validate('onBlur');
      }
    });
    !isEmptyString(this.props.value) && onChange('', e);
    onClear(e);
    // 阻止 input 发生点击事件
    e.stopPropagation();
  };

  // 失去焦点事件
  _blurHandle = (e) => {
    let value = getRenderValue(e.target.value, this.props);
    const { type, trigger, onBlur } = this.props;

    // 判断两次输入是否一样的
    if (this._value !== undefined && this._value === e.target.value) {
      this.validate('onBlur');
      onBlur(e);
      return;
    }
    this.setState({value, activeIndex: null}, () => {
      this._value = value;
      this.validate('onBlur');
    });
    // number 类型只能是onBlur派发
    if(value !== this.props.value && (type === 'number' || trigger === 'onBlur')){
      this.props.onChange(value, e);
    }
    onBlur(e);
  };

  // 输入框获得焦点
  _focusHandle = (e) => {
    const value = e.target.value;
    e.target.selectionStart = value.length;
    e.target.selectionEnd = value.length;
    this.setState({valid: true});
    this.props.onFocus(e);
  };

  // 键入数据时
  _changeHandle = (e) => {
    let value = e.target.value;
    const { type, trigger, onChange, cutIfOverLength, maxLength, cutIfDisMatchPattern, pattern } = this.props;
    if (value && pattern && cutIfDisMatchPattern) {  // 如果需要截止不符合校验的字符
      var regexp = getPattern(pattern);
      if (!regexp.test(value)) {
        return;
      }
    }
    if (type === 'number') {  // 数字类型需要处理非数字的截断、句号转换成小数点
      value = value.replace('。', '.');
      if (!/^\-?\d*(\.\d*)?$/.test(value)) {
        return;
      }
    }
    if (cutIfOverLength && value.length > maxLength) {
      // 输入/粘贴时截断
      value = value.substring(0, maxLength);
    }
    // number 类型只能是onBlur派发, 因为 toFixed 的处理在onChange就做了的话, 就没法用了
    if (type !== 'number' && trigger === 'onChange'){
      onChange(value, e);
    }
    this.setState({value}, () => {
      if (type === 'textarea') {
        this.resizeTextarea();
      }
      this.validate('onChange');
    });
  };
  // 切换展开状态
  _toggleUnfoldHandle = () => {
    let { unfold } = this.state;
    this.setState({unfold: !unfold});
  };

  // 渲染传入的绑定node 并显示错误信息 清空按钮
  renderLabledInput(children) {
    const { style, addonBefore, className, addonAfter, showCount, maxLength, clearIcon, disabled, mode, type, size } = this.props;
    const prefixCls = this.props.prefixCls + "-input";
    const { valid, explain, value } = this.state;
    const valueLength = value.length || 0;
    const wrapperClassName = classNames({
        [`${prefixCls}-group`]: true,
        [`${prefixCls}-group-sm`]: size === 'small',
    });
    const addonClassName = `${prefixCls}-group-addon`;

    const showClearIcon = type !== 'textarea' && clearIcon && mode !== 'view' && !disabled && !isEmptyString(value);
    const cls = classNames({
      [className]: !!className,
      [`${prefixCls}`]: true,
      [`${prefixCls}-${type}`]: true,
      [`${prefixCls}-sm`]: size === 'small',
      [`${prefixCls}-disabled`]: mode !== 'view' && disabled,
      [`${prefixCls}-${mode}`]: mode === 'view',
      'has-error': !valid
    });
    const showCountCls = classNames({
      [`${prefixCls}-showCount`]: true,
      [`${prefixCls}-showCount-overCount`]: valueLength > maxLength,
    });
    const content = <div className={`${prefixCls}-container ${showClearIcon ? (prefixCls + "-container-showClearIcon") : ""}`} style={style}>
      {children}
      {showClearIcon && <i className={`${prefixCls}-clearIcon ${IconPrefixCls} ${IconPrefixCls}-cross-circle`}
                           onClick={this._clearDataHandle}></i>}
    </div>;

    return (
      <div className={cls}>
        {(addonBefore || addonAfter) ? <div className={wrapperClassName}>
          {addonBefore && <span className={addonClassName}>{getComponent(addonBefore, value)}</span>}
          <span className={addonClassName + "-container"}>{content}</span>
          {addonAfter && <span className={addonClassName}>{getComponent(addonAfter, value)}</span>}
        </div> : <span>{content}</span>}
        {!valid && <span className={`has-explain ${prefixCls}-explain`}>{explain}</span>}
        {mode !== "view" && maxLength !== Infinity && maxLength && showCount && <span className={showCountCls}><i>{valueLength}</i>/{maxLength}</span>}
      </div>
    );
  }

  // 区别渲染 textarea 和其余类型(包括 password/text/number 等)
  renderInput() {
    const props = { ...this.props };
    let { prefixCls, size, type, mode, emptyLabel, placeholder, disabled, domProps,
      autosize, rows, showUnfold,
      toFixed } = props;
    prefixCls += "-input";
    let { value, unfold, isEllipsis, textareaStyles } = this.state;
    let inputClassName = classNames({
      [`${prefixCls}-${type}-autosize`]: type === 'textarea' && autosize,
    });

    if ('value' in props) {
      // Input elements must be either controlled or uncontrolled,
      // specify either the value prop, or the defaultValue prop, but not both.
      domProps.value = value;
      delete domProps.defaultValue;
    }
    if (mode === 'view' || disabled) {
      if (type === "number") { // 数字在只读时支持千分符显示
        props.numberToEn && (value = numberToEn(value, toFixed));
      }
      if (type === 'password') {
        value = ('' + value).replace(/./g, '*');
      }
      if (mode === 'view' && type === "textarea" && showUnfold) { // 只读时, 多文本输入框在只读时支持展开收起
        value = getString(value) || emptyLabel;
        return (
          <div className={`${prefixCls}-textarea-content ${(!unfold && isEllipsis) ? `${prefixCls}-textarea-content-ellipsis` : ''}`}>
            <div ref="content"
                 style={Object.assign({}, unfold ? null : textareaStyles)}>
              {value}
            </div>
            {isEllipsis && <Button type="primary"
                                   size="small"
                                   shape="no-outline"
                                   label={unfold ? "收起" : "展开"}
                                   icon={`angle-${unfold ? "up" : "down"}`}
                                   onClick={this._toggleUnfoldHandle} />}
          </div>
        );
      }
      if (isEmptyString(value) && !isEmptyString(emptyLabel)) {
        inputClassName += ` ${prefixCls}-empty`;
        value = emptyLabel;
      }
      if (mode !== 'view' && disabled && isEmptyString(value)) {
        inputClassName += ` ${prefixCls}-placeholder`;
        value = placeholder;
      }
      return (
        <div className={inputClassName}>{value}</div>
      );
    }

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...domProps}
            style={Object.assign({}, textareaStyles)}
            className={inputClassName}
            onBlur={this._blurHandle}
            onFocus={this._focusHandle}
            onChange={this._changeHandle}
            placeholder={placeholder}
            rows={rows}
            ref="input"
          />
        );
      default:
        return (
          <input
            {...domProps}
            type={type === 'number' ? 'text' : type}
            className={inputClassName}
            onBlur={this._blurHandle}
            onFocus={this._focusHandle}
            onChange={this._changeHandle}
            placeholder={placeholder}
            ref="input"
          />
        );
    }
  }

  render() {
    return this.renderLabledInput(this.renderInput());
  }

  /**
   * 响应校验事件  外部校验时所有的都触发
   * @param type 当前的校验时机
   * @returns {boolean} 返回校验后的结果
   */
  validate = (type) => {
    const { mode, maxLength, required, pattern, validation, overLengthValidation } = this.props;
    let flag = true;
    if (mode === "view") {
      !this.state.valid && this.setState({valid: true});
      return true;
    }
    let { validator } = this.props;
    // 在 onChange 及 onBlur 时去优先校验 required / pattern / maxLength
    if (type !== "onChange" && (required || pattern || maxLength)) {
      const preRules = [];
      required && preRules.push({required, message: validation});
      pattern && preRules.push({pattern, message: validation});
      maxLength !== Infinity && maxLength && preRules.push({maxLength, message: overLengthValidation});
      flag = this.doValidate(type, preRules);
    }
    if (flag && validator) {
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
        flag = this.doValidate(type, changeRule);
      } else if (type == "onBlur") {
        flag = this.doValidate(type, blurRule);
      } else {
        flag = this.doValidate(type, blurRule.concat(changeRule));
      }
    }
    this.forceUpdate();
    return flag;
  };

  /**
   * 响应校验的事件
   * @param rules 需要校验的规则集合
   */
  doValidate = (type, rules) => {
    var valid = true, rule, value = this.state.value, explain = "";
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
        if (prop === "validator" && _.isFunction(rule[prop])) {
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
      let resetValue = getRenderValue(this.props.defaultValue, this.props);
      this.setState({value: resetValue, valid: true, explain: "", options: []}, () => {
        this.props.onChange(resetValue);
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
   * 重新计算文本框的高度
   */
  resizeTextarea = () => {
    const { type, autosize, rows, rowsIfView, mode } = this.props;
    if (type !== "textarea") {
      return;
    }
    if (mode === "view") {
      let { unfold, isEllipsis, textareaStyles } = this.state;
      this.setState({unfold: true}, ()=>{ // 先展开, 去计算一下实际数据的高度
        let $content = findDOMNode(this.refs.content);
        if ($content) {
          let rect = $content.getBoundingClientRect();
          let height = parseFloat(window.getComputedStyle($content).getPropertyValue("line-height")) * (isEmptyString(rowsIfView) ? +rows : +rowsIfView);
          if (rect.height > height) { // 如果高度超过指定行数
            isEllipsis = true;
            textareaStyles = {height};
          } else {
            isEllipsis = false;
            textareaStyles = {};
          }
        }
        this.setState({unfold, isEllipsis, textareaStyles});
      });
      return;
    }
    if (!autosize || !this.refs.input) {
      return;
    }
    const minRows = autosize ? ((autosize || {}).minRows || rows) : null;
    const maxRows = autosize ? (autosize || {}).maxRows : null;
    let { textareaStyles } = this.state;
    this.setState({ textareaStyles: Object.assign({}, textareaStyles, { overflowY: 'hidden' }) }, () => {
      textareaStyles = calculateNodeHeight(this.refs.input, false, minRows, maxRows);
      this.setState({ textareaStyles: Object.assign({}, textareaStyles, { overflowY: 'auto' }) });
    });
  };

  /**
   * 使输入框获得焦点
   */
  focus = () => {
    this.refs.input && this.refs.input.focus();
  };
  /**
   * 使输入框失去焦点
   */
  blur = () => {
    this.refs.input && this.refs.input.blur();
  };
};
