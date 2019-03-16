
import React, { Component } from 'react';
import { Input, Toaster } from '../../index';
import './index.scss';

class InputDemo extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="input-clear-demo">
                <div className="input-group">
                    <label className="input-group-label">scene 1</label>
                    <div className="input-group-input">
                        <Input type="text"
                               defaultValue="默认情况下,清空值后输入框获得焦点"
                        />
                    </div>
                </div>
                <div className="input-group">
                    <label className="input-group-label">scene 2</label>
                    <div className="input-group-input">
                        <Input type="text"
                               defaultValue="当前值不为空并且聚焦状态下不显示清空按钮"
                               clearIcon={false}
                              />
                    </div>
                </div>
                <div className="input-group">
                    <label className="input-group-label">scene 3</label>
                    <div className="input-group-input">
                        <Input type="text"
                               defaultValue="清空值后输入框不获得焦点"
                               clearIcon={true}
                               focusAfterClear={false}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default <InputDemo />
