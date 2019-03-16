const React = require('react');
import { KEYCODE } from '../util/data';

class Options extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current: props.current,
      _current: props.current,
    };

    ['_handleChange', '_changeSize', '_go', '_goTo', '_buildOptionText'].forEach((method) => this[method] = this[method].bind(this));
  }
  _buildOptionText(value) {
    return `${value} ${this.props.locale.items_per_page}`;
  }

  _changeSize(value) {
    this.props.changeSize(Number((value || {}).value) || this.props.defaultPageSize);
  }

  _handleChange(evt) {
    const _val = evt.target.value;
    if (!/^[0-9]*$/.test(_val)) return;
    this.setState({
      _current: _val,
    });
  }

  _go(e) {
    const _val = e.target.value;
    if (_val === '') {
      return;
    }
    let val = Number(this.state._current);
    if (isNaN(val)) {
      val = this.state.current;
    }
    if (e.keyCode === KEYCODE.ENTER) {
      const c = this.props.quickGo(val);
      this.setState({
        _current: c,
        current: c,
      });
    }
  }
  _goTo() {
    let val = Number(this.state._current);
    if (isNaN(val)) {
      val = this.state.current;
    }
    const c = this.props.quickGo(val);
    this.setState({current: c, _current: c});
  }

  render() {
    const props = this.props;
    const state = this.state;
    const locale = props.locale;
    const prefixCls = `${props.rootPrefixCls}-options`;
    const changeSize = props.changeSize;
    const quickGo = props.quickGo;
    const quickGoSubmit = quickGo && props.quickGoSubmit;
    const Select = props.selectComponentClass;
    let changeSelect = null;
    let goInput = null;

    if (!(changeSize || quickGo)) {
      return null;
    }

    if (changeSize && Select) {
      const pageSize = props.pageSize || props.pageSizeOptions[0];
      const _value = pageSize + locale.items_per_page;
      changeSelect = (
        <Select prefixCls={props.selectPrefixCls}
                className={`${prefixCls}-size-changer`}
                value={{value: _value, label: _value}}
                size={props.size}
                model={{idField: "value", showField: "label"}}
                align={props.selectAlign}
                onChange={this._changeSize}
                unsearchable={true}
                clearIcon={false}
                onFetchData={(filter, callback) => {
                  callback && callback(props.pageSizeOptions);
                }}
        />
      );
    }

    if (quickGo) {
      goInput = (
        <div className={`${prefixCls}-quick-jumper`}>
          {locale.jump_to}
          <div className={`${prefixCls}-quick-jumper-input`}>
            <span>{state._current}</span>
            <input ref="input" type="text" value={state._current}
                   onChange={this._handleChange.bind(this)}
                   onKeyUp={this._go.bind(this)}/>
          </div>
          {locale.jump_to_unit}
          {quickGoSubmit && <button onClick={this._goTo}>{locale.jump_submit}</button>}
        </div>
      );
    }

    return (
      <div className={`${prefixCls}`}>
        {changeSelect}
        {goInput}
      </div>
    );
  }
}

Options.propTypes = {
  changeSize: React.PropTypes.func,
  quickGo: React.PropTypes.func,
  selectComponentClass: React.PropTypes.func,
  current: React.PropTypes.number,
  pageSizeOptions: React.PropTypes.arrayOf(React.PropTypes.string),
  pageSize: React.PropTypes.number,
  buildOptionText: React.PropTypes.func,
  locale: React.PropTypes.object,
};

Options.defaultProps = {
  pageSizeOptions: ['10', '20', '30', '40'],
};

module.exports = Options;
