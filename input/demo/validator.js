
import React, { Component } from 'react';
import {Input} from '../index';

class InputDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mail:"lisi",
            phone:"",
            validator:{
                phone:{
                    "onChange":[
                        {
                            "required": true,
                            "message": "必须填写"
                        },
                        {
                            "whitespace": true,
                            "message": "不能全为空"
                        },
                        {
                            "pattern": "^((\\d{3})|\\d{3,4}-)?\\d{7,8}$",
                            "message": "不正确的电话格式"
                        }
                    ]
                },
                mail:{
                    "onBlur":[
                        {
                            "required": true,
                            "message": "必须填写"
                        },
                        {
                            "whitespace": true,
                            "message": "不能全为空"
                        },
                        {
                            "pattern": "^\\w+([-.]\\w+)*@\\w+([-.]\\w+)*\.\\w+([-.]\\w+)*$",
                            "message": "不正确的邮箱格式,需要包含@等"
                        },
                        {
                            "validator": function (value) {
                                if (value.indexOf("@meituan") !== -1) {
                                    return "不能用美团的邮箱"
                                }
                            }
                        }
                    ]
                },
                IDNumber:{
                    "onBlur":[
                        {
                            "required": true,
                            "message": "必须填写"
                        },
                        {
                            "whitespace": true,
                            "message": "不能全为空"
                        },
                        {
                            "pattern": "(^\\d{15}$)|(^\\d{17}([0-9]|X|x))$",
                            "message": "不正确的身份证号格式"
                        }
                    ]
                },
            }
        }
    }
    componentDidMount(){
        this.refs.mail.validate();
        this.refs.phone.validate();
        this.refs.IDNumber.validate();
    }

    render() {

        return (
            <div className="input-validator-demo">
                页面加载时调用validate()方法触发组件的正确性校验
                <div className="input-group">
                    <label className="input-group-label">scene 1</label>
                    <div className="input-group-input">
                        <Input ref="userName"
                               type="text"
                               placeholder="匹配1到10位数字或字母,截断不符合校验的字符"
                               pattern="^[0-9a-zA-Z]{1,10}$"
                               cutIfDisMatchPattern={true}
                               validation="支持1到10位数字或字母"
                        />
                    </div>
                </div>
                <div className="input-group">
                    <label className="input-group-label">scene 2</label>
                    <div className="input-group-input">
                        <Input ref="userName"
                               type="text"
                               placeholder="必填,不支持表情符号"
                               required={true}
                               pattern="^[^\uD800-\uDFFF]*$"
                               validation="必填,不支持表情符号"
                        />
                    </div>
                </div>
                <div className="input-group">
                    <label className="input-group-label">电话</label>
                    <div className="input-group-input">
                        <Input ref="phone"
                               type="text"
                               placeholder="匹配正确的固定电话、手机号码,输入时校验"
                               validator={this.state.validator.phone}
                               value={this.state.phone}
                               onChange={(value)=>{this.setState({phone:value})}}
                        />
                    </div>
                </div>
                <div className="input-group">
                    <label className="input-group-label">邮箱</label>
                    <div className="input-group-input">
                        <Input ref="mail"
                               type="text"
                               placeholder="匹配正确的邮箱,不支持美团邮箱"
                               validator={this.state.validator.mail}
                               value={this.state.mail}
                               onChange={(value)=>{this.setState({mail:value})}}
                        />
                    </div>
                </div>
                <div className="input-group">
                    <label className="input-group-label">身份证号</label>
                    <div className="input-group-input">
                        <Input ref="IDNumber"
                               type="text"
                               placeholder="匹配正确的身份证号,失去焦点时校验"
                               validator={this.state.validator.IDNumber}
                               value={this.state.IDNumber}
                               onChange={(value)=>{this.setState({IDNumber:value})}}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default <InputDemo />
