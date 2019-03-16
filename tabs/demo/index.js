import React, { Component } from 'react';
import Doc from '../../util/doc';
import Api from '../api';

import './index.scss';

let conf = {
    "code": "tabs",
    "sub": {
        "title": "Tabs",
        "desc": "选项卡(Tabs)"
    },
    "stage": {
        "title": "使用场景",
        "desc": <div>
            标签页的意义在于提供平级的区域将大块内容进行收纳和展现，保持界面整洁<br/>
            共提供三个级别的标签页，满足不同场景下的使用。
        </div>
    },
    demos:[
        {
            "code": "basic",
            "title": "基本用法",
            "desc": "在多个选项卡之间切换, 默认选中第一个",
            'element': require('./basic').default,
            "link": "basic.js"
        },
        {
            "code": "size",
            "title": "尺寸",
            "desc": "支持 default/small/large, 默认是 default",
            'element': require('./size').default,
            "link": "size.js"
        },
        {
            "code": "position",
            "title": "position",
            "desc": "支持 top/bottom/left/right, 默认是 top",
            'element': require('./position').default,
            "link": "position.js"
        }
    ],
    api: Api
};

export default <Doc className="block-tabs-demo" {...conf} />;
