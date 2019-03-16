import React from 'react';
import { findDOMNode } from 'react-dom';
import M from '../../../util';
import MultiSelectDropdown from './multi-select-dropdown';
import Trigger from '../../../trigger';
import Icon from '../../../icon';

class MultiSelect extends M.BaseComponent {
  constructor(props) {
    super(props);
    Object.assign(this.state, {
      value: [],
      showDropdown: false,
    });
  }
  componentDidMount() {
    this.windowEventListener('click', (e) => {
      if (!this.state.showDropdown) {
        return;
      }
      let { container: $container, trigger } = this.refs;
      let $trigger = trigger && trigger.getPopupDOMNode();
      if ($container && !$container.contains(e.target)
        && (!$trigger || !$trigger.contains(e.target))) {
        this._toggleDropdown(false);
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value && nextProps.value.slice() || [],
    });
  }
  render() {
    let baseCls = 'derived-multi-select';
    let { showDropdown, value } = this.state;
    let { model, getPopupContainer, onFetchData, onFetchNodeData, parent } = this.props;
    let { _selectType_, conf, model: m } = model;
    let { placeholder, triggerClassName, align, className, searchPlaceholder,
      ...otherConf } = conf || {};
    let selectProps = {
      ...otherConf,
      onFetchData: onFetchData && onFetchData.bind(null, parent, model.code),
      onFetchNodeData: onFetchNodeData && onFetchNodeData.bind(null, parent, model.code),
      placeholder: searchPlaceholder || placeholder,
      model: m,
    };
    return (
      <div className={this.classNames(baseCls, className, {
        [`${baseCls}--active`]: showDropdown,
      })}>
        <div ref="container" className={`${baseCls}__inner`}>
          <div className={`${baseCls}__show-field`}
               onClick={this._toggleDropdown.bind(this, true)}>
            <span>{placeholder}</span>
            <Icon className={`${baseCls}__arrow-icon`}
                  type="angle-down" />
          </div>
          <Trigger visible={showDropdown}
                   className={triggerClassName}
                   align={align}
                   ref="trigger"
                   autoDestory={align ? align.autoDestory : true}
                   equalTargetWidth={align ? align.equalTargetWidth : false}
                   getPopupContainer={getPopupContainer}
                   target={this._getRootTarget}>
            <MultiSelectDropdown selectProps={selectProps}
                                 type={_selectType_}
                                 value={value}
                                 onCancel={this._toggleDropdown.bind(this, false)}
                                 onConfirm={this._onConfirm} />
          </Trigger>
        </div>
      </div>
    );
  }

  _toggleDropdown(on) {
    this.setState({
      showDropdown: on,
    });
  }

  _getRootTarget() {
    return findDOMNode(this.refs.container);
  }

  _onConfirm(value) {
    this.setState({ value }, () => {
      let { onChange } = this.props;
      onChange && onChange(this.state.value);
      this._toggleDropdown(false);
    });
  }
}

export default MultiSelect;
