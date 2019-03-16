import React from 'react';
import Bill from '../index';
import Button from "../../button";
import Input from "../../input";
import Table from "../../table";
import M from '../../util';

const model = {
    "code":"menu_bill",
    "idField":"menuCode",
    "column":"1",
    "alignment":"right",
    "forms":[
        {
            "code":"info",
            "label":"基本信息",
            "fields":[
                {
                    "code":"systemName",
                    "label":"系统",
                    "type":"text",
                    "conf": {
                        "mode":"view"
                    }
                },
                {
                    "code":"pageCode",
                    "label":"页面编码",
                    "type":"text",
                    "conf": {
                        "required":true,
                        "pattern":"^[^\u4e00-\u9fa5]{0,20}$",
                        "validation":"必填项,由数字、英文字母、\"_\"、\"-\"组合而成,最多20字"
                    }
                },
                {
                    "code":"pageName",
                    "label":"页面名称",
                    "type":"text",
                    "conf": {
                        "required":true,
                        "validation":"必填项"
                    }
                },
                {
                    "code":"type",
                    "label":"页面类型",
                    "type":"radio",
                    "conf": {
                        "range":[{"label":"node","value":"node"},{"label":"link","value":"link"}],
                        "defaultValue":"node"
                    }
                },
                {
                    "code":"openNew",
                    "label":"新窗口打开",
                    "type":"radio",
                    "conf": {
                        "range":[{"label":"是","value":true},{"label":"否","value":false}],
                        "defaultValue":true
                    }
                },
                {
                    "code":"url",
                    "label":"链接url",
                    "type":"text",
                    "conf": {
                        "required":true,
                        "validation":"必填项"
                    }
                }
            ]
        },
        {
            "code":"props",
            "label":"属性",
            "fields":[
                {
                    "code":"attributeList",
                    "label":"属性",
                    "type":"custom"
                }
            ]
        }
    ],
    "events":[
        {
            "code":"type",
            "type":"control",
            "process":[
                {"condition":"type=='link'","show":["openNew","url"]},
                {"condition":"type!='link'","hide":["openNew","url"]}
            ]
        }
    ]
};

//由于没有数据 我们采用mergeModel的方式自己写获取数据的逻辑
M.mergeModel(model,{
    "forms.props.fields.attributeList.Component":React.createClass({
        getInitialState(){
            let self = this;
            return {
                data:this.props.value||[],
                columns:[
                    {
                        label: '属性Key',
                        code: 'key',
                        render:(text,row,index)=>{
                            return <Input value={text} required={true} onChange={(value)=>{
                                        row['key'] = value;
                                        self.updateRow(row,index);
                                    }}/>
                        },
                        width:120
                    },
                    {
                        label: '属性Value',
                        code: 'value',
                        render:(text,row,index)=>{
                            return <Input value={text} onChange={(value)=>{
                                        row['value'] = value;
                                        self.updateRow(row,index);
                                    }}/>
                        },
                        width:120
                    },
                    {
                        label: '属性描述',
                        code: 'desc',
                        render:(text,row,index)=>{
                            return <Input value={text} onChange={(value)=>{
                                        row['desc'] = value;
                                        self.updateRow(row,index);
                                    }}/>
                        },
                        width:200
                    },
                    {
                        label: '操作',
                        code: 'operate',
                        render:(text,row,index)=>{
                            return <Button label="删除"
                                           shape="no-outline"
                                           type="primary"
                                           onClick={()=>self.removeRow(index)}
                            />;
                        },
                        width:50
                    }
                ]
            }
        },
        componentWillReceiveProps(props){
            //对value进行处理
            this.setState({data:props.value||[]});
        },
        render(){
            return <div className="props-add">
                <Button className="props-add-btn"
                        label="新增"
                        onClick={this.addRow}
                        size="small" />
                <Table columns={this.state.columns}
                       dataSource={this.state.data}
                       pagination={false}/>
            </div>;
        },
        updateRow(row,index){
            let {data} = this.state;
            _.forEach(data,function(_row,i){
                if(index==i){
                    data[i] = row;
                }
            });
            this.setState({data:data});
            this.props.onChange&&this.props.onChange(data);
        },
        removeRow(index){
            let {data} = this.state;
            data.splice(index,1);
            this.setState({data:data});
            this.props.onChange&&this.props.onChange(data);
        },
        addRow(){
            let {data} = this.state,hasEmpty=false;
            _.forEach(data,function(row){
               if(row['key']==""){
                   hasEmpty = true;
               }
            });
            if(!hasEmpty){
                data.push({
                    "key":"",
                    "value":"",
                    "desc":""
                });
                this.setState({data:data});
            }

        },
        validate(){
            let {data} = this.state,isValid = true;
            _.forEach(data,function(_row){
                if(!_row['key']){
                    isValid = false;
                }
            });
            return isValid;
        }
    })
});

const data = {
    "systemName": "绩效系统",
    "systemCode": "review",
    "pageCode": "console",
    "pageName": "我的工作台",
    "type": "node",
    "attributeList":[
        {
            "key":"isNew",
            "value":"1",
            "desc":"新上线功能"
        },
        {
            "key":"modify",
            "value":"1",
            "desc":"编辑按钮是否可见"
        }
    ]
};

let bill;

export default <div className="bill-custom-field-demo">
    <Bill ref={(target)=>{bill=target}}  model={model} data={data}/>
    <Button className="btn-save" type="success" label="保存" onClick={()=>{
        if(bill.validate()){
            console.info(bill.getData());
        }
    }} />
</div>