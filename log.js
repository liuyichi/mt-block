import React from 'react';
import { Timeline } from './index';
import M from './util';
import './log.scss';

const log = [
  {
    date: "2017/12/19",
    version: "1.0.33",
    memo:
      `1. 修复 Bill 内置 control 事件对 conf 内传递的属性的处理不对的问题。
2. 修复 Select: 联想模式下的 maxLength 校验问题; 禁用无值时不显示 placeholder 的问题。
3. 修复 Input password 类型在只读态下需要显示密文的问题。
4. 修复 Tree 的 defaultExpandAll 属性不支持自定义数据解析的问题。
5. 优化 CheckboxGroup/RadioGroup, 支持 format 自定义可选项的显示。
6. 优化 Draggable 接收的 itemClass 支持 function。
7. 优化 TreeSelect 接收的 model.filterTreeNode 添加第二个参数 searchword。`
  },
  {
    date: "2017/11/14",
    version: "1.0.32",
    memo:
      `1. 优化 ComplexRecords `
  },
  {
    date: "2017/11/6",
    version: "1.0.31",
    memo:
      `1. 修复 ComplexRecords UI样式问题。
2. 修复 ComplexRecords 高级搜索表单的传值问题。`
  },
];

export default <Timeline simple
                         className="mt-log"
                         getActive={list => list[0]}
                         model={{rightField: "memo", "leftField": "version"}}
                         renderLabel={({item})=>({left: <div><div>{item.date}</div><div>{item.version}</div></div>, right: <pre>{item.memo}</pre>})}
                         onFetchTimeline={()=>log} />

