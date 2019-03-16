## block 组件库

企业平台提供的前端组件库,由企业平台前端团队和北京用户体验部设计团队联合打造而成,立足于解决中后台项目的前端实现方案;
该组件库适用于快速搭建中后台项目的前端框架,提供完整的前后端分离的发布部署方案.

包含的组件以一下三个为主

* workspace : 页面导航和页面路由
* records : 记录搜索页
* bill : 表单,提供表单的高级复杂用法

代码示例参考 [block-demo](http://git.sankuai.com/users/jiazhao/repos/block-demo/browse)

项目参与人员:

FE:jiazhao liyu09 liukaimei dengyajun wangpeiyu 等

UED:liangjikun chenbin02 duanqiuzi houxiaoqing03 huyuanfu等

## publish
- node dev/publish.js
- cd dev/publish 
- mnpm publish


## 更新日志

### ``1.3.0-beta.7`` 2018.10.25
1. 修复 Bill: onBind/onFetch/onBindNode 兼容 status 401 的格式
1. 修复 UploadHelper: upload 兼容 status 401 的格式

### ``1.3.0-beta.6`` 2018.9.6
1. 修复 Router: pathname 的匹配规则

### ``1.3.0-beta.5`` 2018.9.3
1. 修复 Router: pathmap 的获取

### ``1.3.0-beta.4`` 2018.9.3
1. 修复 ComplexRecords: 更改筛选项后同步更改 bill 的数据
2. 修复 CustomBill: show 为 false 时不显示
3. 修复 Router: 通过 custom 设置的路由，应该定位到其对应的节点
4. 修复 table: filterDropDown 的确定事件

### ``1.3.0-beta.3`` 2018.6.22
1. 修复 textarea: 自动撑高时偶尔会出现滚动条的问题

### ``1.3.0-beta.2`` 2018.6.15
1. 修复 Table: 删除不必要的依赖

### ``1.3.0-beta.1`` 2018.6.6
1. 修复 Table: 支持多列 sortOrder
- 修复 select: small 尺寸的样式问题
- 修复 textarea: 多行收起时, 省略图标的底色问题 

### ``1.3.0-beta`` 2018.5.31
1. 新增属性 Table: 支持 onSortOrderChange 监听排序的点击

# ``1.2.0`` 2018.5.28
1. 新增属性 Table: 支持 triggerModel 给表头筛选定制弹窗的属性
    - filterDropdown 支持 React.createClass 或者 function, 通过 props.confirm 更新筛选
- 新增属性 ComplexRecords: 表头筛选 selectFilter/multiSelectFilter 支持 format 属性
- 修复 Input: number 的 toFixed 属性支持 0

### ``1.1.0`` 2018.5.18
1. 新增功能 Router: 路由支持 redirect 重定向的配置
- 新增功能 Bill: 支持 getModel 获取当前配置模板的方法
    - 不同类型的组件在 dom 节点上通过类名标识
- 新增属性 Draggable: 支持 dataControled 属性标识其数据是否受控
- 新增功能 AutoInput: 支持 model.format 自定义下拉选项的渲染
- 修复 Input: password 显示 emptyLabel 与 placeholder 的样式问题
    - textarea 展开收起的底色样式问题

### ``1.0.39`` 2018.4.16
1. 修复 Input: number 类型仅输入 '.' 时自动填充为 NaN 的问题
- 修复 Bill: 小尺寸时顶部对齐的样式问题

### ``1.0.38`` 2018.4.9
1. 修复 Bill: 支持 alignment top
- 修复 Select: 在键入搜索词后快速失去焦点, 点开后提示无数据的问题
- 修复 Workspace: 侧边栏滚动条显示在侧边栏外的问题 (IE11/Edge)
- 修复 Button: 按钮间距可能出现动画的问题 (IE11)
- 修复 Input: 组件多行查看模式的展开收起无效 (IE11/Edge) 
    - textarea 只显示一行时出现不可滚动的滚动条的问题

### ``1.0.38-beta`` 2018.3.6
1. 修复 Bill: customBillItem 的自定义 onChange 接收到的参数问题

### ``1.0.37`` 2018.3.5
1. 修复 Bill: customBillItem 在 bill 数据更新之后重新渲染

### ``1.0.37-beta.7`` 2018.3.2
1. 修复 Date: 有值的情况下不渲染 placeholder

### ``1.0.37-beta.6`` 2018.3.1
1. 修复 TreeSelect: 对 defaultExpandAll 的支持
2. 修复 Dialog: 默认样式下 onMaskClick 无法触发的问题

### ``1.0.37-beta.5`` 2018.2.9
1. 修复 Bill: customBillItem 组件接收到的属性 props.model 问题

### ``1.0.37-beta.4`` 2018.2.8
1. 修复 Bill: customBillItem 在 setModel 设置 Component 之后渲染数据

### ``1.0.37-beta.3`` 2018.2.8
1. 修复 Workspace: 菜单的默认展开收起

### ``1.0.37-beta.2`` 2018.2.7
1. 修复 Tree: 对叶子节点的渲染逻辑

### ``1.0.37-beta`` 2018.2.6
1. 修复 Bill
    - custom 类型的组件接收的参数问题
    - custom 类型的组件渲染时机在bill中所有数据更新完成之后
- 修复 ComplexRecords: 内置事件 bind, bindNode 的处理加数据保护
- 修复 Select
    - 上下键选定位可视的问题
    - unsearchable 时下拉按钮的点击事件
- 修复 Upload
    - locale.duplicated 提示信息的问题
- 优化 Workspace
    - 菜单的默认展开收起可控
    - 侧边栏文字用 span 包裹
- 优化 Tree: 支持 iconFormat 属性设置图标

### ``1.0.36`` 2018.1.23
1. 修复 Input: number 类型对 toFixed 的支持


### ``1.0.35`` 2018.1.17
1. 修复 Input: number 类型允许输入 001 等特殊结构
- 修复 Tabs: 样式问题

### ``1.0.34`` 2018.1.16
>
1. 修复 Button: 圆形内文字的样式
- 修复 Input: 同时被设置为只读/禁用时的样式问题
- 修复 Workspace: getPathMap 对三级路由的处理不对的问题
- 修复 Trigger: useCssBottom/useCssRight 的样式问题
- 修复 Table: propTypes 校验修复
- 修复 Bill: 
	- control 事件的参数保护
	- 添加 form 的 show[Function or Boolean]
	- 添加 CustomBillItem 解决自定义组件的渲染
- 修复 TreeSelect: 修复再次点开下来时，上次收起的节点又被展开了的问题
- 修复 DatePicker: 默认getPopupContainer传入null
- 优化 Select: 
	- 新增 noCache, 每一次展开都重新获取数据
	- 未设置 showCode 或者无显示文案时显示 code 的内容
- 优化 Tabs: 
    - 支持 itemClass
    - 支持 data 代替 value 
    - 单项支持 autoDestory 
    - 支持 extraRight 设置 extraTab 的显示位置
- 优化 Workspace: 支持 urlField
- 优化 Table: 支持 renderHeaderRow 自定义渲染表头
- 优化 Tree: 支持 checkHalfable/useTreeData/selectFolderable
- 优化 ConsoleButton: 支持 Component，用于在内层使用 Button 之外的组件

### ``1.0.33`` 2017.12.19
>
1. 修复 Bill 内置 control 事件对 conf 内传递的属性的处理不对的问题。
- 修复 Select: 
    - 联想模式下的 maxLength 校验问题; 
    - 禁用无值时不显示 placeholder 的问题。
- 修复 Input password 类型在只读态下需要显示密文的问题。
- 修复 Tree 的 defaultExpandAll 属性不支持自定义数据解析的问题。
- 优化 CheckboxGroup/RadioGroup, 支持 format 自定义可选项的显示。
- 优化 Draggable 接收的 itemClass 支持 function。
- 优化 TreeSelect 接收的 model.filterTreeNode 添加第二个参数 searchword。 

### ``1.0.32`` 2017.11.14
> 
1. 优化 ComplexRecords

### ``1.0.31`` 2017.11.7
>
1. 修复 ComplexRecords UI样式问题。
- 修复 ComplexRecords 高级搜索表单的传值问题。

