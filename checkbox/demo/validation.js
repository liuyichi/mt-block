import React, { Component } from "react";
import {Checkbox, CheckboxGroup} from '../index';

const model = [{"label": "官网", value: 1}, {"label": "智联招聘", value: 2}, {"label": "中华英才网", value: 3}];

class ValidationDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value:[1]
    }
  }

  render() {
    let { value } = this.state;
    return (
      <div className="checkbox-validation-demo">
        <div>
          <label className="checkbox-demo-label">必填校验：</label>
          <CheckboxGroup model={model}
                         value={value}
                         required={true}
                         validation="请至少选择一项"
                         onChange={this._changeHandler} />
        </div>
        <div>
          <label className="checkbox-demo-label">限制最大可选：</label>
          <CheckboxGroup model={model} value={this.state.value2} maxLength={2} overLengthValidation="至多两个" onChange={(value)=>{this.setState({value2:value})}} />
        </div>
        <div>
          <label className="checkbox-demo-label">超过最大禁用：</label>
          <CheckboxGroup model={model} value={this.state.value3} maxLength={2} overLengthValidation="至多两个" disableIfOverLength={true} onChange={(value)=>{this.setState({value3:value})}} />
        </div>
        <div>
          <label className="checkbox-demo-label">限制最小需选：</label>
          <CheckboxGroup model={model} value={this.state.value4} minLength={2} onChange={(value)=>{this.setState({value4:value})}} />
        </div>
        <div>
          <label className="checkbox-demo-label">自定义校验(必须选择某项)：</label>
          <CheckboxGroup model={model}
                         validator={this._validate} />
        </div>
      </div>
    );
  }

  _changeHandler = (value) => {
    this.setState({ value });
  };

  _validate = (value) => {
    if (!value.some(v => v === 1)) {
      return '官网必须被选中';
    }
  }
}

export default <ValidationDemo />;