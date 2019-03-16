import React from "react";
import "./index.scss";
import Bill from "../index";

const model = {
    "idField":"id",
    "code":"bill",
    "label":"bill全类型",
    "column":1,
    "alignment":"right",
    "forms":[
        {
            "code": "baseInfo",
            "fields":[
                {
                    "code":"name",
                    "label":"用户名",
                    "show":false,
                    "type":"text",
                    "conf": {
                        "pattern":"^[0-9a-zA-Z_]{1,30}$",
                        "required":true,
                        "placeholder":"只能是5位以上的数字字母",
                        "validation":"不能为空，只能使用5-30个下划线、字母和数字",
                        "full": true
                    },
                    "addonBefore": "K",
                    "addonAfter": "K"
                },
                {
                    "code":"nick",
                    "label":"昵称",
                    "type":"text",
                    "show":true,
                    "showHeader":true,
                    "alignment":"right",
                    /**
                     * bill 的 validate 被调用时, 会调用每一个原子组件的 validate, 此时 text/password/number/textarea 的校验规则如下:
                     *   如果原子组件的 required 不为 true, 判断 validator 中 onBlur/onChange 中有无规定 required 为 true, 如果为 true, 则传递给原子组件 required 为 true, validator 为该条规则中设置的 message
                     *   组件失去焦点时(onBlur), 优先校验 required, 其次 pattern, 其次 maxLength, 最后 validator 中 onBlur 定义的规则;
                     *      只要碰到校验失败的情况, 则不走后边的校验逻辑, 并返回 false, 如果所有的校验规则都成功了, 则去记忆上一次 onChange 时的校验结果.
                     *   组件在获得焦点的过程中(onChange), 输入字符时, 会校验 validator 中 onChange 定义的规则, 并返回校验结果.
                     */
                    "conf":{
                        "mode":"default",
                        "disabled":false,
                        "placeholder":"请输入admin查看级联效果",
                        "trigger":"onChange",
                        "maxLength": "8",
                        "overLengthValidation": "最多只能输入8个字符",
                        "validator":{
                            "onBlur":[
                                {"validator":(bill,value)=>{
                                    console.log(arguments);
                                }
                                }
                            ],
                            "onChange":[
                                {"validator":(bill,value)=>{
                                    if(!(new RegExp('^[^\\d]+$')).test(value)) {
                                        return '不支持输入数字哦'
                                    }
                                }}
                            ]
                        }
                    },
                    /**
                     * 当组件的值改变后外派到 Bill 时调用的方法
                     *  onChange
                     * @param value
                     * @param bill
                     * @param fieldHandler 是传给Bill的fieldAction方法
                     */
                    "onChange": (value,bill,fieldHandler)=>{
                        bill.valueChangeHandler("nick",value);
                        fieldHandler("nick",value,bill); // 告知 bill 去更新这个字段的值
                        if (value === "admin") {
                            bill.doControl({"show": ["name"], "disabled": ["address"], "disRequired": ["city"], "view": ["dept"]});
                            // 清空掉 city 的可选值
                            bill.refs.city.clearOption();
                        }

                        console.log("onChange:",arguments);
                    },
                    /**
                     * 自定义的事件, 事件与传出的参数都由组件而定
                     *  ["onFocus","onBlur","onClear"] 为 text/password/number/textarea 支持的事件
                     *  ["onFocus","onBlur","onClear","onSelect","onDeSelect","onSearch","onKeyDown"] 为 autoText/list/multiList/treeList/multiList 支持的事件
                     *  ["onBeforeUploadAll", "onBeforeUpload","onError","onSuccess"] 为 upload 支持的事件为
                     */
                    "onFocus": (bill,e)=>{
                        console.log("onFocus:",arguments);
                    },
                    "onBlur": (bill,e)=>{
                        console.log("onBlur:",arguments);
                    },
                    "onClear": (bill,e)=>{
                        console.log("onClear:",arguments);
                    },
                    /**
                     * 事件 ["onBind","onBindNode","onFetch","onControl","onUpload"]
                     *  onBind: autoText/list/multiList/treeList/treeMultiList 支持的获取下拉数据的事件
                     *  onBindNode: treeList/treeMultiList 支持的获取子节点的事件
                     *  onFetch: 某一个字段值改变后去获取影响到的其它字段的值
                     *  onControl: 某一个字段值改变后去控制其它字段的事件
                     *  onUpload: upload 支持的上传事件
                     */
                    "onFetch": (bill,code,value,callback)=>{
                        callback({nick: "fetch 出来的 nick"});
                        console.log("onFetch:" + arguments);
                    },
                    "onControl": (bill,code,value)=>{

                        console.log("onControl:" + arguments);
                    }
                },
                {
                    "code":"city",
                    "label":"工作城市",
                    "type":"select",
                    "showCode":"cityName",
                    "conf": {
                        "required":true,
                        "validation":"城市必选",
                        "placeholder":"选择城市",
                        "defaultValue": {"name":"北京","id":"q"},
                        "model":{
                            "idField":"id",
                            "showField":"name",
                            "tpl": "{{name}}({{id}})",
                            "showTpl": "{{name}}({{id}})",
                            /**
                             * 对与 list/multiList/treeList/treeMultiList, 可对下拉框中的每一项进行 format 来控制它的显示.
                             *  需要注意的是, 如果想要让下拉框中的每一项超长省略, 那么需要传回一个 inline 布局的 node
                             */
                            "format": (option)=>{
                                return (<div style={{display: 'inline'}} title={`我是format出来的: ${option.name}`}>
                                    我是format出来的: {option.name}
                                </div>)
                            },
                        },
                        /**
                         * 配置弹出的下拉框的位置, 具体的配置请查看 mtf.block/trigger/api.js
                         */
                        "align": {
                            points: ['bl', 'tl'], // bl 弹出框的左下边框对齐输入框的 bl 左下边框线
                            offset: [0, -2], // x 轴相距输入框 0 像素 y 轴相距输入框 2 像素
                            overflow: { // 是否自适应 x/y 轴  不建议下拉框组件去自适应 x/y 轴, 可能会造成搜索的时候由于数据的变化 输入框会上下跳动
                                adjustX: 0,
                                adjustY: 0,
                            }
                        }
                    },
                    /**
                     * 触发 bind 事件的情况, 1: 点击输入框并且当前组件没有可选值 2: 输入搜索关键字的时候
                     *  如若需要强制触发 bind 事件, 需要调用 clearOption 方法来清空可选值
                     */
                    "onBind": (bill,code,value,callback) => {
                        callback([{id: 1, name: "onBind 出来的可选项"}, {id: 2, name: "onBind 出来的可选项"}, {id: 3, name: "onBind 出来的可选项"}]);
                        console.log("onBind:" + arguments);
                    },
                },
                {
                    "code":"dept",
                    "label":"部门",
                    "type":"treeSelect",
                    "showCode":"deptName",
                    "conf":{
                        "required":true,
                        "validation":"城市必选",
                        "placeholder":"选择城市",
                        "model":{
                            "idField": "id",
                            "parentIdField": "parentId",
                            "showField": "name",
                            "leafField": "leaf",
                            "tpl": "{{id}}{{name}}"
                        },
                    },
                    /**
                     * 触发 bind 事件的情况, 1: 点击输入框并且当前组件没有可选值 2: 输入搜索关键字的时候
                     *  如若需要强制触发 bind 事件, 需要调用 clearOption 方法来清空可选值
                     */
                    "onBind": (bill,code,value,callback) => {
                        callback([{id: 1, name: "1 onBind 出来的可选项"}, {"id": 11, name: "1.1 onBind 出来的可选项", "parentId": 1},{"id": 2, name: "2 onBind 出来的可选项", "parentId": null}]);
                        console.log("onBind:" + arguments);
                    },
                    "onBindNode": (bill,code,node,callback)=>{
                        if (node.id === 2) {
                            callback([{id: 21, name: "2.1 onBind 出来的可选项", parentId: 2}, {id: 22, name: "2.2 onBind 出来的可选项", parentId: 2}])
                        }
                        console.log("onBindNode:" + arguments);
                    },
                },
                {
                    "code":"money",
                    "label":"金额",
                    "type":"number",
                    "conf":{
                        "tooltip":"支持输入2位小数",
                        "placeholder":"输入大于20或者小于20的金额,查看级联效果"
                    }
                },
                {
                    "code":"mail",
                    "label":"邮箱",
                    "type":"autoText",
                    "conf": {
                        "placeholder":"输入邮箱",
                        "maxLength": 4,
                        "showCount": true,
                        "cutIfOverLength": true
                    }
                },
                {
                    "code":"address",
                    "label":"地址",
                    "type":"autoText",
                    "conf":{
                        "placeholder":"请选择查看级联效果"
                    }
                },
                {
                    "code":"memo",
                    "label":"备注",
                    "type":"textarea",
                    "showHeader":true,
                    "conf":{
                        "placeholder":"备注",
                        "rows":2,
                        "autosize": true
                    }
                }
            ]
        },

        {
            "code": "footer",
            "label": "hideIfNoFieldVisible 控制 fields 为空或 fields 中所有的 field 都隐藏时不显示本模块",
            "hideIfNoFieldVisible": true
        },
        {
            "code": "footer2",
            "label": "hideIfNoFieldVisible 控制 fields 为空或 fields 中所有的 field 都隐藏时不显示本模块",
            "hideIfNoFieldVisible": true,
            "fields": [
                {
                    "code": "footer",
                    "label": "页码",
                    "type": "text"
                }
            ]
        }
    ],
    "events":[
        {
            "code":"address",
            "type":"bind",
            "params":["name", {"gender": "sex"}],
            "url":"/service/dataset/address"
        },
        {
            "code":"city",
            "type":"bind",
            "params":["name", {"gender": "sex"}],
            "url":"/service/dataset/city"
        },
        {
            "code":"city",
            "type":"control",
            "process":[
                {"condition":"city===1","show": ["name"]},
                {"condition":"city!=1","hide": ["name"]}
            ]
        },
        {
            "code":"address",
            "type":"fetch",
            "params":["city"],
            "fields": ["city", {"memo": "extraInfo"}],
            "url":"/service/fetch/address"
        },

        {
            "code":"money",
            "type":"control",
            "process":[
                {"condition":"money>20","show": ["name","footer"], "disable":["memo"], "optional": ["mail"], "view": ["address","city"]},
                {"condition":"money<=20","hide": ["name","footer"], "editable":["memo", "address","city"], "require": ["mail"]}
            ]
        },
        {
            "code": "city",
            "type": "fetch",
            "params": ["city"],
            "url": "/service/fetch/city"
        },
        {
            "code":"attachment",
            "type":"upload",
            "params":[],
            "url":"/attachment"
        },
    ]
};


const data = {
    "textCode": "",
    "passwordCode": "800aaa",
    "numberCode":"123",
    "statusCode": "Y",
    "statusName": "有效",

};

export default <Bill className="bill-basic-demo" model={model} data={data}/>