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

export default <div className="select-basic-demo">
  <Select placeholder="选择一个地址"
          onChange={onChange}
          unsearchable
          notFoundContent="Not Found"
          model={{idField:"value", showField: "label"}}
          getPopupContainer={getPopupContainer()}
          onFetchData={onFetchData}
  />
  <Select placeholder="选择一个地址"
          onChange={onChange}
          noSearchIfNoKeyword
          notFoundContent="Not Found"
          model={{idField:"value", showField: "label"}}
          getPopupContainer={getPopupContainer()}
          onFetchData={onFetchData}
  />
</div>