
import React, { Component } from 'react';
import { Input, Button, Toaster } from '../../index';

class InputDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            number:66,
            userName:"张三",
            mail:"gangwan",
            search:""
        }
    }

    render() {
        return (
            <div className="input-tag-demo">
                <div className="input-group normal">
                    <label className="input-group-label">简单用法</label>
                    <div className="input-group-input">
                        <Input type="number"
                               className="number"
                               addonAfter="千克"
                               placeholder="输入数字"
                               value={this.state.number}
                               onChange={(value)=>{this.setState({number:value})}} />
                        <Input type="text"
                               addonBefore={<span>姓 名</span>}
                               placeholder="输入用户名"
                               value={this.state.userName}
                               onChange={(value)=>{this.setState({userName:value})}} />
                        <Input type="text"
                               addonBefore={<span>邮 箱</span>}
                               addonAfter={<span>@meituan.com</span>}
                               disabled={true}
                               placeholder="输入邮箱"
                               value={this.state.mail}
                               onChange={(value)=>{this.setState({mail:value})}} />
                    </div>
                </div>
                <div className="input-group extend">
                    <label className="input-group-label">延伸用法</label>
                    <div className="input-group-input">
                        <Input type="text"
                               addonAfter={<Button label="搜索" type="primary" onClick={()=>{Toaster.warning("执行搜索操作")}}/>}
                               placeholder="输入搜索条件"
                               value={this.state.search}
                               onChange={(value)=>{this.setState({search:value})}} />
                    </div>
                </div>
            </div>
        );
    }
}

export default <InputDemo />
