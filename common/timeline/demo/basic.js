import React, { Component } from 'react';
import M from '../../../util';
import Timeline from '../';
import { Button, Bill, Dialog, Icon } from '../../../index';

const value = [
    {date: 1503543949100, desc: "退休", draft: false},
    {date: 1501603200000, desc: "员工类型变更", draft: false},
    {date: 1501603200000, desc: "员工类型变更", draft: true},
    {date: 1501257600000, desc: "重新入职", draft: false},
    {date: 1496851200000, desc: "离职", draft: false, color: "error"},
    {date: 1493568000000, desc: "系统变更", draft: false},
    {date: 1487779200000, desc: "入职", draft: false}
];
const model = {
    "forms": [
        {
            "fields": [
                {
                    "code": "date",
                    "label": "日期",
                    "type": "date",
                },
                {
                    "code": "desc",
                    "label": "内容",
                    "type": "text"
                },
                {
                    "code": "draft",
                    "label": "草稿",
                    "type": "radio",
                    "range": [
                        {value: true, label: "是"},
                        {value: false, label: "否"}
                    ]
                }
            ]
        }
    ]
};

class TimelineDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "view"
        };
    }
    render(){
        return (
          <Timeline ref="timeline"
                    className="basic-timeline-demo"
                    initIfEmpty
                    delNewWhenSelect
                    model={{idField: "{{date}}_{{draft}}", leftField: "date", rightField: "desc"}}
                    onFetchTimeline={this._fetchTime}
                    onFetchDetail={this._fetchDetail}
                    renderLabel={this._renderLabel}
                    renderContent={this._renderContent}
                    onAdd={this._add}
                    onSelect={this._select} />
        );
    }
    _add = ({data, active, list, selected}) => {
        this.dataChanged = true;
        this._action("edit");
        return {...data, date: Date.now()};
    };
    _select = async ({active, list, selected}) => {
        let res = true;
        if (this.dataChanged) {
            res = await Dialog.confirm({
                title: "警告",
                content: "您有数据未保存, 切换将会丢失, 确定操作吗?",
            });
        }
        if (res) {
            res && (this.dataChanged = false);
            this.setState({mode: "view"});
        }
        return res;
    };
    _fetchTime = () => {
        return value.slice(1);
    };
    _fetchDetail = ({date, desc, draft}) => {
        return {date, desc, draft};
    };
    _renderLabel = ({item, list, index}) => {
        if (item._new) {
            return {left: "自定义新增中..."}
        } else {
            return {
                left: M.formatDatetime(item.date, '%m-%d %M:%S'),
                dot: "clock",
                right: <div className="_desc">{item.desc}</div>
            }
        }
    };
    _renderContent = ({item, data, list}) => {
        let { mode } = this.state;
        return <div>
            {mode === "view" && <div className="operates">
                <Button label="编辑" size="xsmall" onClick={this._action.bind(this, "edit")} />
            </div>}
            <Bill ref={i => this.bill = i}
                  key={mode}
                  model={model}
                  data={data}
                  mode={mode}
                  getPopupContainer={()=> document.body}
                  onFieldChange={() => this.dataChanged = true} />
            {mode !== "view" && <div className="operates">
                <Button label="取消" size="xsmall" onClick={this._action.bind(this, "cancel")} />
                <Button label="保存" size="xsmall" type="primary" onClick={this._action.bind(this, "save")} />
            </div>}
        </div>
    };

    // 执行交互
    _action = async (code) => {
        let { timeline } = this.refs;
        switch (code) {
            case "edit":
                this.setState({mode: "edit"});
                break;
            case "cancel":
                let res = true;
                if (this.dataChanged) {
                    res = await Dialog.confirm({
                        title: "警告",
                        content: "您有数据未保存, 切换将会丢失, 确定操作吗?",
                    });
                }
                let active = timeline.getActive();
                if (res) {
                    this.setState({mode: "view"});
                    timeline.fetchDetail(active);
                    this.dataChanged = false;
                }
                break;
            case "save":
                if (this.bill.validate()) {
                    console.log("保存: ", this.bill.getData());
                    this.dataChanged = false;
                    this.setState({mode: "view"});
                    timeline.fetchTimeline();
                }
                break;
        }
    }
}

export default <TimelineDemo/>;