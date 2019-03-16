import React, { Component } from 'react';
import _ from 'lodash-compat';
import Table from "../../table/index";
import "./index.scss";

function getLink(repos, code,link){
    let baseLink = `http://git.sankuai.com/projects/STAF/repos/${repos}/browse/`;
    return baseLink+code+"/demo/"+link;
}

/**
 * 生成表格
 */
function createTable(conf){
    let columns = [],dataSource=[];
    //生成columns
    _.forEach(conf.columns,function(column,i){
        columns.push({
            key:"column_"+i,
            dataIndex:"column_"+i,
            className: "column_"+i,
            title:column,
            render:text => <span>{text}</span>
        })
    });
    //设置宽度
    if(conf.widths&&conf.widths.length>0){
        _.forEach(conf.widths,function(width,i){
            if(width){
                columns[i]['width'] = width;
            }
        })
    }
    //生成数据
    _.forEach(conf.data,function(obj,i){
        let dataItem = {};
        dataItem.key="_"+i;
        _.forEach(obj,function(desc,index){
            dataItem["column_"+index] = desc;
        });
        dataSource.push(dataItem);
    });
    return <Table className="api-table" dataSource={dataSource} columns={columns} pagination={false}/>
}

/**
 * 生成doc组件 传入参数为conf
 * {sub:{},stage:{},other:jsx,demos:{},api:[]}
 */
class Doc extends Component {
    createSubElement(){
        let sub = this.props.sub;
        if(!sub){
            return "";
        }
        return <div className="sub">
            <h1>{sub.title}</h1>
            {(typeof sub.desc)=="string"?<p>{sub.desc}</p>:sub.desc}
        </div>
    }
    createStageElement(){
        let stage = this.props.stage;
        if(!stage){
            return "";
        }
        return <div className="stage">
            <h2>{stage.title}</h2>
            {(typeof stage.desc)=="string"?<p>{stage.desc}</p>:stage.desc}
        </div>
    }
    createDemosElement(){
        let demos = this.props.demos;
        let code = this.props.code;
        let repos = this.props.repos || 'mtf.block';
        if(!demos){
            return "";
        }
        return <div className="demos">
            <h2>代码示例</h2>
            {demos.map(function(demo,index){
                return <div key={index} id={demo.code} className="demo-box">
                    {demo.title?<div className="box-header">{demo.title}</div>:""}
                    <div className="box-body">{demo.element}</div>
                    <div className="box-meta">
                        {(typeof demo.desc)=="string"?<p>{demo.desc}</p>:demo.desc}
                        {demo.link?<p className="box-link"><a href={getLink(repos,code,demo.link)} target="_blank">点我查看代码示例</a></p>:""}
                    </div>
                </div>
            })}
        </div>
    }
    createApiElement(){
        let api = this.props.api;
        if(api&&api.length>0){
            return <div className="api">
                <h2 id="API">
                    <span>API</span>
                    <a href="#API" className="anchor">#</a>
                </h2>
                {api.map(function(table,i){
                    return <div key={i}>
                        <h3 id={table.title}>
                            <span>{table.title}</span>
                            <a href={"#"+table.title} className="anchor">#</a>
                        </h3>
                        {table.desc?<p>{table.desc}</p>:""}
                        {createTable(table)}
                    </div>
                })}
            </div>
        }
        return "";
    }
    /*
    * 生成导航link集合
    */
    createNavElement(){
        let demos = this.props.demos;
        return <ul className="demo-link-list">
            {demos.map(function(demo,i){
                return <li key={i} className="demo-link">
                    <a href={"#"+demo.code}>{demo.title}</a>
                </li>
            })}
        </ul>
    }
    createOtherElement(){
        let otherElements = this.props.other;
        return otherElements;
    }
    render(){
       return <div className={"block-demo "+(this.props.className||"")}>
           {this.createNavElement()}
           {this.createSubElement()}
           {this.createStageElement()}
           {this.createDemosElement()}
           {this.createApiElement()}
           {this.createOtherElement()}
       </div>;
    }
}

export default Doc
