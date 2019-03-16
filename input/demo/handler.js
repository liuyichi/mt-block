
import React, { Component } from 'react';
import { Input, Toaster } from '../../index';
import './index.scss';

class InputDemo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="input-handler-demo">
                <div className="input-group">
                    <label className="input-group-label">Input</label>
                    <div className="input-group-input">
                        <Input type="text"
                               placeholder="操作一下试试"
                               defaultValue="操作一下试试"
                               trigger="onChange"
                               onChange={this.changeHandler}
                               onFocus={this.focusHandler}
                               onBlur={this.blurHandler}
                               onClear={this.clearHandler}
                        />
                    </div>
                </div>
            </div>
        );
    }
    changeHandler(value,e){
        Toaster.warning("我将接受新的值' "+value+ " '");
    }
    focusHandler(e){
        Toaster.warning("我获取焦点了!")
    }
    blurHandler(e){
        Toaster.warning("我失去焦点了!")
    }
    clearHandler(e){
        Toaster.warning("我的值被清空了!")
    }
}

export default <InputDemo />
