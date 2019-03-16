import React from 'react';
import M from '../../util';
import { Records } from '../../index';

var model = require('./model.js');
var data = require('./data.json').data;

@M.reactExtras
class Demo extends M.BaseComponent {
  constructor(props) {
    super(props);
    M.mergeModel(model, {
      "search.initData": {
        "name": "test"
      },
      "search.dataFactory": {
        "mail.bind": function (bill, code, value, callback) {
          var mails = ['@163.com', '@qq.com', '@meituan.com'];
          if (value && !value.includes('@')) {
            var data = mails.map(m => value + m);
          }
          callback(data);
        },
        "city.bind": function (bill, code, value, callback) {
          var data = [
            {"id": 0, "name": "北京"},
            {"id": "2", "name": "上海"},
            {"id": "3", "name": "广州"},
            {"id": "4", "name": "深圳"}
          ];
          callback(data);
        }
      },
      "console.buttons": {
        "remove.action": this.remove,
      },
      "grid.onRowClick": this.rowClickHanlder,
      "grid.pagination.showTotal": total => `共 ${total} 条`,

    });
  }
  render() {
    return (
      <Records
        ref="records"
        model={model}
        fetchData={this.fetchData}
      />
    );
  }
  async fetchData(condition) {
    console.log('fetchData', JSON.stringify(condition));
    await M.delayAsync(2000);
    return data;
  }
  remove(records, data, model) {
    console.log('remove', data.ids());
  }
  rowClickHanlder(row) {
    console.log('rowClick', row.id);
  }
}

export default <Demo />;
