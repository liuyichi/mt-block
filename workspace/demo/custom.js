import React from "react";
import M from '../../util';
import { Workspace } from '../index';
import Router from '../router/index';
import { useRouterHistory } from 'react-router';
import { createHashHistory} from 'history';
import config from './custom/config'
const history = useRouterHistory(createHashHistory)({ queryKey: false });

class App extends M.BaseComponent{
    constructor(props){
        super(props);
        var self = this;
        this.state ={
            tags:{
                "post-list":8
            }
        };
        Object.assign(this.state,{
            config: {
                theme: 'light-dark',//"light-dark"
                hNavLevels: 1,
                logo:<span>招财喵</span>,
                keepAsideNavLeft: false,//是否左边栏在最左边
                right: <a onClick={() => {
                    history.push({
                            pathname: '/upload-resume'
                    });
                 }}>上传简历</a>,
                format:function(model){
                    if(self.state.tags&&self.state.tags[model.code]){
                        return <span>{model.label}<span>{self.state.tags[model.code]}</span></span>
                    }else{
                        return model.label
                    }
                }
            }
        });
    }
    componentDidMount(){
        window.app = this;
        this.history = history;
    }

    refreshPostNum(){
        //去数据然后更新state
        let tags = this.state.tags;
        tags['post-list'] +=1;
        this.setState({tags:tags});
    }

    render(){
        return <Workspace menu={this.props.menu} {...this.state.config} {...this.props} />
    }
}
let _menu;
function fetchMenuHandler(location,callback){
    _menu = require('./model/menu.json').data;
    callback&&callback(_menu);
}
function getEntryNode(location,menu,callback){
    callback&&callback('bpm-apprv');
}
function getPathMap(node,menu,callback) {
    callback&&callback(node.basePath ? node.basePath + '/' + node[config.menuModel.idField] : '');
}

export default <Router history={history}
                       app={App}
                       menuModel={config.menuModel}
                       fetchMenu={fetchMenuHandler}
                       topRoutes={config.topRoutes}
                       getEntryNode={getEntryNode}
                       getPathMap={getPathMap}
                       noFoundComponent={config.noFoundComponent}
                       routes={config.routes} />