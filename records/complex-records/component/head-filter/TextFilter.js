import React from 'react';
import M from '../../../../util';
import Input from '../../../../input';
import Button from '../../../../button';
import { KEYCODE } from '../../../../util/data';

class TextFilter extends M.BaseComponent {
  constructor(props) {
    super(props);
    let { model } = props;
    Object.assign(this.state, {
      value: model && model.filteredValue && model.filteredValue[0] || '',
    });
  }
  componentDidMount() {
    //FIXME 直接调用会使得页面滚动到顶部
    this.setTimeout(() => {
      this.refs.input.focus();
    }, 0);
  }
  componentWillReceiveProps(nextProps) {
    let { model } = nextProps;
    this.setState({
      value: model && model.filteredValue && model.filteredValue[0] || '',
    });
  }
  render() {
    let baseCls = 'text-filter';
    let { value } = this.state;
    let { model: { filterModel } } = this.props;

    return (
      <div className={baseCls}>
        <Input {...filterModel}
               ref="input"
               className={`${baseCls}__input`}
               size="small"
               value={value}
               trigger="onChange"
               onChange={(value) => this.setState({ value })}
               domProps={{
                 onKeyDown: (e) => {
                   if (e.keyCode == KEYCODE.ENTER) {
                     this._onConfirm();
                   }
                 },
               }}/>
        <Button className={`${baseCls}__btn`}
                type="primary"
                size="small"
                label="搜索"
                onClick={this._onConfirm} />
      </div>
    );
  }
  _onConfirm() {
    let { onConfirm } = this.props;
    onConfirm && onConfirm(this.state.value);
  }
}

export default TextFilter;
