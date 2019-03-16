export default {
  "buttons": [{
    "code": "search",
    "icon": "search",
    "label": "搜索",
    "style": "primary",
    "url": "/service/list",
    "hideIn": "row",
  }, {
    "code": "reset",
    "label": "重置",
    "hideIn": "row",
  }, {
    "code": "add",
    "icon": "plus",
    "label": "添加",
    "linkTo": "#2/add",
    "hideIn": "row",
  }, {
    "code": "edit",
    "icon": "edit",
    "label": "修改",
    "style": "primary",
    "requireData": true,
    "linkTo": "#2/edit-{{id}}",
  }, {
    "code": "test",
    "label": "测试_g",
    "style": "success",
    "requireData": true,
    "linkTo": "#2/xyz-{{title}}",
    "hideIn": "main",
  }, {
    "code": "view",
    "icon": "eye",
    "label": "查看",
    "style": "warning",
    "requireData": true,
    "linkTo": "#2/view-{{id}}",
  }, {
    "code": "remove",
    "icon": "delete",
    "label": "删除",
    "style": "danger",
    "requireData": true,
    "url": "/service/remove",
  }]
};
