
import React, { Component } from 'react';
import {Input} from '../index';
import './index.scss';
let values = [
    "默认显示1行",
    "view模式下,默认展开全部,显示展开收起按钮,并且在收起时显示3行。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。",
    "显示长度限制,最大长度20字,并且在超出20字后提示",
    "截断超过最大字符后的输入",
    "最少3行,最多6行"
];
let autosize = {
    minRows: 3,
    maxRows:6
};
class InputDemo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="input-textarea-demo">
                <div className="input-group">
                    <label className="input-group-label">scene 1</label>
                    <div className="input-group-input">
                       <Input type="textarea"
                               rows="1"
                              placeholder={values[0]}
                              />
                    </div>
                </div>
                <div className="input-group">
                    <label className="input-group-label">scene 2</label>
                    <div className="input-group-input">
                       <Input type="textarea"
                               mode="view"
                               rows="5"
                               rowsIfView="3"
                               showUnfold={true}
                               defaultUnfold={true}
                               defaultValue={values[1]}/>
                    </div>
                </div>
                <div className="input-group">
                    <label className="input-group-label">scene 3</label>
                    <div className="input-group-input">
                       <Input type="textarea"
                              showCount={true}
                              maxLength="20"
                              placeholder={values[2]}
                              overLengthValidation="不能超过20字奥"
                       />
                    </div>
                </div>
                <div className="input-group">
                    <label className="input-group-label">scene 4</label>
                    <div className="input-group-input">
                       <Input type="textarea"
                              rows="1"
                              showCount={true}
                              maxLength="10"
                              cutIfOverLength={true}
                              placeholder={values[3]}
                       />
                    </div>
                </div>
                <div className="input-group">
                    <label className="input-group-label">scene 5</label>
                    <div className="input-group-input">
                       <Input type="textarea"
                              autosize={autosize}
                              placeholder={values[4]}
                       />
                    </div>
                </div>
            </div>
        );
    }
}

export default <InputDemo />
