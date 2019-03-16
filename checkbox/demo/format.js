import React from 'react';
import { CheckboxGroup } from '../index';

let model = [{"label": "官网", value: 1}, {"label": "智联招聘", value: 2}, {"label": "中华英才网", value: 3}];

class CheckBoxDemo extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      value:[2]
    }
  }
  render(){
    return <div className="checkbox-basic-demo">
      <div>
        <CheckboxGroup model={model}
                       value={this.state.value}
                       format={option => <i>{option.label}</i>}
                       onChange={(value)=>{this.setState({value:value})}} />
      </div>
      <div>
        <CheckboxGroup model={model}
                       mode="view"
                       value={this.state.value}
                       format={option => <i>{option.label}</i>}
                       onChange={(value)=>{this.setState({value:value})}} />
      </div>
    </div>;
  }
}

export default <CheckBoxDemo/>;