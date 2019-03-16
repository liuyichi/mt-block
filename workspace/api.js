import React from "react";

const userModel = `{
    idField: 'id',
    nameField: 'name',
    avatarField: 'avatar',
    showAvatar: true,
    showName: false
}`;
const menuModel = `{
    idField: 'code',
    showField: 'label',
    typeField: 'type',
    childrenField: 'children',
    hideField: 'hide',
    urlField: 'url',
}`;

const userMenu = `[
    {
        code:"logout",
        label:"登出",//可以是jsx
        handler:function(){}
    }
]`;
const routes = `{
    "user-list":UserList,
    "custom":[
        {"path":"/stage-page-list/:pageCode/:pageName","code":"stage-page-list",component:StagePageList}
    ],
    "redirect": [
        {"from": '/stage-page-list-old', "to": '/stage-page-list'}
    ]
}`;
const topRoutes = `[
    {path: "/preview/resume/previewDetail", component:PreviewDetail}
]`;

/**
 * workspace和router的 api
 */
module.exports = [
    {
        title: "Workspace",
        desc: "应用的工作区,可以理解为导航区,根据配置生成顶部导航、侧边栏导航;及其整个页面的布局",
        columns: ["参数", "说明", "类型", "默认值"],
        data: [
            ["theme", "主题,目前支持两种`dark-light`和`light-dark`,后续会补充更多主题", "string", "dark-light"],
            ["logo", "logo区域的显示内容", "string|jsx", "LOGO"],
            ["menu", <div>导航数据,根据该数据渲染出来顶部导航和左侧导航,<a href="#menu">参考menu数据示范</a></div>, "Array[Object]", "-"],
            ["menuModel", <div>
                导航显示的菜单数据的配置: <br/>
                `idField` menu中数据对应key的字段名,<br/>
                `showField` menu中数据对应导航显示文本的字段名,<br/>
                `typeField` menu中数据对应类型的字段名,<br/>
                `iconField` menu中数据对应图标的字段名,<br/>
                `childrenField` menu中数据对应导航子菜单的字段名,<br/>
                `hideField` menu中数据控制隐藏的字段名,<br/>
                `urlField` menu中数据对应链接的字段名,<br/>
            </div>, "Object",
                <pre>{menuModel}</pre>],
            ["useTreeMenu", "是否使用通用树结构的menu,menu支持两种结构,一种树的一种是平级的", "boolean", "false"],
            ["hNavLevels", "水平导航的级数,最多支持两级,可取的值为`0`|`1`|`2`,默认顶部导航只显示1级", "int", "1"],
            ["onClickLogo", "单击logo时触发的方法", "function", "-"],
            ["keepAsideNavLeft", "是否让侧边栏显示在最左边", "boolean", "true"],
            ["showCollapse", "是否显示折叠按钮,点击折叠按钮收起左侧菜单", "boolean", "true"],
            ["userModel", <div>右上角用户信息的配置<a href="#userModel">查看userModel配置</a></div>, "Object",
                <pre>{userModel}</pre>],
            ["onFetchUser", "获取用户信息的方法", "function(){}", "-"],
            ["right", "右上角位于导航和个人信息中间区域的内容,例如:在这里放一个搜索框", "jsx", "-"],
            ["footer", "页脚显示区域", "string|jsx", "-"],
            ["setUrlForNode", "url转换的方法,把一个code转换为需要转换的url,例如把/post-list转换为/a/b/c", "function(code){}", "-"],
            ["user", "用户数据,数据内容根据userModel配置得来", "Object", "-"],
            ["selected", "当前选中的菜单的key值", "string", "-"],
            ["pathMap", "url的映射关系配置", "Object", "-"],
            ["onToggleAsideMenu", "显示|隐藏侧边栏时的回调", "function(show){}", "-"]
        ]
    },
    {
        title: "userModel",
        desc: "配置用户信息的配置",
        columns: ["参数", "说明", "类型", "默认值"],
        data: [
            ["idField", "用户信息的主键字段", "string", "id"],
            ["nameField", "显示用户名字的字段名", "string", "name"],
            ["avatarField", "显示头像的字段名", "string", "avatar"],
            ["showAvatar", "是否显示头像", "boolean", "true"],
            ["showName", "是否显示用户名", "boolean", "true"],
            ["menu", <div>
                点击头像区域下拉的menu配置 <br/>
                <pre>{userMenu}</pre>
            </div>, "Array", "[]"],
        ]
    },
    {
        title: "menu",
        desc: "menu数据示范示例,显示的是menu数组中的一个实例",
        columns: ["参数", "说明", "类型", "默认值"],
        data: [
            ["code", "菜单数据的key值,该key值与地址栏的url是一一对应的", "string", "-"],
            ["label", "菜单数据在导航显示的文字", "string", "-"],
            ["type", "菜单的类型,可选址为:`folder`|`node`|`link`;(文件夹)folder,(功能点)node,(外部链接)link", "string", "-"],
            ["icon", "菜单的图标, 可以是 http:// 或 https:// 开头的外部链接, 也可以是组件库里的图标如 plus 等", "string", "-"],
            ["url", "如果type是link,需要在配置对外跳转的url地址,支持绝对路径和相对路径", "string", "-"],
            ["target", "如果type是link,需要配置链接的打开方式,与a标签的打开的target配置一致", "string", "_target"],
            ["children", "如果type是folder,该menu的子节点列表", "Array[Object]", "-"]
        ]
    },
    {
        title: "Router",
        desc: "Workspace与Router配合使用,Router的用法",
        columns: ["参数", "说明", "类型", "默认值"],
        data: [
            ["fetchMenu", "获取menu的方法,每次Url发生改变都会去获取", "string", "-"],
            ["routes", <div>
                用于workspace路由配置的配置,参考示例<br/>
                {routes}<br/>
                示例中user-list为menu的key,要求必须唯一,UserList是一个React Class,即一个menu对应一个组件<br/>
                redirect包含的是所有的重定向配置, 配置 from, to<br/>
                custom包含的是所有的下级自定义配置,即每个菜单下可以有再下级的路由或不在menu中的路由,在custom中配置<br/>
                custom中的code代表要高亮的menu的code
            </div>, "Object", "-"],
            ["topRoutes", <div>
                用于workspace之外的路由配置的配置,理解为与workspace平级的顶层路由,参考示例<br/>
                {topRoutes}<br/>
                示例中path代表url路径,component表示渲染的组件<br/>
            </div>, "Object", "-"],
            ["app", <div>路由的顶层容器,是一个React Class,该类实现了workspace的使用<a href="http://git.sankuai.com/projects/HRDEV/repos/mtf.permission/browse/app/src/index.js" target="_blank">查看topRoute路由</a></div>, "React Class", "-"],
            ["menuModel", "menu 的数据规则, 会被下传给 app 容器", "string", <pre>{menuModel}</pre>],
            ["showDefaultPath", "是否控制默认路径显示,实现域名可以直接访问,而不是域名访问之后再跳转一个子url", "boolean", "true"],
            ["noFoundComponent", "node类型匹配不到功能是的错误显示组件", "React Class", "-"],
            ["noPermissionComponent", "无权限（路由存在但菜单中没有对应条目）时显示的内容，不设置的话菜单中不存在即视为找不到", "React Class", "-"],
            ["getEntryNode", "获取默认进入的节点,不设置的话直接进入菜单中第一个 node 类型的节点", "function(location, menu, callback) { callback(code) }", "-"],
            ["getPathMap", "获取路径的映射, 对每个 node 返回一个路径, 会覆盖掉 pathMap", "function(node, menu, callback) { callback(string) }", "-"],
            ["pathMap", "将被废弃, 请使用 getPathMap. 路径的映射,可以把某个code映射为自己需要的路径例如:{'post-list':'/resume/post-list'}", "Object", "-"],
            ["history", "使用react-router提供的路由,在使用的入口初始化history之后要求传给Router", "Object", "-"]
        ]
    }

];
