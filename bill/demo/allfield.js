import React from "react";
import Bill from "../index";
import M from "../../util";

const model = {
    "code": "system_bill",
    "idField": "busiSysCode",
    "column": "1",
    "alignment": "right",
    "forms": [
        {
            "code": "basic",
            "fields": [
                {
                    "code": "textCode",
                    "label": "text",
                    "type": "text",
                    "addonBefore": <span>$</span>,
                    "addonAfter": <span>K</span>,
                    "conf":{
                        "placeholder": "例如:900",
                        "validation": ""
                    }
                },
                {
                    "code": "passwordCode",
                    "label": "password",
                    "type": "password",
                }, {
                    "code": "numberCode",
                    "label": "number",
                    "type": "number",
                }, {
                    "code":"time",
                    "label":"app key",
                    "type":"time",
                    "conf":{
                        "placeholder":"例如:com.meituan.zhaopin",
                        "required":true,
                        "defaultValue": "11:12"
                    }
                },{
                    "code": "birthday",
                    "label": "date",
                    "type": "date",
                    "show": true,
                    "conf": {
                        "placeholder": "请输入日期",
                        "mode": "default",
                        "disabled": false,
                        "format": "%Y-%m"
                    }
                }, {
                    "code": "workDate",
                    "label": "rangeDate",
                    "type": "rangeDate",
                    "show": true,
                    "conf": {
                        "mode": "default",
                        "disabled": false,
                        "required": true,
                        "validation": "必填项",
                        "format": "%Y-%m-%d"
                    }
                },
                {
                    "code": "statusCode",
                    "label": "select",
                    "type": "select",
                    "showCode": "statusName",
                    "conf":{
                        "selectFirstOptionAtBeginning": true,
                        "model": {
                            "idField": "statusCode",
                            "showField": "statusName"
                        },
                    },
                }, {
                    "code": "dept",
                    "label": "treeSelect",
                    "type": "treeSelect",
                    "showCode": "deptName",
                    "objToServer": true,
                    "conf":{
                        "placeholder": "请选择",
                        "model": {
                            "idField": "id",
                            "parentIdField": "parentId",
                            "showField": "name",
                            "leafField": "leaf",
                            "tpl": "{{id}}{{name}}",
                            "showTpl": "{{id}}{{name}}"
                        },
                        "defaultValue": {"id": "Y", "name": "有效"},
                    },
                    /**
                     * 触发 bind 事件的情况, 1: 点击输入框并且当前组件没有可选值 2: 输入搜索关键字的时候
                     *  如若需要强制触发 bind 事件, 需要调用 clearOption 方法来清空可选值
                     */
                    "onBind": (bill, code, value, callback) => {
                        callback([{id: 1, name: "1 onBind 出来的可选项"}, {
                            "id": 11,
                            name: "1.1 onBind 出来的可选项",
                            "parentId": 1
                        }, {"id": 2, name: "2 onBind 出来的可选项", "parentId": null}]);
                        console.log("onBind:" + arguments);
                    },
                    "onBindNode": (bill, code, node, callback)=> {
                        if (node.id === 2) {
                            callback([{id: 21, name: "2.1 onBind 出来的可选项", parentId: 2}, {
                                id: 22,
                                name: "2.2 onBind 出来的可选项",
                                parentId: 2
                            }])
                        }
                        console.log("onBindNode:" + arguments);
                    }
                }, {
                    "code": "inChargePersonMis",
                    "label": "multiSelect",
                    "type": "multiSelect",
                    "conf":{
                        "required": true,
                        "validation": "请指定相应的招聘负责人",
                        "model": {
                            "idField": "mis",
                            "showField": "name",
                            "tpl": "{{name}}",
                            "height": 148,
                            "showIcon": true,
                            "local": true,
                            "showTpl":"{{name}}{{mis}}"
                        },
                        "defaultValue": [{"name": "xxx", "mis": "aaa"}]
                    }
                }, {
                    "code": "deptMulti",
                    "label": "treeMultiSelect",
                    "type": "treeMultiSelect",
                    "conf": {
                        "placeholder": "请选择",
                        "model": {
                            "idField": "id",
                            "parentIdField": "parentId",
                            "showField": "name",
                            "leafField": "leaf",
                            "tpl": "{{id}}{{name}}",
                            "showTpl": "{{id}}{{name}}"
                        },
                        "defaultValue": [{"id": "xxx", "name": "aaa", "parentId": "111"}],
                    },
                    /**
                     * 触发 bind 事件的情况, 1: 点击输入框并且当前组件没有可选值 2: 输入搜索关键字的时候
                     *  如若需要强制触发 bind 事件, 需要调用 clearOption 方法来清空可选值
                     */
                    "onBind": (bill, code, value, callback) => {
                        callback([{id: 1, name: "1 onBind 出来的可选项", "parentId": "0"}, {
                            "id": 11,
                            name: "1.1 onBind 出来的可选项",
                            "parentId": 1
                        }, {"id": 2, name: "2 onBind 出来的可选项", "parentId": null}]);
                        console.log("onBind:" + arguments);
                    },
                    "onBindNode": (bill, code, node, callback)=> {
                        if (node.id === 2) {
                            callback([{id: 21, name: "2.1 onBind 出来的可选项", parentId: 2}, {
                                id: 22,
                                name: "2.2 onBind 出来的可选项",
                                parentId: 2
                            }])
                        }
                        console.log("onBindNode:" + arguments);
                    }
                }, {
                    "code": "workType",
                    "label": "radio",
                    "type": "radio",
                    "conf": {
                        "range": [{"label": "测试1", "value": true}, {"label": "测试2", "value": false}, {"label": "正式", "value": "1"}, {"label": "兼职", "value": "3"}, {
                            "label": "实习",
                            "value": "2"
                        }],
                        "defaultValue": false,
                        "required": true
                    },
                },
                {
                    "code": "attractList",
                    "label": "checkbox",
                    "type": "checkbox",
                    "conf": {
                        "range": [
                            {"label": "测试", "value": 12},
                            {"label": "测试", "value": "1"},
                            {"label": "测试", "value": "2"},
                            {"label": "测试", "value": "3"},
                            {"label": "测试", "value": "5"},
                            {"label": "测试", "value": "6"},
                            {"label": "测试", "value": "7"},
                            {"label": "测试", "value": "8"},
                            {"label": "测试", "value": "9"},
                            {"label": "测试1", "value": true},
                            {"label": "测试2", "value": false},
                        ],
                        required: true,
                        validation: "请勾选不超过4个职位亮点",
                        "validator": (bill, value)=> {
                            if (value.length > 4 || value.length == 0) {
                                return "请勾选不超过4个职位亮点"
                            }
                        }
                    },
                    //"onChange":(bill,value,e)=>{
                    //
                    //}
                },
                {
                    "code": "textareaCode",
                    "label": "textarea",
                    "type": "textarea",
                    "conf": {
                        "placeholder": "不能超过10个字符",
                        "maxLength": "10",
                        "cutIfOverLength": true,
                        "showCount": true,
                        "clearIcon": false
                    }

                },

                        {
                            "code":"attachment",
                            "label":"附件upload",
                            "type":"upload",
                            "addonBefore": "K",
                            "addonAfter": "K",
                            "conf":{
                                "model": {
                                    "idField": "id",
                                    "nameField": "name",
                                    "urlField": "url"
                                },
                                "defaultValue": [
                                    {"id": "1", "name": "哈哈哈哈", "url": "http://www.baidu.com"},
                                    {"id": "2", "name": "呵呵呵呵", "url": "http://www.baidu.com"}
                                ],
                                "locale":{
                                    "desc": "请上传一张自拍(1M以内)",
                                    "label": "千军一发"
                                },
                                "droppable": false,
                                "fileType": ".png.jpg",
                                "fileMaxSize": 1048576,
                                "multiple": true,
                                "durationIfSucceed": 1000
                            },
                            "onDelete": (file) => {
                                return false;
                            }
                        }

            ]
        }
    ],
    "events": [
        {
            "code": "attachment",
            "type": "upload",
            "params": [],
            "url": "/attachment"
        }
    ]

};

//由于没有数据 我们采用mergeModel的方式自己写获取数据的逻辑
M.mergeModel(model, {
    "forms.basic.fields.statusCode": {
        onBind: function () {
            let callback = arguments[3];
            callback([
                {
                    "statusCode": "Y",
                    "statusName": "有效"
                },
                {
                    "statusCode": "N",
                    "statusName": "无效"
                }
            ]);
        }
    }, "forms.basic.fields.inChargePersonMis": {
        onBind: function () {
            let callback = arguments[3];
            callback([
                {
                    "mis": "ceshi01",
                    "name": "测试1号"
                },
                {
                    "mis": "ceshi02",
                    "name": "测试2号"
                }
            ]);
        }
    }
});

const data = {
    "textCode": "90",
    "passwordCode": "800aaa",
    "numberCode": "123",
};

export default <Bill className="bill-basic-demo" model={model} data={data}/>