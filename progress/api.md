---
category: Components
type: Basic
title: Progress
subtitle: 进度条
-------------


## API


进度条的属性说明如下：

| 属性 | 说明 | 类型 | 默认值
| -----|-----|-----|------
| type | 设置进度条的类型  可选值为'line' 'circle' | string | 默认值 'line'
| percent | 设置进度条的进度百分比  | Number | 默认值  0
| format | 设置文字内容的模版函数 | function(percent) | 默认值 percent=>percent+'%'
| status | 设置进度条的状态,可选值为'success' 'exception' 'active'| string |-
| showInfo | 设置是否显示进度数值或状态图标 | Boolean | 默认值 true
| strokeWidth(type=line) | 进度条线的宽度,单位px | Number | 10
| strokeWidth(type=circle) | 圆形进度条线的宽度,单位是进度条画布宽度的百分比 | Number | 6
| width(type=circle) | 圆形进度条画布宽度,单位px | Number | 132



```html
<MtProgress   percent={60}   showInfo={false}  format={percent=>percent+"$"}/>
```
