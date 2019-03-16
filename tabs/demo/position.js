import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Tabs } from '../';
import Button from '../../button';
import Select from '../../select';
import Dialog from '../../dialog';

class TabsDemo extends Component {
  constructor(props) {
    super(props);
    var value = [];
    for (var i = 0; i < 5; i++) {
      value.push({
        code: i,
        label: "标签" + i,
        content: <p>{"内容" + i}</p>
      });
    }
    this.state = {
      value1: value,
      value2: value,
      activeKey1: 0,
      activeKey2: 0,
      position1: 'top',
      position2: 'top'
    };
  }
  render(){
    let { value1, value2, position1, position2, activeKey1, activeKey2 } = this.state;
    position1 = position1 || 'top';
    position1 = position1 || 'top';
    return <div className="tabs-position-demo" ref="container">
      <div>
        <label className="tabs-demo-label">
          切换定位: <Select value={{label: position1, value: position1}}
                        getPopupContainer={()=>{return this.refs.container}}
                        model={{idField: "value", showField: "label"}}
                        onFetchData={this._fetchData}
                        onChange={this._updatePosition.bind(this, "1")} />
        </label>
        <Tabs data={value1}
              activeKey={activeKey1}
              position={position1}
              height={position1 === 'bottom' || position1 === 'top' ? "100" : "200"}
              deleteIcon={true}
              onChange={this._changeHandler.bind(this, '1')}
              onDelete={this._deleteHandler.bind(this, '1')}
              extraRight={true}
              extraTab={<Button icon="plus" label="新增" shape="no-outline" type="primary" onClick={this._addTab.bind(this, "1")} />} />
      </div>
      <div>
        <label className="tabs-demo-label">
          切换定位: <Select value={{label: position2, value: position2}}
                        getPopupContainer={()=>{return this.refs.container}}
                        model={{idField: "value", showField: "label"}}
                        onFetchData={this._fetchData}
                        onChange={this._updatePosition.bind(this, "2")} />
        </label>
        <Tabs data={value2}
              activeKey={activeKey2}
              position={position2}
              type="card"
              height={position2 === 'bottom' || position2 === 'top' ? "100" : "200"}
              deleteIcon={true}
              onChange={this._changeHandler.bind(this, '2')}
              onDelete={this._deleteHandler.bind(this, '2')}
              extraTab={<Button icon="plus" label="新增" shape="no-outline" type="primary" onClick={this._addTab.bind(this, "2")} />} />
      </div>
    </div>;
  }
  _addTab = (index) => {
    let value = this.state["value" + index];
    let activeKey = value.length + 1;
    this.setState({["activeKey" + index] : activeKey, ["value" + index]: value.concat([{code: activeKey, label: "新增" + activeKey, content: "标签页" + activeKey}])});
  };
  _changeHandler = (index, activeKey) => {
    this.setState({["activeKey" + index]: activeKey});
  };
  _deleteHandler = (index, code, item) => {
    let value = this.state["value" + index];
    Dialog.confirm({
      content: `确认删除 [${item.label}] 吗?`,
      onOk: (close) => {
        value.splice(value.findIndex(v => v.code === code), 1);
        let activeKey = this.state["activeKey" + index];
        if (activeKey === code) {
          activeKey = ((value || [])[0] || {}).code;
        }
        this.setState({["value" + index]: value, ["activeKey" + index]: activeKey});
        close && close();
      }
    });
  };
  _fetchData = (filter, cb) => {
    cb(["top","bottom","left","right"].map(v => ({label: v, value: v})));
  };
  _updatePosition = (index, value) => {
    this.setState({["position" + index]: value.value});
  }
}

export default <TabsDemo/>;