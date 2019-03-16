
export default {
  "idField": "id",
  "search": {
    "code": "complex-demo",
    "mode": "complex",
    "fields": [
      {
        "code": "name",
        "label": "姓名",
        "type": "text",
        // "addonAfter": "addonAfter",
        "conf": {
          "placeholder": "请输入姓名的中文或全拼"
        },
        "onlyShowIn": "basic"
      },
      {
        "code": "type",
        "label": "类型",
        "type": "select",
        "model": {
          "idField": "id",
          "showField": "name",
          "showTpl": "{{name+'('+code+')'}}",
          "tpl": "{{name+'('+code+')'}}"
        },
        "onlyShowIn": "advanced"
      },
      {
        "code": "location",
        "label": "地点",
        "type": "multiSelect",
        "model": {
          "idField": "id",
          "showField": "name"
        },
        "conf": {
          "searchPlaceholder": "搜索工作地点"
        },
      },
      {
        "code": "startDate",
        "label": "开始日期",
        "type": "date",
        "conf": {
          "format": "%Y-%m-%d %H:%M"
        }
      },
      {
        "code": "startTime",
        "label": "开始时间",
        "type": "time",
      },
      {
        "code": "rangeDate",
        "label": "时间段",
        "type": "rangeDate",
      },
      {
        "code": "rangeDateNow",
        "label": "时间段至今",
        "type": "rangeDate",
        "show": false,
        "conf": {
          "showUpToNow": true
        }
      },
      {
        "code": "department1",
        "label": "部门",
        "type": "treeSelect",
        "model": {
          "idField": "id",
          "parentIdField": "parentId",
          "showField": "name",
          "showTpl": "{{name}}({{id}})",
          "leafField": "leaf"
        },
        "showCode": "department1Name"
      },
      {
        "code": "department2",
        "label": "部门",
        "type": "treeMultiSelect",
        "show": false,
        "model": {
          "idField": "id",
          "parentIdField": "parentId",
          "showField": "name",
          "showTpl": "{{name}}({{id}})",
          "leafField": "leaf"
        }
      },
      {
        "code": "approveStatus",
        "label": "审批状态",
        "type": "radio",
        "conf": {
          "model": [
            {
              "label": "未审批",
              "value": "0",
            },
            {
              "label": "已审批",
              "value": "1",
            },
          ],
        },
      },
      {
        "code": "memoType",
        "label": "备注类型",
        "type": "checkbox",
        "conf": {
          "model": [
            {
              "label": "默认备注",
              "value": "0",
            },
            {
              "label": "已审批",
              "value": "1",
            }
          ],
        },
      },
      {
        "code": "custom",
        "label": "自定义组件",
        "type": "custom",
        "show": false,
      },
    ],
    "events": [
      {
        "code": "location",
        "type": "bind",
        "params": [],
        "url": "/complex-records/data/location/get"
      },
      {
        "code": "type",
        "type": "bind",
        "params": [],
        "url": "/complex-records/data/type/get"
      },
      {
        "code": "department1",
        "type": "bind",
        "params": [],
        "url": "/complex-records/data/department/get"
      },
      {
        "code": "department2",
        "type": "bind",
        "params": [],
        "url": "/complex-records/data/department/get"
      }
    ],
    "filter": true,
    "advanced": true
  },
  "console": {
    "buttons": [
      {
        "code": "add",
        "label": "新建",
        "icon": "plus",
        "hideIn": "row"
      },
      {
        "code": "search",
        "label": "搜索",
        "style": "primary",
        "hideIn": "row"
      },
      {
        "code": "view",
        "label": "查看",
        "style": "primary",
        "hideIn": "row"
      },
      {
        "code": "reset",
        "label": "重置",
        "hideIn": "row"
      },
      {
        "code":"delete",
        "label":"删除",
        "hideIn": "row"
      },
      {
        "code": "edit",
        "label": "编辑",
        "hideIn": "main"
      },
      {
        "code":"remove",
        "label":"删除",
        "hideIn": "main"
      }
    ]
  },
  "grid": {
    "columns": [
      {
        "code": "id",
        "label": "单据号",
        "type": "text",
        "width": "15%"
      },
      {
        "code": "formType",
        "label": "单据类型",
        "type": "text",
        "filterModel": {
          "type": "multiSelect",
          "idField": "id",
          "showField": "name",
          "showSearch": true,
          "placeholder": "搜索单据",
          "clearSearchwordAfterSelect": true,
        },
        "width": "15%"
      },
      {
        "code": "status",
        "label": "状态",
        "type": "radio",
        "range": [
          { "label": "提交", "value": 1 },
          { "label": "通过", "value": 2 },
          { "label": "驳回", "value": 3 },
          { "label": "撤销", "value": 4 }
        ],
        "filterModel": {
          "type": "select",
          "idField": "value",
          "showField": "text",
          "showSearch": true,
          "noSearchIfNoKeyword": false,
          "placeholder": "输入状态"
        },
        "width": "15%"
      },
      {
        "code": "applicant",
        "label": "申请人",
        "type": "text",
        "tpl": "{{applicantName+'('+applicantMis+')'}}",
        "show": false
      },
      {
        "code": "approver",
        "label": "审批人",
        "type": "text",
        "itemTpl": "{{name}}",
        "show": false
      },
      {
        "code": "lastModify",
        "label": "最后修改时间",
        "type": "date",
        "show": false
      },
      {
        "code": "memo",
        "label": "备注",
        "type": "text",
        "filterModel": {
          "type": "text",
          "placeholder": "搜索备注"
        },
        "width": "35%"
      },
      {
        "code": "operate",
        "label": "操作",
        "type": "console",
      }
    ]
  },
  "setting": [
    {
      "code": "qrcode",
      "label": "二维码",
      "icon": "category"
    },
    {
      "code": "heading",
      "label": "设置列表字段",
      "icon": "settings",
    },
    {
      "code": "calendar",
      "label": "日历",
      "icon": "calendar",
    },
    {
      "code": "chart",
      "label": "打印",
      "icon": "chart",
    },
    {
      "code": "star",
      "label": "收藏",
      "icon": "star",
    }
  ]
};
