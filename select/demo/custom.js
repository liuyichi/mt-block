import React, { Component } from 'react';
import Select from '../index';
import Icon from '../../icon/index';


let refs = null;

function getPopupContainer(){
  return document.querySelector('.select-basic-demo');
}
function onFetchData(filter,callback){
  let data = [
    {"id":"1","name":"港湾","mis":"gangwan","email":"gangwan@meituan.com","age":"24"},
    {"id":"2","name":"张三","mis":"zhangsan01","email":"zhangsan01@meituan.com","age":"24"},
    {"id":"3","name":"港湾","mis":"gangwan01","email":"gangwan01@meituan.com","age":"34"},
    {"id":"4","name":"李四","mis":"lisi01","email":"lisi01@meituan.com","age":"24"},
    {"id":"5","name":"王五","mis":"wangwu","email":"wangwu@meituan.com","age":"24"},
    {"id":"6","name":"王大可","mis":"wangdake","email":"wangdake@meituan.com","age":"26"},
    {"id":"7","name":"李白","mis":"libai46","email":"libai46@meituan.com","age":"30"}
  ];
  callback(data);
}
function onChange(value){
  console.info(value);
}

function onFetchDataSec(filter,callback){
    let data = [
        {"id": "like", "desc": "心动"},
        {"id": "dislike", "desc": "心不动"}
    ];
    callback(data);
}

let downTableModel = {
  idField:"id",
  showField:"desc",
    format:function(row){
      if(row['id'] === 'like'){
          return <div className="choose-object">
              <div>{Icon.heart}</div>
              <div>{row['desc']}</div>
          </div>
      }else if(row['id'] === 'dislike'){
          return <div className="choose-object">
              <div>{Icon.heartOlike}</div>
              <div>{row['desc']}</div>
          </div>
      }
    },
    tpl:"{{name}}({{mis}})"
};

let model = {
    idField:"id",
    showField:"name",
    height:300,
    format:function(row){
        return <div style={{borderBottom:"1px solid #cdcdcd"}}>
            {Icon.info}
          <div>{row['name']}</div>
          <small>邮箱:{row['email']}<br/>年龄:{row['age']}</small>
        </div>
    },
    showTpl:"{{name}}({{mis}})"
};

let align = {
    equalTargetWidth: true,    //与目标等宽
    points: ['tl', 'bl'],   //第一个元素为竖直方向，第二个元素为水平方向，该属性指输入框应该在下拉框的哪个位置
    offset: [0, 0],   //偏移量，第一个元素为水平方向，第二个元素为竖直方向
    overflow: {
        adjustX: false,
        adjustY: true,  //adjustY为true时弹窗会根据当前浏览器的显示情况调整弹层Y轴方向的显示位置，使窗口始终显示在当期那可视区域
    }
};

const basicCustom = <div className="select-basic-demo">
  <Select placeholder="选择姓名"
          onChange={onChange}
          notFoundContent="Not Found"
          model={model}
          onFetchData={onFetchData}
  />
  <Select placeholder="请选择第一印象"
          model={downTableModel}
          align={align}
          onFetchData={onFetchDataSec}
  />
</div>;

export default basicCustom;