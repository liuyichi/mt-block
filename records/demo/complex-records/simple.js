import React from 'react';
import M from '../../../util';
import {Records} from '../../../index';
import Model from './model/simple';

M.mergeModel(Model, {
  "search.fields.position": {
    onBind: function () {
      let callback = arguments[1];
      callback([
        {"id": 1, "name": "系统工程师"},
        {"id": 2, "name": "前端工程师"},
        {"id": 3, "name": "销售经理"},
        {"id": 4, "name": "人力资源经理"},
        {"id": 5, "name": "系统工程师"},
        {"id": 6, "name": "android工程师"},
        {"id": 7, "name": "ios工程师"},
        {"id": 8, "name": "测试"},
        {"id": 9, "name": "产品经理"}
      ]);
    }
  },
  "search.fields.type": {
    onBind: function () {
      let callback = arguments[1];
      callback([
        {"id": "1", "name": "开发", "code": "RD"},
        {"id": "2", "name": "前端", "code": "FE"},
        {"id": "3", "name": "产品", "code": "PM"}
      ]);
    }
  },
  "search.fields.location": {
    onBind: function () {
      let callback = arguments[1];
      callback([
        {"id": "1", "name": "北京"},
        {"id": "2", "name": "上海"},
        {"id": "3", "name": "广州"},
        {"id": "4", "name": "深圳"},
        {"id": "5", "name": "杭州"},
        {"id": "6", "name": "厦门"},
        {"id": "7", "name": "成都"}
      ]);
    }
  },
  "search.fields.channel": {
    onBind: async function () {
      await M.delayAsync(1000);
      return [
        {"id": "1", "name": "51job"},
        {"id": "2", "name": "猎聘"},
        {"id": "3", "name": "boss直聘"},
        {"id": "4", "name": "内推"},
        {"id": "5", "name": "转岗"}
      ];
    }
  },
  "console.buttons.drop.action": async() => {
    await M.delayAsync(1500);
  },
  "console.buttons.cancel.action": async(...args) => {
    console.log('取消', args);
  }
});

class Demo extends M.BaseComponent {
  render() {
    return (
      <div className="complex-records-demo complex-records-demo--simple">
        <Records.Complex
          mode="complex"
          model={Model}
          fetchData={this._fetchData}
          onSearchFieldsFilter={(...args) => {
            console.log(...args);
          }}
          onColumnsFilter={(...args) => {
            console.log(...args);
          }} />
      </div>
    );
  }

  async _fetchData(condition) {
    console.info(condition);
    await M.delayAsync(1000);
    return {
      "pageList": [
        {
          "id": "179396407273",
          "name": "点小评",
          "company": "某投行",
          "position": "投资经理",
          "city": "北京市"
        },
        {
          "id": "199328195394273382",
          "name": "评小点",
          "company": "某证券",
          "position": "售后服务",
          "city": "上海市"
        },
        {
          "id": "3324606230167552",
          "name": "团小美",
          "company": "某保险",
          "position": "推销",
          "city": ""
        },
        {
          "id": "199327100587212819",
          "name": "美小团",
          "company": "某互联网",
          "position": "中级开发工程师",
          "city": "北京市"
        },
        {
          "id": "3324649199468544",
          "name": "小点评",
          "company": "某硬件设备",
          "position": "技术支持",
          "city": "北京市"
        },
        {
          "id": "3324531833765888",
          "name": "小美团",
          "company": "某快消品",
          "position": "广告策划",
          "city": ""
        },
        {
          "id": "3324687036006400",
          "name": "美团团",
          "company": "某通讯",
          "position": "测试",
          "city": "北京市"
        }
      ],
      "page": {
        "pageNo": 1,
        "pageSize": 20,
        "totalCount": 10798,
        "totalPageCount": 5399,
        "totalPageCountNoCalculate": 5399
      }
    };
  }
}

export default <Demo />;
