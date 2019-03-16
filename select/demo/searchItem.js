import React, { Component } from 'react';
import Select from '../index';


function onFetchData(customParams, filter, cb){
    if(customParams === 'no2'){
        cb && cb([]);
    }else if(customParams === 'no1'){
        cb && cb([{"id": 1, "desc": "当你在连续输入时不发送请求，所以我是不会出现的"}]);
    }
}

let model = {
    idField: "id",
    showField: "desc",
    showTpl: "{{desc}}",     //配置输入框的显示
    tpl: "{{desc}}"   //配置下拉列表的显示
};

const SearchItem = <div className="search-item">
    <Select model={model}
            placeholder="请输入"
            onFetchData={onFetchData.bind(window, 'no1')}
    />
    <Select onFetchData={onFetchData.bind(window, 'no2')}
            placeholder="请输入"
            notFoundContent="当onFetchData返回数组为空时我就显示啦"
    />
</div>;

export default SearchItem;