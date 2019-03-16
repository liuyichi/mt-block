import React, { Component } from 'react';
import Tabs from '../';
import Button from '../../button';
import Select from '../../select';
import Dialog from '../../dialog';

const TABSDATA = [
    {code: "1", label: "基本", content: "内容1", className: "_customClassName"},
    {code: "2", label: "带图标", icon: "plus", content: (props) => {
        return <div>{props.label}</div>;
    }},
    {code: "3", label: "禁用", disabled: true, content: "内容3"},
    {code: "4", label: "可删除", deleteIcon: true,
        model: {
            "idField": "id",
            "showField": "name",
        },
        range: [
            {id: "1", "name": "设计"},
            {id: "2", "name": "金融"},
            {id: "3", "name": "会计"},
            {id: "4", "name": "计算机"},
        ],
        content: class Content extends Component {
            constructor(props) {
                super(props);
                this.state = {
                    value: props.range[0]
                }
            }
            render() {
                let { model, range } = this.props;
                return <div style={{width: "200px"}}>
                    <Select unsearchable
                            value={this.state.value}
                            model={model}
                            onFetchData={(filter, cb)=>cb(range)}
                            onChange={(value)=>this.setState({value})} />
                </div>
            }
        }},
    {code: "5", label: <div>自定义标题</div>, deleteIcon: true, content: <div>自定义内容</div>},
];

class TabsDemo extends Component {
    constructor(props) {
        super(props);
        var value = [];
        for (var i = 0; i < 12; i++) {
            value.push({
                code: ""+i,
                label: "标签" + i,
                content: ({label, index}) => {
                    return <span>{label + "的内容" + index}</span>
                }
            });
        }
        this.state = {
            value1: value.slice(),
            value2: value.slice(),
            activeKey1: "1",
            activeKey2: "1",
        };
    }
    render(){
        let { value1, value2, activeKey1, activeKey2 } = this.state;
        return <div className="tabs-basic-demo">
            <div>
                <label className="tabs-demo-label">一级·线条式标签</label>
                <Tabs activeKey={activeKey1}
                      height="100%"
                      data={value1}
                      onChange={this._changeHandler.bind(this, "1")}
                      onDelete={this._deleteHandler.bind(this, "1")}
                      extraTab={<Button icon="plus" label="新增" shape="no-outline" type="primary" onClick={this._addTab.bind(this, "1")} />} />
            </div>
            <div>
                <label className="tabs-demo-label">二级·卡片式标签</label>
                <Tabs data={TABSDATA} type="card" onDelete={this._delete2Handler} />
            </div>
            <div>
                <label className="tabs-demo-label">带操作标签</label>
                <Tabs activeKey={activeKey2}
                      height="100%"
                      data={value2}
                      type="card"
                      deleteIcon={true}
                      onChange={this._changeHandler.bind(this, "2")}
                      onDelete={this._deleteHandler.bind(this, "2")}
                      extraTab={<Button icon="plus" label="新增" shape="no-outline" type="primary" onClick={this._addTab.bind(this, "2")} />} />
            </div>
        </div>;
    }
    _changeHandler = (index, activeKey) => {
        this.setState({["activeKey" + index]: activeKey});
    };
    _delete2Handler = (code, item) => {
        Dialog.confirm({
            content: `确认删除 [${item.label}] 吗?`,
            onOk: (close) => {
                TABSDATA.splice(TABSDATA.findIndex(v => v.code === code), 1);
                this.forceUpdate();
                close && close();
            }
        });
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
    _addTab = (index) => {
        let value = this.state["value" + index];
        let activeKey = value.length + 1;
        this.setState({["activeKey" + index]: activeKey, ["value" + index]: value.concat([{code: activeKey, label: "新增" + activeKey, content: "标签页" + activeKey}])});
    };
}

export default <TabsDemo/>;