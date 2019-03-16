
import React from 'react';
import Doc from '../../util/doc';
import api from '../api';
import './index.scss';

let conf = {
    "code":"tree",
    "sub":{
        "title":"Tree",
        "desc":"树形组件，用于层级展开，折叠"
    },
    "stage":{
        "title":"使用场景",
        "desc":"目录，组织架构，国家等层次关系的展开、折叠"
    },
    demos:[
        {
            "code":"basic",
            "title":"基本用法",
            "desc":<div>
                <p>树形展开、折叠，复选框勾选</p>
            </div>,
            'element':require('./basic').default,
            "link":"basic.js"
        },
        {
            "code":"advanced",
            "title":"综合用法",
            "desc":<div>
                <p>支持只读状态和编辑状态，编辑状态hover时出现操作按钮</p>
                <p>支持异步加载子节点、拖动等</p>
            </div>,
            'element':require('./advanced').default,
            "link":"advanced.js"
        }
    ],
    api:api
};
export default <Doc className="block-tree-demo" {...conf}/>
