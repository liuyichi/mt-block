import React, { Component, PropTypes } from 'react';
import M from '../../util';
import strftime from 'strftime';
import { noop } from 'lodash-compat';

//FIXME
let basicPrefixCls = 'time-panel';
let getCls = (prefix, basic, suffix) => {
  return [`${prefix}-${basic}`, basic].map((item) => `${item}${suffix}`).join(' ');
};
let fix2Digits = (s) => {
  return ('0' + s).slice(-2);
};
const HOUR_VALUES = new Array(24).fill(0).map((item, i) => fix2Digits(i));
const MINUTE_VALUES = new Array(60).fill(0).map((item, i) => fix2Digits(i));
const SECOND_VALUES = new Array(60).fill(0).map((item, i) => fix2Digits(i));

/**
 * 时间面板
 * props.value
 * props.format = '%H:%M' //'%H:%M'|'%H:%M:%S'
 * props.disabledHours = () => { return [] } //禁用的 时 数组
 * props.disabledMinutes = (hour) => { return [] } //禁用的 分钟 数组
 * props.disabledSeconds = (hour, minute) => { return [] } //禁用的 秒 数组
 * props.hideDisabledOptions = false //是否隐藏禁止的选项
 * props.onSelect
 *
 */
class TimePanel extends Component {
  static propTypes = {
    value: PropTypes.string,
    prefixCls: PropTypes.string,
    disabledHours: PropTypes.func,
    disabledMinutes: PropTypes.func,
    disabledSeconds: PropTypes.func,
    hideDisabledOptions: PropTypes.bool,
    onSelect: PropTypes.func,
  };

  static defaultProps = {
    prefixCls: 'mt',
    format: '%H:%M',
    hideDisabledOptions: false,
    disabledHours: noop,
    disabledMinutes: noop,
    disabledSeconds: noop,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || this._initTime(props.format),
    };
  }

  componentWillReceiveProps(nextProps) {
    let { value } = this.state;
    if (nextProps.hasOwnProperty('value')) {
      value = nextProps.value || this._initTime(nextProps.format);
    }
    this.setState({ value });
  }

  render() {
    //className
    let { prefixCls } = this.props;
    let panelCls = getCls(prefixCls, basicPrefixCls, '');

    return (
      <div className={panelCls}>
        {this._getContent()}
      </div>
    )
  }

  _getContent() {
    let { prefixCls, format, hideDisabledOptions,
      disabledHours, disabledMinutes, disabledSeconds } = this.props;
    let { value } = this.state;

    //className
    let optionsBasicCls = getCls(prefixCls, basicPrefixCls, '-time-options');
    let optionsCls = 'options';

    let valueSplit = value.split(':');
    let options = [], hourValue = valueSplit[0], minuteValue = valueSplit[1], secondValue = valueSplit[2];
    if (format.indexOf('%H') !== -1) {
      optionsCls += '-hour';
      options.push(
        <OptionList key={options.length}
                    data={HOUR_VALUES}
                    prefixCls={prefixCls}
                    hideDisabledOptions={hideDisabledOptions}
                    value={hourValue}
                    disabledData={(disabledHours() || []).map(fix2Digits)}
                    onSelect={this._selectHour.bind(this)} />
      );
    }

    if (format.indexOf('%M') !== -1) {
      optionsCls += '-minute';
      options.push(
        <OptionList key={options.length}
                    data={MINUTE_VALUES}
                    prefixCls={prefixCls}
                    hideDisabledOptions={hideDisabledOptions}
                    value={minuteValue}
                    disabledData={(disabledMinutes(hourValue) || []).map(fix2Digits)}
                    onSelect={this._selectMinute.bind(this)} />
      );
    }

    if (format.indexOf('%S') !== -1) {
      optionsCls += '-second';
      options.push(
        <OptionList key={options.length}
                    data={SECOND_VALUES}
                    prefixCls={prefixCls}
                    hideDisabledOptions={hideDisabledOptions}
                    value={secondValue}
                    disabledData={(disabledSeconds(Number(hourValue), Number(minuteValue)) || []).map(fix2Digits)}
                    onSelect={this._selectSecond.bind(this)} />
      );
    }

    return (
      <div className={`${optionsBasicCls} ${optionsCls}`}>
        {options}
      </div>
    );
  }

  _selectHour(h) {
    let { value } = this.state;
    value = value.replace(/^\d+?(:\d+?(?::\d+)?)?$/, `${h}$1`);
    this.setState({ value }, this._selectHandler);
  }

  _selectMinute(m) {
    let { value } = this.state;
    value = value.replace(/^(\d+?:)\d+?((?::\d+)?)$/, `$1${m}$2`);
    this.setState({ value }, this._selectHandler);
  }

  _selectSecond(s) {
    let { value } = this.state;
    value = value.replace(/^(\d+?:\d+?:)\d+?$/, `$1${s}`);
    this.setState({ value }, this._selectHandler);
  }

  _selectHandler() {
    let { onSelect } = this.props;
    onSelect && onSelect(this.state.value);
  }

  _initTime(format) {
    let date = new Date();
    let result = [date.getHours(), date.getMinutes()];
    if (format.indexOf('%S') !== -1) {
      result.push(date.getSeconds());
    }

    return result.map(fix2Digits).join(':');
  }
}

/**
 * 简易选项列表
 * props.value //列表当前值
 * props.data //列表数据
 * props.disabledData //禁用数据
 * props.hideDisabledOptions //是否隐藏禁用数据
 * props.onSelect //选中事件派发
 *
 */
class OptionList extends Component {
  static defaultProps = {
    prefixCls: 'mt',
    onSelect: noop,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || undefined,
    };
  }

  componentDidMount() {
    this._scrollToTop();
  }

  componentWillReceiveProps(nextProps) {
    let { value } = this.state;
    if (nextProps.hasOwnProperty('value')) {
      value = nextProps.value || undefined;
    }
    this.setState({ value }, this._scrollToTop);
  }

  render() {
    let { prefixCls, data, disabledData, hideDisabledOptions } = this.props;

    //className
    let containerCls = getCls(prefixCls, basicPrefixCls, '-option-list');
    let optionItemCls = getCls(prefixCls, basicPrefixCls, '-option-item');

    let { value } = this.state;
    let lis = (data || []).map((item, i) => {
      let isDisabled = !!(disabledData && disabledData.includes(item));
      let isSelected = item == value;
      return (
        <li key={i} ref={(j) => { isSelected && (this.$selectedLi = j) }}
            className={M.classNames(optionItemCls, {
              [`option-item-selected`]: isSelected,
              [`option-item-disabled`]: isDisabled,
              [`option-item-disabled-hide`]: isDisabled && hideDisabledOptions,
        })} onClick={!isDisabled && this._selectItem.bind(this, item)}>{item}</li>
      );
    });
    return (
      <div className={containerCls}>
        <ul ref="ul">{lis}</ul>
      </div>
    );
  }

  _selectItem(value) {
    this.setState({ value }, () => {
      this._scrollToTop();
      let { onSelect } = this.props;
      onSelect(this.state.value);
    });
  }

  _scrollToTop() {
    let $ul = this.refs.ul;
    this.$selectedLi && ($ul.scrollTop = this.$selectedLi.offsetTop);
  }
}

export default TimePanel;
