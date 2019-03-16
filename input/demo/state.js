
import React, { Component } from 'react';
import {Input} from '../index';

class InputDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName:"张三",
            password:"123456",
            age:20,
            memo:"我是一个好孩子,我是一个好孩子,我是一个好孩子,我是一个好孩子,我是一个好孩子,我是一个好孩子,我是一个好孩子,我是一个好孩子,我是一个好孩子,我是一个好孩子"
        }
    }

    render() {
        return (
            <div className="input-state-demo">
                <div className="input-group">
                    <label className="input-group-label">姓名</label>
                    <div className="input-group-input">
                        <Input type="text" placeholder="输入用户名"
                               value={this.state.userName}
                               mode="view"
                               onChange={(value)=>{this.setState({userName:value})}} />
                    </div>
                </div>
                <div className="input-group">
                    <label className="input-group-label">密码</label>
                    <div className="input-group-input">
                        <Input type="password"
                               placeholder="请输入密码"
                               value={this.state.password}
                               onChange={(value)=>{this.setState({password:value})}} />
                    </div>
                </div>
                <div className="input-group">
                    <label className="input-group-label">年龄</label>
                    <div className="input-group-input">
                        <Input type="number" placeholder="年龄" value={this.state.age}
                               onChange={(value)=>{this.setState({age:value})}} />
                    </div>
                </div>
                <div className="input-group">
                    <label className="input-group-label">自我描述</label>
                    <div className="input-group-input">
                        <Input type="textarea" value={this.state.memo}
                               rows="5"
                               disabled={true}
                               onChange={(value)=>{this.setState({memo:value})}} />
                    </div>
                </div>
                <div className="input-group">
                    <label className="input-group-label">view</label>
                    <div className="input-group-input">
                        <Input type="text" placeholder="输入用户名"
                               mode="view"
                               emptyLabel="空值时默认label"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default <InputDemo />
