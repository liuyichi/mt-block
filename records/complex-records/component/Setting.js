import React from 'react';
import { findDOMNode } from 'react-dom';
import M from '../../../util';
import Icon from '../../../icon';
import Trigger from '../../../trigger';
import { isString, pick as _pick } from 'lodash-compat';
import CustomFilter from './custom-filter';
import Popover from './popover';

/**
 * 设置按钮组
 */
class Setting extends M.BaseComponent.Mixin(M.ContextMixin('records')) {
  render() {
    let { className: baseCls, model } = this.props;
    if (model == null) return null;
    let listItems = [];
    // 如果设置组超过三个，则后面的需要合并显示省略号
    if (model.length > 3) {
      for (let i = 0; i < 2; i++) {
        listItems.push(
          <li key={i} className={`${baseCls}__item`}>
            {this.renderIcon(model[i])}
          </li>
        );
      }
      listItems.push(
        <li key="more" className={`${baseCls}__item`}>
          {this.renderIcon({
            code: 'more',
            label: '更多',
            icon: 'ellipsis',
            subIcons: model.slice(2).map(item => this.renderIcon(item)),
          })}
        </li>
      );
    } else {
      listItems = model.map((m, i) => {
        return (
          <li key={i} className={`${baseCls}__item`}>
            {this.renderIcon(m)}
          </li>
        );
      });
    }
    return (
      <div className={this.classNames()}>
        <ul className={`${baseCls}__list`}>
          {listItems}
        </ul>
      </div>
    );
  }

  async action(columns, model, ...args) {
    let action = model.action;
    if (action == null) return null;
    await action(this, columns, model, ...args);
  }

  renderIcon(model) {
    let { className: baseCls } = this.props;
    let { code, icon, action, Component, label } = model;

    //如果没有传入action和Component并且是defaultAction，则渲染相应的
    if (!action && !Component && this.defaultIcons[code]) {
      let Component = this.defaultIcons[code];
      return <Component model={model} className={`${baseCls}__icon`} />;
    }

    if (Component) {
      return React.isValidElement(Component)? Component : <Component />;
    } else {
      let { records } = this.context;
      let props = {
        onClick: this.action.bind(this, records._getColumns(), model),
      };
      return isString(icon)? <Icon className={`${baseCls}__icon`} type={icon} domProps={props} />
        : (React.isValidElement(icon)? icon : label);
    }
  }

  defaultIcons = {
    'heading': HeadingIcon,
    'more': MoreIcon,
  }
}

class MoreIcon extends M.BaseComponent.Mixin(M.ContextMixin('records')) {
  constructor(props) {
    super(props);
    Object.assign(this.state, {
      showPopover: false,
    });
  }
  componentDidMount() {
    this.windowEventListener('click', (e) => {
      let { showPopover } = this.state;
      let { container, trigger } = this.refs;
      let triggerNode = trigger.getPopupDOMNode();
      if (showPopover
        && !findDOMNode(container).contains(e.target)
        && !triggerNode.contains(e.target)) {
        this._togglePopover(false);
      }
    });
  }
  render() {
    let { model } = this.props;
    let { icon, label } = model;
    let { showPopover } = this.state;
    let props = {
      onClick: this._togglePopover.bind(this, !showPopover),
    };
    return (
      <div ref="container" className={this.classNames('more-icon')}>
        {isString(icon)? <Icon className="more-icon__icon" type={icon}
                               domProps={props} />
          : (React.isValidElement(icon)? icon : label)}
        {showPopover && <span className="more-icon__pseudo-arrow"></span>}
        <Trigger
          ref="trigger"
          className="more-icon__trigger"
          align={this._getAlign()}
          equalTargetWidth={false}
          visible={showPopover}
          target={this._getTarget}
          getPopupContainer={this._getPopupContainer}>
          <Popover className="more-icon__popover">
            <ul className="more-icon__icon-list">
              {model.subIcons.map((item, i) => {
                return (
                  <li key={i} className="more-icon__icon-item">
                    {item}
                  </li>
                );
              })}
            </ul>
          </Popover>
        </Trigger>
      </div>
    );
  }

  _getAlign() {
    return {
      points: ['tr', 'br'],
      overflow: {
        adjustX: true,
      },
    };
  }

  _getTarget() {
    const target = findDOMNode(this).parentNode.parentNode;
    return target;
  }

  _getPopupContainer() {
    return findDOMNode(this.context.records);
  }

  _togglePopover(show) {
    this.setState({ showPopover: show });
  }
}

class HeadingIcon extends M.BaseComponent.Mixin(M.ContextMixin('records')) {
  constructor(props) {
    super(props);
    Object.assign(this.state, {
      showPopover: false,
      data: [],
      fixHeader: false,
    });
  }

  componentWillMount() {
    let { records } = this.context;
    let scroll = records._getScroll();
    let { fixHeader } = this.state;
    //如果存在，则表头固定为true
    if (scroll.y) {
      fixHeader = true;
    }
    this.setState({ fixHeader });
  }

  componentDidMount() {
    this.windowEventListener('click', (e) => {
      let { showPopover } = this.state;
      let { container, trigger } = this.refs;
      let triggerNode = trigger.getPopupDOMNode();
      if (showPopover
        && !findDOMNode(container).contains(e.target)
        && !triggerNode.contains(e.target)) {
        this._togglePopover(false);
      }
    });
  }

  render() {
    let { model } = this.props;
    let { icon, label } = model;
    let { showPopover, data, fixHeader } = this.state;
    let props = {
      onClick: this._togglePopover.bind(this, !showPopover),
    };
    return (
      <div ref="container" className={this.classNames('heading-icon')}>
        {isString(icon)? <Icon className="heading-icon__icon" type={icon}
                               domProps={props} />
          : (React.isValidElement(icon)? icon : label)}
        {showPopover && <span className="heading-icon__pseudo-arrow"></span>}
        <Trigger
          ref="trigger"
          className="heading-icon__trigger"
          align={this._getAlign()}
          equalTargetWidth={false}
          visible={showPopover}
          target={this._getTarget}
          getPopupContainer={this._getPopupContainer}>
          <Popover className="heading-icon__popover">
            <CustomFilter data={data}
                          custom={(
                            <div className="heading-icon__fix-header">
                              <Icon className={M.classNames("heading-icon__fix-header-icon", {
                                active: fixHeader
                              })} type="drawing-pin"
                                    domProps={{
                                      onClick: this._toggleFixHead.bind(this, !fixHeader),
                                    }}/>
                              <Popover className="heading-icon__fix-header-popover"
                                       placement="top">{fixHeader? '取消固定表头' : '固定表头'}</Popover>
                            </div>
                          )}
                          onConfirm={this._onFilterChange}
                          onCancel={this._togglePopover.bind(this, false)} />
          </Popover>
        </Trigger>
      </div>
    );
  }

  _getAlign() {
    return {
      points: ['tr', 'br'],
      overflow: {
        adjustX: true,
      },
    };
  }

  _getTarget() {
    const target = findDOMNode(this).parentNode.parentNode;
    return target;
  }

  _getPopupContainer() {
    return findDOMNode(this.context.records);
  }

  _togglePopover(show) {
    let { records } = this.context;
    let columns = records._getColumns();
    let data = columns.map(c => _pick(c, ['code', 'label', 'show']));

    this.setState({
      showPopover: show,
      data,
    });
  }

  _onFilterChange(columns) {
    let { fixHeader } = this.state;
    let { records } = this.context;
    let dataColumns = records._getColumns();
    let columnsMap = {};
    dataColumns.forEach(c => {
      columnsMap[c.code] = c;
    });
    dataColumns = columns.map(c => Object.assign(columnsMap[c.code], c));

    records._setColumns(dataColumns, () => {
      let { records } = this.context;
      records._onColumnsFilter(columns.filter(f => f.show).map(f => f.code),
        columns);
    });

    let scroll = records._getScroll();
    if (fixHeader && !scroll.y) {
      scroll.y = true;
    } else if (!fixHeader && scroll.y) {
      scroll.y = false;
    }
    records._setScroll(scroll);
    this._togglePopover(false);
  }

  _toggleFixHead(on) {
    this.setState({
      fixHeader: on,
    });
  }
}

export default Setting;
