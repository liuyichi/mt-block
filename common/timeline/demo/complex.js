import React, { Component } from 'react';
import M from '../../../util';
import Timeline from '../';
import { Button, DatePicker, Dialog, Icon } from '../../../index';
import Input from "../../../input/Input";

const value = [
    {date: 1501603200000, event: "鸦片战争爆发...", detail: '鸦片战争爆发-这里可以是相关参考文献的记录'},
    {date: 1501257600000, event: "黄海大战", detail: '黄海大战-这里可以是相关参考文献的记录'},
    {date: 1496851200000, event: "五四运动爆发", detail: '五四运动爆发-这里可以是相关参考文献的记录'},
    {date: 1493568000000, event: "黄埔军校建立", detail: '黄埔军校建立-这里可以是相关参考文献的记录'}
];

class Complex extends Component {

    constructor(props){
        super(props);
        this.state={
            data: [],
            butLabel: true
        };
        this.fetchTime = this.fetchTime.bind(this);
        this._renderContent = this._renderContent.bind(this);
        this._onSelect = this._onSelect.bind(this);
        this._onAdd = this._onAdd.bind(this);
        this._fetchDetail = this._fetchDetail.bind(this);
    }

    componentDidMount(){
        this.setState({
            data: value
        });
    }

    fetchTime(){
        return this.state.data;
    }

    async _onSelect({active, list, selected}){
        if (!this.state.butLabel) {
            let res = await Dialog.confirm({
                title: "警告",
                content: "您有数据未保存, 切换将会丢失, 确定操作吗?",
            });
            res && (this.setState({butLabel: !this.state.butLabel}));
            return res;
        }
    }

    _onAdd({data, active, list, selected}){
        this.setState({
            butLabel: !this.state.butLabel
        });
        return {date: Date.now(), event: "黄海大战", detail: '黄海大战-这里可以是相关参考文献的记录'};
    }

    _fetchDetail({date, event, detail}){
        return {date, event, detail};
    }

    //data参数由_fetchDetail方法获取
    _renderContent({data, item, index, dateList}){
        return (
            <div className="complex-demo-detail">
                <Button label={this.state.butLabel ? '编辑' : '保存'}
                        type="primary"
                        className="edit-delete"
                        size="small"
                        onClick={() => {
                            this.setState({butLabel: !this.state.butLabel});
                        }}
                />
                <Button label={this.state.butLabel ? '删除' : '取消'}
                        size="small"
                        className="edit-delete"
                        onClick={() => {
                            this.setState({butLabel: !this.state.butLabel});
                        }}
                />
                <div className="edit-eara">
                    <label className="title">日期:</label>
                    <DatePicker mode={this.state.butLabel ? 'view' : 'default'}
                                type="date"
                                size="small"
                                className="box"
                                value={data.date}
                                format="%Y-%m-%d"/>
                    <label className="title">事件:</label>
                    <Input mode={this.state.butLabel ? 'view' : 'default'}
                           type="text"
                           size="small"
                           className="box"
                           placeholder="请记录事件"
                           value={data.event}/>
                    <label className="title">记录:</label>
                    <Input mode={this.state.butLabel ? 'view' : 'default'}
                           type="textarea"
                           size="default"
                           placeholder="请记录笔记"
                           className="box"
                           rows="3"
                           value={data.detail}/>
                </div>
            </div>
        );
    }

    render(){
        return (
            <div className="complex-demo">
                <label>可以在任意时间点后新增，可以编辑任意时间点的详情，形成完整的带时序的记录，比如这个历史事件记录板</label>
                <Timeline model={{idField: "{{date}}", leftField: "date", rightField: "event"}}
                          onFetchTimeline={this.fetchTime}
                          onSelect={this._onSelect}
                          renderContent={this._renderContent}
                          onAdd={this._onAdd}
                          onFetchDetail={this._fetchDetail}
                />
            </div>
        );
    }
}

export default <Complex/>;