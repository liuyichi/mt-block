import React, { Component } from 'react';
import Doc from '../../util/doc';
import './index.scss';
let api = require("../api");
let conf = {
    "code": "input",
    "sub": {
        "title": "Input",
        "desc": "用于直接输入表单内容"
    },
    "stage": {
        "title": "使用场景",
        "desc": "当用户需要输入text/number/password/textarea等类型的表单内容时"
    },
    demos: [
        {
            "code": "basic",
            "title": "基本用法",
            "desc": <div>
                <p>输入框有4种类型:分别为 text number password textarea。可通过 type 来设置,若不设则默认为 text。</p>
                <p>有两种大小:分别为 default small。可通过 size 来设置,若不设置,则默认为 default。</p>
                <p>通过 defaultValue 设置初始值,通过 value 设置当前值,通过 placeholder 设置默认提示,通过 prefixCls 设置样式前缀</p>
            </div>,
            'element': require('./basic').default,
            "link": "basic.js"
        },
        {
            "code": "state",
            "title": "模式",
            "desc": <div>
                <p>输入框有3种模式:默认 只读 禁用。</p>
                <p>通过mode属性设置默认 只读模式;通过 disabeld 属性设置禁用模式。</p>
                <p>通过emptyLabel属性设置mode 为 view 而 value 无值时, 显示的文本。</p>
            </div>,
            'element': require('./state').default,
            "link": "state.js"
        },
        {
            "code": "tag",
            "title": "前置/后置标签",
            "desc": <div>
                <p>输入框的标签分2种:前置(addonBefore)、后置(addonAfter)。</p>
                <p>通过addonBefore属性和addonAfter属性设置。</p>
            </div>,
            'element': require('./tag').default,
            "link": "tag.js"
        },
        {
            "code": "textarea",
            "title": "textarea",
            "desc": <div>
                <p>textarea中rows、rowsIfView、showUnfold、defaultUnfold、showCount、autosize、maxLength、overLengthValidation、cutIfOverLength的用法</p>
                <p>maxLength、overLengthValidation、cutIfOverLength非 textarea 特有用法</p>
            </div>,
            'element': require('./textarea').default,
            "link": "textarea.js"
        },
        {
            "code": "number",
            "title": "number",
            "desc": <div>
                <p>number中numberToEn、toFixed的用法</p>
            </div>,
            'element': require('./number').default,
            "link": "number.js"
        },
        {
            "code": "clear",
            "title": "clear",
            "desc": <div>
                <p>clearIcon、focusAfterClear的用法</p>
            </div>,
            'element': require('./clear').default,
            "link": "clear.js"
        },
        {

            "code": "validator",
            "title": "校验",
            "desc": <div>
                <p>required、pattern、validation、validator(自定义校验)、validate()的用法</p>
                <p>输入框的自定义校验时机分2种:失去焦点时校验(onBlur)/输入过程中实时校验(onChange)。</p>
                <p>输入框的自定义校验类别分4种:必填校验/不能全为空校验/正则校验/自定义校验。</p>
            </div>,
            'element': require('./validator').default,
            "link": "validator.js"
        },
        {

            "code": "handler",
            "title": "事件",
            "desc": <div>
                <p>trigger、onChange、onFocus、onBlur、onClear的用法</p>
            </div>,
            'element': require('./handler').default,
            "link": "handler.js"
        }
    ],
    api: api
};

export default <Doc className="block-input-demo" {...conf}/>;




