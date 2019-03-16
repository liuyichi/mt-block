import React, { Component } from 'react';
import Select from '../index';


function onFetchData(filter, cb){
    let data = [
        {"id": 1, "name": "小曹", "sex": "男", "dePart": "集团/美特斯邦威/劳力士/果粒橙/哇哈哈/优酸乳"},
        {"id": 2, "name": "大曹", "sex": "男", "dePart": "集团/美特斯邦威/劳力士/果粒橙/哇哈哈/优酸乳"},
        {"id": 3, "name": "小刘", "sex": "男", "dePart": "集团/美特斯邦威/劳力士/果粒橙/哇哈哈/优酸乳"},
        {"id": 4, "name": "大孙", "sex": "男", "dePart": "集团/美特斯邦威/劳力士/果粒橙/哇哈哈/优酸乳"},
        {"id": 5, "name": "小诸", "sex": "男", "dePart": "集团/美特斯邦威/劳力士/果粒橙/哇哈哈/优酸乳"},
        {"id": 6, "name": "大周", "sex": "男", "dePart": "集团/美特斯邦威/劳力士/果粒橙/哇哈哈/优酸乳"}
    ];
    //这里对数据处理一下
    data.unshift({"id": "序号", "name": "姓名", "sex": "性别", "dePart": "部门"});
    cb && cb(data);
}

let model = {
    idField: "id",
    showField: "name",
    tpl: "{{id}}{{name}}{{sex}}",
    height: 150,
    format: (value) => <div className={!Number(value.id) ? "first": ""}>
        <span>{value.id}</span>
        <span>{value.name}</span>
        <span>{value.sex}</span>
    </div>
};

let partModel = {
    idField: "id",
    showField: "name",
    showTpl: "{{name}}({{dePart}})",
    tpl: "{{id}}{{name}}{{sex}}{{dePart}}",
    height: 150,
    format: (value) => <div className={!Number.isFinite(value.id) ? "first": ""}>
        <span>{value.id}</span>
        <span>{value.name}</span>
        <span>{value.sex}</span>
        <span className={Number.isFinite(value.id) ? "depart": ""}>{value.dePart}</span>
    </div>
};

let align = {
    equalTargetWidth: false,   //设置是否与源元素等宽，会被重新设置的css样式覆盖
    points: ['bl', 'll'],     //设置弹出框的位置
    offset: [0, 0],       //设置在points定位的基础上的偏移量
    overflow: {        //当adjustX设为true时，表示浏览器窗口水平方向缩小到影响弹出框显示时弹出框自动在水平方向上偏移
        adjustX: true,
        adjustY: true,
    }
};

const ListCustom = <div className="list-custom">
    <Select placeholder="请选择"
            model={model}
            onFetchData={onFetchData}
            align={align}
            triggerClassName="my-trigger"
    />
    <Select placeholder="请选择"
            model={partModel}
            onFetchData={onFetchData}
            align={align}
            triggerClassName="part-trigger"
    />
</div>;

export default ListCustom;