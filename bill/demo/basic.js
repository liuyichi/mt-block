import React from 'react';
import Bill from '../index';
import M from '../../util';

const model = {
    "code":"system_bill",
    "idField":"busiSysCode",
    "column":"1",
    "alignment":"right",
    "forms":[
        {
            "code":"basic",
            "fields":[
                {
                    "code":"busiSysName",
                    "label":"系统名称",
                    "type":"text",
                    "conf":{
                        "required":true,
                        "placeholder":"例如:离职系统",
                        "pattern":"^[\\s\\S]{0,20}$",
                        "validation":"系统名称不能为空,切不能超出20字"
                    }
                },
                {
                    "code":"busiSysCode",
                    "label":"app key",
                    "type":"text",
                    "conf":{
                        "placeholder":"例如:com.meituan.zhaopin",
                        "required":true,
                        "pattern":"^[^\u4e00-\u9fa5]{0,20}$",
                        "validation":"必填项,由数字、英文字母、\"_\"、\"-\"组合而成,最多20字"
                    }
                },
                {
                    "code":"statusCode",
                    "label":"状态",
                    "type":"select",
                    "model":{
                        "idField":"statusCode",
                        "showField":"statusName"
                    },
                    "showCode":"statusName",
                    "defaultValue":{"statusCode":"Y","statusName":"有效"}
                },
                {
                    "code":"inChargePersonMis",
                    "label":"负责人",
                    "type":"select",
                    "showCode":"inChargePersonName",
                    "conf":{
                        "model":{
                            "idField":"mis",
                            "showField":"name"
                        },
                    }
                }
            ]
        }
    ],
    "events":[
        {
            "code":"inChargePersonMis",
            "type":"bind",
            "params":[],
            "url":"/api/dataset/employee"
        }
    ]
};

//由于没有数据 我们采用mergeModel的方式自己写获取数据的逻辑
M.mergeModel(model,{
    "forms.basic.fields.statusCode":{
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
    "forms.basic.fields.inChargePersonMis":{
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
    }
});

const data = {
    "busiSysCode": "jixiao",
    "busiSysName": "绩效系统",
    "inChargePersonCode": "004",
    "inChargePersonMis": "zhangsan02",
    "inChargePersonName": "张三",
    "statusCode": "Y",
    "statusName": "有效",
    "secret": "a0b5d7g8"
};

export default <Bill className="bill-basic-demo" model={model} data={data}/>