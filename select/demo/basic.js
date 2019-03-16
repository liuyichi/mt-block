import React, { Component } from 'react';
import Select from '../index';

function getPopupContainer() {
  return document.querySelector('mt-workspace__detail');
}
function onFetchData(filter, callback) {
  let _data = [
    {"value": "1", "label": "北京"},
    {"value": "2", "label": "上海"},
    {"value": "3", "label": "深圳"},
    {"value": "4", "label": "广州"},
    {"value": "5", "label": "杭州"},
    {"value": "6", "label": "成都"},
    {"value": "7", "label": "南京"}
  ];
  if (!filter) {
    callback(_data);
  } else {
    let data = [];
    for (var i = 0; i < _data.length; i++) {
      if (_data[i]['label'].indexOf(filter) != -1) {
        data.push(_data[i]);
      }
    }
    callback(data);
  }
}
function onChange(value) {
  console.info(value);
}

function onFetchTextData(filter, callback) {
  let suffix = ["@meituan.com", "@163.com", "@qq.com"], data = [];
  if (filter) {
    for (var i = 0; i < suffix.length; i++) {
      if (filter.indexOf('@') != -1) {
        filter = filter.substring(0, filter.indexOf('@'));
      }
      data.push(filter + suffix[i]);
    }
    callback(data);
  }
  callback(data);
}

export default <div className="select-basic-demo">
  <div className="select-panel">
    <p>单选 分三种状态显示 default|disabled|view</p>
    <Select placeholder="选择一个地址111111"
            onChange={onChange}
            notFoundContent="Not Found"
            defaultActiveFirstOption={true}
            model={{idField:"value", showField: "label"}}
            getPopupContainer={getPopupContainer()}
            onFetchData={onFetchData}
            selectOnlyOptionAtBegining={true}
            onFocus={ () => console.log(1111) }
    />
    <Select defaultValue={{"label":"北京","value":"1"}}
            model={{idField:"value", showField: "label"}}
            disabled={true}
    />
    <Select defaultValue={{"label":"北京","value":"1"}}
            model={{idField:"value", showField: "label"}}
            mode="view"
    />
  </div>
  <div className="select-panel">
    <p>多选</p>
    <Select placeholder="选择多个地址"
            multiple={true}
            onChange={onChange}
            defaultActiveFirstOption={true}
            defaultValue={[{"label":"北京","value":"1"},{"label":"上海","value":"2"}]}
            notFoundContent="Not Found"
            model={{idField:"value", showField: "label"}}
            getPopupContainer={getPopupContainer()}
            onFetchData={onFetchData}
    />
    <Select defaultValue={[{"label":"北京","value":"1"},{"label":"上海","value":"2"}]}
            multiple={true}
            model={{idField:"value", showField: "label"}}
            disabled={true}
    />
    <Select defaultValue={[{"label":"北京","value":"1"},{"label":"上海","value":"2"}]}
            multiple={true}
            model={{idField:"value", showField: "label"}}
            mode="view"
    />
  </div>
  <div className="select-panel">
    <p>多选不带复选框</p>
    <Select placeholder="选择多个地址"
            onChange={onChange}
            multiple={true}
            checkbox={false}
            notFoundContent="Not Found"
            model={{idField:"value", showField: "label",format: (v)=>v.label}}
            getPopupContainer={getPopupContainer()}
            onFetchData={onFetchData}
    />
    <Select placeholder="选择多个地址"
            onChange={onChange}
            multiple={true}
            disabled={true}
            checkbox={false}
            notFoundContent="Not Found"
            model={{idField:"value", showField: "label",format: (v)=>v.label}}
            getPopupContainer={getPopupContainer()}
            onFetchData={onFetchData}
    />
  </div>
  <div className="select-panel">
    <p>这是一个联想输入框 本质上是一个input</p>
    <Select placeholder="请输入邮箱"
            combobox={true}
            onChange={onChange}
            defaultValue="gangwan"
            notFoundContent="Not Found"
            getPopupContainer={getPopupContainer()}
            onFetchData={onFetchTextData}
    />
    <Select combobox={true}
            defaultValue="gangwan@meituan.com"
            disabled={true}
    />
    <Select combobox={true}
            defaultValue="gangwan@meituan.com"
            mode="view"
    />
  </div>

</div>;