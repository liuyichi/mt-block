import React, { Component } from 'react';
import Tabs from '../index';
import Button from '../../button';

const TABSDATA = [
    {code: "1", label: "基本", content: "内容1"},
    {code: "2", label: "带图标", icon: "plus", content: "内容2"},
    {code: "3", label: "禁用", disabled: true, content: "内容3"},
    {code: "4", label: "可删除", deleteIcon: true, content: "内容4"},
];

class TabsDemo extends Component {
    constructor(props) {
        super(props);
    }
    render(){
        return <div className="tabs-basic-demo">
            <div>
                <label className="tabs-demo-label">大尺寸</label>
                <Tabs data={TABSDATA} size="large" />
            </div>
            <div>
                <label className="tabs-demo-label">正常尺寸</label>
                <Tabs data={TABSDATA} />
            </div>
            <div>
                <label className="tabs-demo-label">小尺寸</label>
                <Tabs data={TABSDATA} size="small" />
            </div>
        </div>;
    }
    _changeHandler = (code, activeKey) => {
        this.setState({["activeKey" + code]: activeKey});
    };
    _addTab = (code) => {
        let value = this.state["value" + code];
        let activeKey = value.length + 1;
        this.setState({["activeKey" + code]: activeKey, ["value" + code]: value.concat([{code: activeKey, label: "新增" + activeKey, content: "标签页" + activeKey}])});
    };
}

export default <TabsDemo/>;