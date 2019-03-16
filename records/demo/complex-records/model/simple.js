
export default {
  "idField": 'id',
  "search": {
    "mode": "simple",
    "fields": [
      {
        "code": "position",
        "label": "职位职位职位",
        "type": "multiSelect",
        "model": {
          "idField": "id",
          "showField": "name"
        }
      },
      {
        "code": "grade",
        "label": "职级",
        "type": "select",
        "data": ["M1-3", "M2-1", "M2-2", "M2-3"]
      },
      {
        "code": "type",
        "label": "类型",
        "type": "select",
        "model": {
          "idField": "id",
          "showField": "name",
          "showTpl": "{{name+'('+code+')'}}"
        }
      },
      {
        "code": "location",
        "label": "地点",
        "type": "multiSelect",
        "model": {
          "idField": "id",
          "showField": "name"
        }
      },
      {
        "code": "channel",
        "label": "渠道",
        "type": "multiSelect",
        "model": {
          "idField": "id",
          "showField": "name"
        }
      }
    ],
    "events": [
      {
        "code": "type",
        "type": "bind",
        "params": [],
        "url": "/complex-records/data/type/get"
      },
      {
        "code": "location",
        "type": "bind",
        "params": [],
        "url": "/complex-records/data/location/get"
      },
      {
        "code": "channel",
        "type": "bind",
        "params": [],
        "url": "/complex-records/data/channel/get"
      }
    ]
  },
  "console": {
    "buttons": [
      {
        "code": "add",
        "label": "新增",
        "icon": "plus",
        "hideIn": "row"
      },
      {
        "code":"primary",
        "label":"职位",
        "style":"primary",
        "hideIn": "row"
      },
      {
        "code":"minor1",
        "label":"面试",
        "hideIn": "row"
      },
      {
        "code":"minor2",
        "label":"筛选",
        "hideIn": "row"
      },
      {
        "code":"minor3",
        "label":"频道",
        "hideIn": "row"
      },
      {
        "code":"cancel",
        "label":"取消",
        "hideIn": "row"
      },
      {
        "code":"minor5",
        "label":"放弃",
        "hideIn": "row"
      },
      {
        "code":"drop",
        "label":"放弃",
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
        "show": true,
        "filterModel": {
          "type": "text"
        },
        "width": "20%"
      },
      {
        "code": "company",
        "label": "公司",
        "type": "text",
        "show": true,
        "width": "20%"
      },
      {
        "code": "position",
        "label": "职位",
        "type": "text",
        "show": true,
        "width": "30%"
      },
      {
        "code": "city",
        "label": "城市",
        "type": "text",
        "show": true,
        "width": "10%"
      },
      {
        "code": "operate",
        "label": "操作",
        "type": "console",
        "show": true
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
      "code": "chart",
      "label": "打印",
      "icon": "chart",
    },
    {
      "code": "heading",
      "label": "设置列表字段",
      "icon": "settings",
    }
  ]
};
