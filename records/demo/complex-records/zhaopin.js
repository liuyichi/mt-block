import React from 'react';
import M from "../../../util";
import { Records } from '../../index';
import { Dialog, Toaster } from '../../../index';

let model = {
  "idField": "id",
  "search": {
    "mode": "complex",
    "fields": [
      {
        "code": "keywords",
        "label": "关键词",
        "type": "text",
        "conf": {
          "placeholder": "按名字或手机号搜索"
        }
      },
      {
        "code": "city",
        "label": "城市",
        "type": "select",
        "model": {
          "idField": "id",
          "showField": "name"
        }
      },
      {
        "code": "bg",
        "label": "申请bg",
        "type": "select",
        "model": {
          "idField": "id",
          "showField": "name"
        }
      },
      {
        "code": "position",
        "label": "面试职位",
        "type": "select",
        "model": {
          "idField": "id",
          "showField": "name"
        }
      },
      {
        "code": "resultRate",
        "label": "面试结果",
        "type": "select",
        "show": false,
        "model": {
          "idField": "id",
          "showField": "name"
        }
      }
    ],
    "events": [],
    "filter": true
  },
  "console": {
    "buttons": [
      {
        "code": "add",
        "label": "通过",
        "style": "primary",
        "hideIn": "row"
      },
      {
        "code": "drop",
        "label": "放弃",
        "hideIn": "row"
      },
      {
        "code": "edit",
        "label": "编辑",
        "hideIn": "main"
      },
      {
        "code": "remove",
        "label": "删除",
        "hideIn": "main"
      }
    ]
  },
  "grid": {
    "columns": [
      {
        "code": "name",
        "label": "姓名",
        "type": "text",
        "filterModel": {
          "type": "text",
          "placeholder": "请输入姓名"
        }
      },
      {
        "code": "city",
        "label": "城市",
        "type": "select",
        "filterModel": {
          "type": "select",
          "idField": "id",
          "showField": "name"
        }
      },
      {
        "code": "workCity",
        "label": "工作城市",
        "type": "select",
        "showCode": "workCityName"
      },
      {
        "code": "position",
        "label": "面试职位",
        "type": "select",
        "showCode": "positionName"
      },
      {
        "code": "bg",
        "label": "申请bg",
        "type": "select",
        "showCode": "bgName"
      },
      {
        "code": "firstInterviewerResult",
        "label": "初试结果",
        "type": "select",
        "filterModel": {
          "type": "multiSelect",
          "idField": "id",
          "showField": "name"
        },
        "showCode": "firstInterviewerResultName"
      },
      {
        "code": "firstInterviewer",
        "label": "初试官",
        "type": "select",
        "filterModel": {
          "type": "text",
          "placeholder": "请输入姓名"
        },
        "showCode": "firstInterviewerName"
      },
      {
        "code": "firstInterviewDate",
        "label": "初试时间",
        "type": "date"
      },
      {
        "code": "secondInterviewerResult",
        "label": "复试结果",
        "type": "select",
        "showCode": "secondInterviewerResultName"
      },
      {
        "code": "secondInterviewer",
        "label": "复试官",
        "type": "select",
        "showCode": "secondInterviewerName"
      },
      {
        "code": "secondInterviewDate",
        "label": "复试时间",
        "type": "date"
      },
      {
        "code": "hrInterviewerResult",
        "label": "HR结果",
        "type": "select",
        "showCode": "hrInterviewerResultName"
      },
      {
        "code": "hrInterviewer",
        "label": "HR",
        "type": "select",
        "showCode": "hrInterviewerName"
      },
      {
        "code": "operate",
        "label": "操作",
        "type": "console"
      }
    ]
  },
  "setting": [
    {
      "code": "heading",
      "icon": "settings",
      "label": "设置列表字段"
    }
  ]
};

M.mergeModel(model, {
  "search": {
    "fields.city": {
      onBind: function () {
        let callback = arguments[3];
        callback([
          {"id": "1", "name": "上海"},
          {"id": "2", "name": "北京"},
          {"id": "3", "name": "杭州"},
          {"id": "12", "name": "天津"},
          {"id": "13", "name": "合肥"},
          {"id": "14", "name": "无锡"},
          {"id": "15", "name": "厦门"},
          {"id": "16", "name": "武汉"},
          {"id": "17", "name": "西安"},
          {"id": "18", "name": "大连"}
        ]);
      }
    },
    "fields.bg": {
      onBind: function () {
        let callback = arguments[3];
        callback([
          {"id": "0", "name": "都喜欢"},
          {"id": "1", "name": "外卖"},
          {"id": "2", "name": "餐饮"},
          {"id": "3", "name": "企业平台"}
        ]);
      }
    },
    "fields.position": {
      onBind: function () {
        let callback = arguments[3];
        callback([
          {"id": "0", "name": "前端"},
          {"id": "1", "name": "后端"},
          {"id": "2", "name": "产品"},
          {"id": "3", "name": "测试"}
        ]);
      }
    },
    "fields.resultRate": {
      onBind: function () {
        let callback = arguments[3];
        callback([
          {"id": "1", "name": "通过"},
          {"id": "2", "name": "待定"},
          {"id": "3", "name": "不通过"}
        ]);
      }
    }
  },
  "console.buttons": {
    "add.action": function () {
      Dialog.confirm({
        title: '确定新建吗？',
        onOk: async(close) => {
          await M.delayAsync(3000);
          Toaster.success('添加成功');
          close();
        }
      });
    },
    "remove.action": function (records, data) {
      console.log('删除中...', data.ids());
      Dialog.confirm({
        title: '确定删除吗？',
        onOk: (close) => {
          Toaster.success('删除成功');
          records.search();
          close();
        }
      });
    },
    "edit.action": function () {
      Dialog.show({
        title: '编辑详情',
        content: "编辑中...",
        onOk: (close) => {
          Toaster.success('编辑完成');
          records.search();
          close();
        }
      });
    }
  },
  "grid.columns": {
    "city.filterModel.onFetchData": async(filter) => {
      console.log(filter);
      await M.delayAsync(1000);
      return [
        {"id": "1", "name": "上海"},
        {"id": "2", "name": "北京"},
        {"id": "3", "name": "杭州"}
      ]
    },
    "firstInterviewResult.filterModel.onFetchData": async(filter) => {
      console.log(filter);
      await M.delayAsync(1000);
      return [
        {"id": "1", "name": "通过"},
        {"id": "2", "name": "待定"},
        {"id": "3", "name": "不通过"}
      ]
    }

  }
});
class Demo extends M.BaseComponent {
  render() {
    return (
      <div className="complex-records-demo">
        <Records.Complex
          mode="complex"
          model={model}
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
          "id": "1",
          "name": "王李峰",
          "city": "1",
          "cityName": "上海",
          "workCity": "1",
          "workCityName": "上海",
          "position": "1",
          "positionName": "前端",
          "bg": "1",
          "bgName": "企业平台",
          "firstInterviewer": "YG10001",
          "firstInterviewerName": "张三",
          "firstInterviewerResult": "1",
          "firstInterviewerResultName": "通过",
          "firstInterviewDate": "1503532800000",
          "secondInterviewer": "YG10002",
          "secondInterviewerName": "李四",
          "secondInterviewerResult": "2",
          "secondInterviewerResultName": "待定",
          "secondInterviewDate": "1503532800000",
          "hrInterviewer": "YG10003",
          "hrInterviewerName": "王五",
          "hrInterviewerResult": "3",
          "hrInterviewerResultName": "不通过"
        },
        {
          "id": "2",
          "name": "港湾",
          "city": "2",
          "cityName": "北京",
          "workCity": "1",
          "workCityName": "北京",
          "position": "1",
          "positionName": "后端",
          "bg": "1",
          "bgName": "企业平台",
          "firstInterviewer": "YG10011",
          "firstInterviewerName": "杨林",
          "firstInterviewerResult": "1",
          "firstInterviewerResultName": "通过",
          "firstInterviewDate": "1503532800000",
          "secondInterviewer": "YG10012",
          "secondInterviewerName": "小王",
          "secondInterviewerResult": "2",
          "secondInterviewerResultName": "待定",
          "secondInterviewDate": "1503532800000",
          "hrInterviewer": "YG10013",
          "hrInterviewerName": "王五",
          "hrInterviewerResult": "1",
          "hrInterviewerResultName": "通过"
        }
      ],
      "page": {
        "pageNo": 1,
        "pageSize": 20,
        "totalPageCount": 100,
        "totalCount": 1942
      }
    }
  }
}

export default <Demo />;

