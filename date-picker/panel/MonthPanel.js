import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

let basicPrefixCls = 'month-panel';
let getCls = (prefix, basic, suffix) => {
  return [`${prefix}-${basic}`, basic].map((item) => `${item}${suffix}`).join(' ');
};

/**
 * 显示月份日历
 * props.value
 * props.prefixCls
 * props.onSelect
 * props.disabledMonth
 *
 */
class MonthPanel extends Component {
  static propTypes = {
    value: PropTypes.number,
    prefixCls: PropTypes.string,
    onSelect: PropTypes.func,
    disabledMonth: PropTypes.func,
  };

  static defaultProps = {
    prefixCls: 'mt',
  };

  render() {
    //className
    let { prefixCls } = this.props;
    let panelCls = getCls(prefixCls, basicPrefixCls, '');

    return (
      <div className={panelCls}>
        {this._getMonthContent()}
      </div>
    );
  }

  _getMonthContent() {
    let { value, onSelect, prefixCls, disabledMonth } = this.props;

    //className
    let contentCls = getCls(prefixCls, basicPrefixCls, '-content');
    let dataWrapperCls = getCls(prefixCls, basicPrefixCls, '-data-wrapper');
    let dataCls = getCls(prefixCls, basicPrefixCls, '-data');

    //月份数据
    let months = [];
    for (let i = 0; i < 12; i++) {
      months.push(i);
    }

    let date = new Date(value);
    let numberOfRows = 4;
    let numberOfColumns = 3;
    let rows = [];
    for (let i = 0; i < numberOfRows; i++) {
      let rowParts = months.slice(
        i * numberOfColumns, (i + 1) * numberOfColumns);
      let everyRow = rowParts.map((item, i) => {
        let isDisabled = !!disabledMonth && disabledMonth(item);
        return (
          <div key={i}
               className={classNames(dataWrapperCls, {
                 'selected-month': item == date.getMonth(),
                 'disabled-month': isDisabled,
               })}>
            <div className={dataCls} onClick={!isDisabled && onSelect.bind(this, item)}>
              {`${item + 1}月`}
            </div>
          </div>
        );
      });
      rows.push(everyRow);
    }

    let monthContent = rows.map((row, i) => {
      return <div key={i} className={`${prefixCls}-${basicPrefixCls}-row`}>{row}</div>;
    });

    return (
      <div className={contentCls}>
        {monthContent}
      </div>
    );
  }
}

export default MonthPanel;
