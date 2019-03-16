import React, { Component } from 'react';
import Tabs from '../index';

class TabsDemo extends Component {
  render(){
    var value = [];
    for (var i = 0; i < 12; i ++) {
      value.push({code: i, label: "标签" + i, content: "标签页" + i});
    }
    return <div className="tabs-basic-demo">
      <div>
        <label className="tabs-demo-label">分页式标签</label>
        <Tabs data={value} />
      </div>
    </div>;
  }
}

export default <TabsDemo/>;