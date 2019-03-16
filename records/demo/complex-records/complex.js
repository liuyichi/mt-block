import React from 'react';
import M from '../../../util';
import {Records} from '../../index';
import Model from './model/complex';
import {Dialog, Toaster} from '../../../index';

M.mergeModel(Model, {
  "search.fields.type": {
    onBind: function () {
      let callback = arguments[3];
      callback([
        {"id": "1", "name": "开发", "code": "RD"},
        {"id": "2", "name": "前端", "code": "FE"},
        {"id": "3", "name": "产品", "code": "PM"}
      ]);
    }
  },
  "search.fields.location": {
    onBind: function () {
      let callback = arguments[3];
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
  "search.fields.department2": {
    onBind: function () {
      let callback = arguments[3];
      callback([
        {"id": 1, "parentId": 0, "name": "集团"},
        {"id": 10, "parentId": 0, "name": "餐饮平台", "leaf": true},
      ]);
    },
    onBindNode: function () {
      let callback = arguments[3];
      callback([
        {"id": 20, "parentId": 1, "name": "企业平台"},
        {"id": 201, "parentId": 20, "name": "企业平台研发部"},
        {"id": 2011, "parentId": 201, "name": "前端组", "leaf": true},
        {"id": 2012, "parentId": 201, "name": "后端组", "leaf": true},
        {"id": 2013, "parentId": 201, "name": "产品组", "leaf": true},
        {"id": 202, "parentId": 20, "name": "大象"},
        {"id": 2021, "parentId": 202, "name": "前端组", "leaf": true}
      ]);
    }
  },
  "search.fields.custom.Component": (props) => <div>自定义组件</div>,
  "console.buttons.add.action": (records, data, model, button, event) => {
    Dialog.confirm({
      title: '确定新建吗？',
      onOk: async(close) => {
        await M.delayAsync(3000);
        Toaster.success('添加成功');
        close();
      }
    });
  },
  "console.buttons.remove.action": (records, data, model, button, event) => {
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
  "console.buttons.edit.action": (records, data, model, button, event) => {
    console.log('编辑中... ', data.ids());
  },
  "setting.qrcode.action": (...args) => {
    console.log(args);
    Toaster.error('无效点击');
  },
  "setting.download.Component": <a href="https://123.sankuai.com" target="_blank">123门户</a>,
  "grid.columns.status.filterModel": {
    onFetchData: async(filter) => {
      console.log(filter);
      await M.delayAsync(1000);
      return [
        {text: '提交', value: 1},
        {text: '通过', value: 2},
        {text: '驳回', value: 3},
        {text: '撤销', value: 4},
        {text: '通过通过通过', value: 5},
        {text: '驳回2', value: 6},
        {text: '撤销撤销', value: 7}
      ];
    },
  },
  "grid.columns.status.filters": [
    {text: '提交', value: 1},
    {text: '通过', value: 2},
    {text: '驳回', value: 3},
    {text: '撤销', value: 4},
    {text: '通过2', value: 5},
    {text: '驳回2', value: 6},
    {text: '撤销2', value: 7}
  ],
  "grid.columns.formType.filterModel.onFetchData": async(filter) => {
    console.log(filter);
    await M.delayAsync(1000);
    return [
      {name: '请假', id: 1},
      {name: '延时工作报销', id: 2},
      {name: '申请公积金', id: 3},
      {name: '采购', id: 4},
      {name: '社保', id: 5},
      {name: '员工福利', id: 6},
      {name: '资产核实', id: 7}
    ];
  },
  "grid.columns.formType.filters": [
    {name: '请假', id: 1},
    {name: '延时工作报销', id: 2},
    {name: '申请公积金', id: 3},
    {name: '采购', id: 4},
    {name: '社保', id: 5},
    {name: '员工福利', id: 6},
    {name: '资产核实', id: 7}
  ],
});

class Demo extends M.BaseComponent {
  constructor(props) {
    super(props);
    M.mergeModel(Model, {
      'search.fields.department1': {
        onBind: (bill, code, filter, callback) => {
          // 利用records获取当前搜索条件，用于onBind时绑定参数的情况
          const condition = this.records.getFilter();
          console.log(condition.location);
          callback([
            {"id": 1, "parentId": 0, "name": "集团"},
            {"id": 10, "parentId": 0, "name": "餐饮平台", "leaf": true},
            {"id": 20, "parentId": 1, "name": "企业平台"},
            {"id": 201, "parentId": 20, "name": "企业平台研发部"},
            {"id": 2011, "parentId": 201, "name": "前端组", "leaf": true},
            {"id": 2012, "parentId": 201, "name": "后端组", "leaf": true},
            {"id": 2013, "parentId": 201, "name": "产品组", "leaf": true},
            {"id": 202, "parentId": 20, "name": "大象"},
            {"id": 2021, "parentId": 202, "name": "前端组", "leaf": true}
          ]);
        }
      },
    });
  }
  render() {
    return (
      <div className="complex-records-demo complex-records-demo--complex">
        <Records.Complex
          ref={i => this.records = i}
          mode="complex"
          model={Model}
          fetchData={this.fetchData}
          onSearchFieldsFilter={(...args) => {
            console.log(...args);
          }}
          onColumnsFilter={(...args) => {
            console.log(...args);
          }}
          onInitFilter={this.initFilter}
          onFilterChange={this.onFilterChange} />
      </div>
    );
  }

  async initFilter() {
    await M.delayAsync(2000);
    return {
      name: '134',
      startDate: new Date('2016-11-1').getTime(),
      location: [
        {"id": "1", "name": "北京"},
        {"id": "2", "name": "上海"},
      ],
      department1: 2001,
      department1Name: "前端组",
      approveStatus: "1",
      memoType: ["0", "1"],
      formType: [
        { name: '请假', id: 1 },
        { name: '延时工作报销', id: 2 },
      ],
      status: {
        text: '提交', value: 1,
      },
      memo: '哇啦啦',
    };
  }
  async fetchData(condition) {
    console.info(condition);
    await M.delayAsync(1000);
    return {
      "pageList": [
        {
          "id": "858399834",
          "status": "1",
          "lastModify": 1501565720411,
          "applicantName": "点小评",
          "applicantMis": "dianxiaoping",
          "approver": [
            {
              "name": "团小美"
            },
            {
              "name": "美小团"
            }
          ],
          "memo": "备注1备注1备注1备注1备注1备注1备注1\n备注1备注1备注1备注1备注1备注1备注1",
          "formType": "请假"
        },
        {
          "id": "858399835",
          "status": "2",
          "lastModify": 1501565720411,
          "applicantName": "点小评",
          "applicantMis": "dianxiaoping",
          "approver": [
            {
              "name": "团小美"
            },
            {
              "name": "美小团"
            }
          ],
          "memo": "备注2",
          "formType": "公积金"
        },
        {
          "id": "858399836",
          "status": "3",
          "lastModify": 1501565720411,
          "applicantName": "点小评",
          "applicantMis": "dianxiaoping",
          "approver": [],
          "memo": "备注3",
          "formType": "采购"
        },
        {
          "id": "858399837",
          "status": "4",
          "lastModify": 1501565720411,
          "applicantName": "评小点",
          "applicantMis": "pingxiaodian",
          "approver": [
            {
              "name": "点小评"
            }
          ],
          "memo": "备注4",
          "formType": "报销"
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
  async onFilterChange(newFilter) {
    const { approveStatus } = newFilter;
    if (approveStatus == '0') {
      // 如果选择未审批，则清除开始日期的值并置为禁用
      this.records.doControl({
        hide: ['startDate'],
        // disabled: ['startDate', 'startTime'],
      });
      // 重新设置筛选条件，会影响到数据的获取，加await
      await this.records.setFieldsFilter({ startDate: undefined });
    } else {
      // 否则，开始日期置为可用
      this.records.doControl({
        show: ['startDate'],
        // editable: ['startDate', 'startTime'],
      });
    }
  }
}

export default <Demo />;
