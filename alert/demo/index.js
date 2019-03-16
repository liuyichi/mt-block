
import React from 'react';
import { Alert } from '../';
import Doc from '../../util/doc';
import api from '../api';
import './index.scss';

let conf = {
    "code":"alert",
    "sub":{
        "title":"Alert",
        "desc":"弹框,提示信息"
    },
    "stage":{
        "title":"使用场景",
        "desc":"弹框,提示信息"
    },
    demos:[
        {
            "code":"basic",
            "title":"基本用法",
            "desc":<div>
                <p>alert4种类型:普通(info)、成功(success)、警告(warning)、危险(danger)</p>
                <p>通过设置 type 为 info success warning danger，若不设置 type 值则为默认。不同的样式可以用来区别其使用场景</p>
                <p>通过 title 设置提示标题，若不设置则为空</p>
                <p>通过 content 设置提示内容，若不设置则为空</p>
                <p>通过 onClose 设置点击关闭按钮时的回调，若不传会隐藏关闭按钮</p>
            </div>,
            'element':require('./basic').default,
            "link":"basic.js"
        }
    ],
    api:api
};
export default <Doc className="block-alert-demo" {...conf}/>
