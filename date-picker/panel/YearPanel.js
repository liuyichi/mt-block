import React, { Component, PropTypes } from 'react';
import M from '../../util';
import classNames from 'classnames';
import { IconPrefixCls as iconPrefixCls } from '../../util/data';

//FIXME
let basicPrefixCls = 'year-panel';
let getCls = (prefix, basic, suffix) => {
  return [`${prefix}-${basic}`, basic].map((item) => `${item}${suffix}`).join(' ');
};

/**
 * 显示年份日历
 * props.value
 * props.prefixCls
 * props.onSelect
 * props.onSwitch
 * props.disabledYear = (year) => { return true|false } //开一个入口，日后可能有用
 *
 */
class YearPanel extends Component {
  static propTypes = {
    value: PropTypes.number,
    prefixCls: PropTypes.string,
    onSelect: PropTypes.func,
    onSwitch: PropTypes.func,
    disabledYear: PropTypes.func,
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
        {this._getYearContent()}
      </div>
    );
  }

  _getYearContent() {
    let { value, onSelect, onSwitch, prefixCls, disabledYear } = this.props;

    //className
    let contentCls = getCls(prefixCls, basicPrefixCls, '-content');
    let dataWrapperCls = getCls(prefixCls, basicPrefixCls, '-data-wrapper');
    let dataCls = getCls(prefixCls, basicPrefixCls, '-data');

    let date = new Date(value);
    let sYear = Number(Math.floor(date.getFullYear()/10) + '0');

    //年份数据
    let years = [];
    for (let i = 0; i < 10; i++) {
      years.push(sYear + i);
    }

    date.setTime(value);
    let yearBtns = years.map((item, i) => {
      let isDisabled = !!disabledYear && disabledYear(item);
      return (
        <div key={i + 1}
             className={classNames(dataWrapperCls, {
               'selected-year': item == date.getFullYear(),
               'disabled-year': isDisabled,
             })}>
          <div className={dataCls} onClick={!isDisabled && onSelect.bind(this, item)}>
            {item}
          </div>
        </div>
      );
    });

    //向前切年份
    yearBtns.unshift(
      <div key={0}
           className={`${dataWrapperCls} ${prefixCls}-${basicPrefixCls}-left-switcher`}>
        <div className={M.classNames(dataCls, `${iconPrefixCls} ${iconPrefixCls}-angle-left`)}
             onClick={onSwitch.bind(this, -1)}></div>
      </div>
    );
    //向后切年份
    yearBtns.push(
      <div key={yearBtns.length}
           className={`${dataWrapperCls} ${prefixCls}-${basicPrefixCls}-right-switcher`}>
        <div className={M.classNames(dataCls, `${iconPrefixCls} ${iconPrefixCls}-angle-right`)}
             onClick={onSwitch.bind(this, 1)}></div>
      </div>
    );

    let numberOfRows = 4;
    let numberOfColumns = 3;
    let rows = [];
    for (let i = 0; i < numberOfRows; i++) {
      let everyRow = yearBtns.slice(
        i * numberOfColumns, (i + 1) * numberOfColumns);
      rows.push(everyRow);
    }

    let yearContent = rows.map((row, i) => {
      return <div key={i} className={`${prefixCls}-${basicPrefixCls}-row`}>{row}</div>;
    });

    return (
      <div className={contentCls}>
        {yearContent}
      </div>
    );
  }
}

export default YearPanel;
