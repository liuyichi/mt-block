import React, {Component} from 'react';
import Select from '../index';

let requestParam = {    //这里是省，市选定的值，在select组件onChange时获得，作为参数用
    cityReqParam: null,
    countyReqParam: null
}, selectElements = {     //这里是组件元素，当前一个select需要控制后一个select状态时用
    province: null,
    city: null,
    county: null
};
let model = {
    idField: "value",
    showField: "label",
    tpl: "{{label}} {{value}}"
};

class Cascade extends Component {
    render() {
        return (
          <div className="select-custom-demo">
              <div className="select-panel">
                  <p>省，市，县级联，前一个需为后一个提供参数</p>
                  <Select placeholder="请输入省名"
                          model={model}
                          ref={(target) => {selectElements.province = target}}
                          selectOnlyOptionAtBegining={true}
                          onFetchData={this.onFetchData.bind(this,'province')}
                          onChange={this.onChange.bind(this,'province')}
                  /> -
                  <Select placeholder="请输入市名"
                          onFetchData={this.onFetchData.bind(this,'city')}
                          codesToShowFetchError={[
                    400, 0, {"errorCode": ["500"]}
                ]}
                          model={model}
                          notFoundContent="当前省份下没有城市"
                          ref={(target) => {selectElements.city = target}}
                          onChange={this.onChange.bind(this,'city')}
                  /> -
                  <Select placeholder="请输入县名"
                          onFetchData={this.onFetchData.bind(this,'county')}
                          model={model}
                          codesToShowFetchError={[
                    400, 0, {"errorCode": ["500"]}
                ]}
                          ref={(target) => {selectElements.county = target}}
                          onChange={this.onChange.bind(this,'county')}
                  />
              </div>
          </div>
        )
    }
    /**
     * 当选市时需要省作为参数，当选县时需要市作为参数
     * */
    onFetchData(params, filter, cb, errorCallback){
        let data;
        switch(params){
            case 'province':
                data = [
                    {"label": "北京", "value": "beijing"},
                    {"label": "云南", "value": "yunnan"},
                    {"label": "浙江", "value": "zhejiang"},
                    {"label": "黑龙江", "value": "heilongjiang"}
                ];
                break;
            case 'city':
                if(!requestParam['cityReqParam'] || requestParam['cityReqParam']['value'] === ''){
                    data = {"errorCode": "500", "message": "请选择省份"};
                    errorCallback(data);
                    return;
                }else{
                    if (requestParam['cityReqParam'].value === "beijing") {
                        cb([]);
                        return;
                    }
                    console.log(requestParam['cityReqParam']);
                    data = [
                        {"label": "昆明", "value": "kunming"},
                        {"label": "温州", "value": "wenzhou"},
                        {"label": "哈尔滨", "value": "harbin"}
                    ];
                }
                break;
            case 'county':
                if(!requestParam['countyReqParam'] || requestParam['countyReqParam']['value'] === ''){
                    data = {"errorCode": "500", "message": "请选择城市"};
                    errorCallback(data);
                    return;
                }else{
                    console.log(requestParam['countyReqParam']);
                    data = [
                        {"label": "陆良", "value": "luliang"},
                        {"label": "下野", "value": "xiaye"},
                        {"label": "巨鹿", "value": "julu"}
                    ];
                }
                break;
        }
        if(!filter){
            cb && cb(data);
        }else{
            let arr = [];
            data.forEach(function(row){
                if(row.label.indexOf(filter) > -1 || row.value.indexOf(filter) > -1){
                    arr.push(row);
                }
            });
            cb && cb(arr);
        }
    }
    onChange(param, value){
        switch (param){
            case 'province':
                requestParam['cityReqParam'] = value;
                selectElements.city.reset();
                selectElements.county.reset();
                break;
            case 'city':
                requestParam['countyReqParam'] = value;
                selectElements.county.reset();
                break;
        }
    }
};

export default <Cascade/>;