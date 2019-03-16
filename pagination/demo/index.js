
import React from 'react';
import { Pagination } from '../';
import Doc from '../../util/doc';
import api from '../api';
import './index.scss';

let conf = {
  "code": "pagination",
  "sub": {
    "title": "Pagination",
    "desc": "分页"
  },
  "stage": {
    "title": "使用场景",
    "desc": "页面数据展示需要分页的时候"
  },
  demos: [
    {
      "code":"simple",
      "title":"简单模式",
      "desc":"简单模式适合范围小时使用，仅仅包含几个翻页箭头，和当前页/总页数",
      'element':require('./simple').default,
      "link":"simple.js"
    },
    {
      "code":"basic",
      "title":"常规模式",
      "desc":"支持总页数的显示, 切换页条数, 快速跳页等功能, 这些属性都可以搭配使用",
      'element':require('./basic').default,
      "link":"basic.js"
    }
  ],
  api: api
};

export default <Doc className="block-upload-demo" {...conf}/>;

