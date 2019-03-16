import React from 'react';
import { Radio, RadioGroup } from '../index';

let model = [{"label": "官网", value: 1}, {"label": "智联招聘", value: 2}, {"label": "中华英才网", value: 3}];

class CheckBoxDemo extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value:1
        }
    }
    render(){
        return <div className="radio-basic-demo">
            <div>
                <label className="radio-demo-label">单选框：</label>
                <Radio label="打开一个新的标签页" />
            </div>
            <div>
                <label className="radio-demo-label">单选框组：</label>
                <RadioGroup model={model}
                            value={this.state.value}
                            format={({label, value}) => label + value}
                            onChange={(value)=>{this.setState({value:value})}} />
            </div>
        </div>;
    }
}

export default <CheckBoxDemo/>;