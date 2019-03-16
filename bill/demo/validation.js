import React from "react";
import "./index.scss";
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
                    "code": "requiredCode",
                    "label": "required必填",
                    "type": "text",
                    "conf": {
                        "placeholder":"必填,校验时机onBlur",
                        "required": true,
                        "validation": "required,必填项"
                    }
                },
                {
                    "code": "maxLength",
                    "label": "最大字符",
                    "type": "text",
                    "full": true,
                    "conf": {
                        "placeholder":"maxLength,超出10个字符不再显示",
                        "maxLength":"10",
                        "overLengthValidation":"最多只能输入10个字符",
                        "cutIfOverLength":true,
                    }
                }, {
                    "code": "pattern",
                    "label": "正则校验",
                    "type": "text",
                    "conf": {
                        "placeholder": "pattern,正则校验最大10个字符",
                        "pattern": "^[^\u4e00-\u9fa5]{0,10}$",
                        "validation": "必填项,由数字、英文字母、\"_\"、\"-\"组合而成,最多10字"
                    }
                },
                {
                    "code":"expectedLowMonthSalary",
                    "label":"级联校验",
                    "type":"number",
                    "addonAfter":"K",
                    "showHeader":true,
                    "onBlur":(bill,code,value,callback)=>{
                        if(bill.getElementByCode("expectedUpMonthSalary").getValue()!==""){
                            bill.getElementByCode("expectedUpMonthSalary").validate();
                        }

                    },
                    "conf":{
                        "placeholder":"最低月薪",
                        "clearIcon":false,
                        "autosize": true,
                        "validator":{
                            "onBlur": [
                                {
                                    "validator":(bill,value)=>{
                                        var r= /^\+?[1-9][0-9]*$/;
                                        var val=Number(value);
                                        if(value!==""&&val<=0){
                                            return '请输入有效的月薪，如9'
                                        }else if(value!==""&&r.test(val)==false){
                                            return '请输入有效的月薪，如9'
                                        }else if (value!==""&&val*2 < Number(bill.data.data.expectedUpMonthSalary)) {
                                            return '薪资跨度不能超过50%'
                                        }else if(value!==""&&Number(bill.data.data.expectedUpMonthSalary)<val){
                                            return '最高月薪需大于最低月薪'

                                        }else{



                                        }
                                    },

                                }
                            ]
                        }
                    },
                },
                {
                    "code":"expectedUpMonthSalary",
                    "label":"-",
                    "type":"number",
                    "addonAfter":"K",
                    "conf":{
                        "placeholder":"最高月薪",
                        "clearIcon":false,
                        "validator":{
                            "onBlur": [
                                {"validator":(bill,value)=> {
                                    var r= /^\+?[1-9][0-9]*$/;
                                    var val=Number(value);

                                    if(value!==""&&val<=0){
                                        return '请输入有效的月薪，如9'
                                    }else if(value!==""&&r.test(val)==false){
                                        return '请输入有效的月薪，如9'
                                    } else if (value!==""&&Number(bill.data.data.expectedLowMonthSalary)*2 <val) {
                                        return '薪资跨度不能超过50%'
                                    }else if(value!==""&&Number(bill.data.data.expectedLowMonthSalary)>val){
                                        return '最高月薪需大于最低月薪'

                                    }
                                }

                                }
                            ]
                        }
                    }
                }
            ]
        }
    ],

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
    }, "forms.basic.fields.inChargePersonMis":{
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
})

const data = {
    "textCode": "",
    "passwordCode": "800aaa",
    "numberCode":"123",
    "statusCode": "Y",
    "statusName": "有效",

};

export default <Bill className="bill-basic-demo" model={model} data={data}/>