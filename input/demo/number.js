
import React, { Component } from 'react';
import {Input} from '../index';
import './index.scss';

class InputDemo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="input-number-demo">
                <div className="input-group">
                    <label className="input-group-label">scene 1</label>
                    <div className="input-group-input">
                        <Input type="number" numberToEn={true} defaultValue={123456789} mode="view" addonAfter="view模式插入千分符"/>
                    </div>
                </div>
                <div className="input-group">
                    <label className="input-group-label">scene 2</label>
                    <div className="input-group-input">
                        <Input type="number" toFixed="2" defaultValue={123.45} addonAfter="保留两位小数" />
                    </div>
                </div>
            </div>
        );
    }
}

export default <InputDemo />
