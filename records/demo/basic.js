import React from 'react';
import Records from '../index';
import M from '../../util';
import Dialog from "../../dialog";
import Bill from "../../bill";
import Button from "../../button";
import Toaster from "../../toaster";

const model = {
    "idField": "systemCode",
    "pageSize": 10,
    "search": {
        "column": 3,
        "alignment": "right",
        "fields": [
            {
                "code": "systemName",
                "label": "系统名称",
                "type": "text"
            },
            {
                "code": "systemCode",
                "label": "app key",
                "type": "text"
            },
            {
                "code": "inChargePersonCode",
                "label": "负责人",
                "type": "list",
                "model":{
                    "idField":"mis",
                    "showField":"name",
                    "tpl":"{{name}}({{mis}})"
                },
                "showCode":"inChargePersonName"
            },
            {
                "code": "statusCode",
                "label": "状态",
                "type": "list",
                "model":{
                    "idField":"statusCode",
                    "showField":"statusName"
                },
                "showCode":"stateName"
            }
        ],
        "events":[
            {
                "code":"inChargePersonCode",
                "type":"bind",
                "params":[],
                "url":"/api/dataset/employee"
            },
            {
                "code":"statusCode",
                "type":"bind",
                "params":[],
                "url":"/api/dataset/status"
            }
        ]
    },
    "console": {
        "buttons": [
            {
                "code": "search",
                "label": "搜索",
                "style": "primary",
                "hideIn": "row",
                "size": "small"
            },{
                "code": "enable",
                "label": "启用",
                "style": "default",
                "hideIn": "row",
                "size": "small"
            },
            {
                "code":"remove",
                "label":"删除",
                "style":"default",
                "requireData": true,
                "size": "small"
            }
        ]
    },
    "grid": {
        "columns": [
            {
                "code": "systemCode",
                "label": "app key",
                "type": "text"
            },{
                "code": "systemName",
                "label": "系统名称",
                "type": "text"
            },{
                "code": "inChargePersonMis",
                "label": "负责人",
                "type": "text"
            },{
                "code": "statusName",
                "label": "状态",
                "type": "text"
            },{
                "code": "secret",
                "label": "secret",
                "type": "text"
            },{
                "code": "operate",
                "label": "操作"
            }
        ],
        "pagination": {
            "defaultPageSize": 1,
            "size": "small",
        }
    }
};

const data ={
    "pageList": [
        {
            "systemCode": "zhaopin",
            "systemName": "招聘系统",
            "inChargePersonCode": "001",
            "inChargePersonMis": "zhangsan01",
            "inChargePersonName": "张三",
            "statusCode": "Y",
            "statusName": "有效",
            "secret": ""
        },
        {
            "systemCode": "huati",
            "systemName": "话题系统",
            "inChargePersonCode": "002",
            "inChargePersonMis": "李四02",
            "inChargePersonName": "李四",
            "statusCode": "Y",
            "statusName": "有效",
            "secret": "abc1234"
        },
        {
            "systemCode": "kaoqin",
            "systemName": "考勤系统",
            "inChargePersonCode": "003",
            "inChargePersonMis": "wangwu",
            "inChargePersonName": "王五",
            "statusCode": "N",
            "statusName": "无效",
            "secret": ""
        },
        {
            "systemCode": "jixiao",
            "systemName": "绩效系统",
            "inChargePersonCode": "004",
            "inChargePersonMis": "zhangsan02",
            "inChargePersonName": "张三",
            "statusCode": "Y",
            "statusName": "有效",
            "secret": "ghjkl121244"
        }
    ],
    "page":{
        "pageNo": 1,
        "pageSize": 10,
        "totalCount": 4,
        "totalPageCount": 1
    }
};

const billModel = {
    "idField":"systemCode",
    "column":"1",
    "alignment":"right",
    "forms":[
        {
            "fields":[
                {
                    "code":"systemName",
                    "label":"系统名称",
                    "type":"text",
                    "required":true,
                    "placeholder":"例如:离职系统",
                    "pattern":"^[\\s\\S]{0,20}$",
                    "validation":"系统名称不能为空,且不能超出20字"
                },
                {
                    "code":"systemCode",
                    "label":"app key",
                    "type":"text",
                    "placeholder":"例如:com.meituan.zhaopin",
                    "required":true,
                    "pattern":"^[^\u4e00-\u9fa5]{0,20}$",
                    "validation":"必填项,由数字、英文字母、\"_\"、\"-\"组合而成,最多20字"
                }
            ]
        }
    ],
    "events":[]
};


let bill,records;

//由于没有数据 我们采用mergeModel的方式自己写获取数据的逻辑
M.mergeModel(model,{
    "search.fields.statusCode":{
        onBind:function(){
            let callback = arguments[3];
            callback([
                {
                    "statusCode":"Y",
                    "statusName":"有效"
                },
                {
                    "statusCode":"N",
                    "statusName":"无效"
                }
            ]);
        }
    },
    "search.fields.inChargePersonCode":{
        onBind:function(){
            let callback = arguments[3];
            callback([
                {
                    "mis":"ceshi01",
                    "name":"测试1号"
                },
                {
                    "mis":"ceshi02",
                    "name":"测试2号"
                }
            ]);
        }
    },
    "console.buttons.add.action":function(){
        Dialog.show({
            title:"添加系统",
            className:"records-demo",
            content:<Bill ref={(target)=>{bill=target}} model={billModel}/>,
            buttons:[
                {
                    label: '保存',
                    type: 'primary',
                    action: (close) => {
                        if(bill.validate()){
                            //执行保存
                            console.info("执行了保存");
                            //执行完刷新数据
                            records.fetchData();
                            Toaster.show({
                                type: 'success',
                                title: '保存成功信息'
                            });
                            close();
                        }

                    }
                },
                {
                    label: '取消',
                    action: close => close()
                }
            ]
        });
    },
    "console.buttons.remove.action":function(records,selection){
        Dialog.confirm({
            title:"删除",
            content:"确定要删除嘛",
            onOk:function(close){
                //执行删除
                console.info(selection);
                //刷新数据
                records.fetchData();
                //提示删除成功
                Toaster.show({
                    type: 'success',
                    title: '删除成功信息'
                });
                //关闭弹出窗口
                close();
            }
        });
    },
    "grid.columns.operate.format":(row)=>{
        if (row['secret']) {
            return <Button label="修改" type="primary" shape="no-outline"
                           onClick={()=>{console.info("click:修改",row)}}/>
        } else {
            return <span>
                        <Button label="生成secret" type="primary" shape="no-outline"
                                onClick={()=>{console.info("click:生成secret",row)}}/>
                        &nbsp;&nbsp;&nbsp;
                        <Button label="修改" type="primary" shape="no-outline"
                                onClick={()=>{console.info("click:修改",row)}}/>
            </span>
        }
    }
});

//该方法可以是异步过去 支持async和await
async function fetchData(condition){
    console.info(condition);
    await M.delayAsync(1000);
    return data;
}


export default <Records ref={(target)=>{records=target}} model={model} fetchData={fetchData}/>