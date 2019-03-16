import React from "react";
import { Workspace } from '../index';
let avatar = require('./avatar.png');
let menu = require('./model/menu.json').data;
let config = {
    theme: 'light-dark',//"light-dark"
    logo: <span>招财喵</span>,
    menu: menu,
    menuModel:{
        idField: "nodeCode",
        showField: "nodeName",
        typeField: "nodeType",
        childrenField: "childrenMenuList"
    }, // menu 数据的配置, 默认 code 和 label
    //useTreeMenu: false, // 是否接受 menu 的结构是平级的
    hNavLevels: 1, // 水平大排行的级数, 可取 0|1|2, 默认 1
    onClickLogo: () => console.log("click logo"), // 点击logo的回调
    keepAsideNavLeft: false,//是否左边栏在最左边
    showCollapse: true,//是否显示折叠按钮
    //userModel: {
    // idField: 'id',
    // nameField: 'name',
    // avatarField: 'avatar',
    // showAvatar: true,
    // showName: false
    // },//获取用户信息下拉model, 此处是默认的设置
    onFetchUser: ()=>{return { name: "张三", avatar: avatar}}, //获取用户信息
    right: <a className="upload-resume" onClick={() => {
                    history.push({
                            pathname: '/upload-resume'
                    });
                 }}>上传简历</a>,
    footer: <div className="footer">copyright@2017 Block</div>,
    selected: "bpm",
    onToggleAsideMenu: (show) => console.log(`${show?"展开":"收起"}侧边栏`),
    format:function(model){
        if(model.code === "bpm") {
            return <span>{model.label}<span className="tags">{12}</span></span>
        }else{
            return model.label
        }
    }
};

export default <Workspace {...config} />