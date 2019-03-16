import React,{ Component } from 'react';
import Bill from '../index';
import Button from "../../button";
import { RadioGroup } from "../../radio";
import Input from "../../input";
import Toaster from "../../toaster";
import Table from "../../table";
import M from '../../util';
import billModel from "./model/complex1.json";

const model = {
    model_view:require("./model/complex1_view.json"),
    model_edit:require("./model/complex1_edit.json"),
};
const data = {
    "info":{
        "mis": "zhangmoumou",
        "name": "张某某",
        "age": "18"
    },
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

let radioModel = [{"label": "统一编辑保存", value: 1}, {"label": "分组编辑保存", value: 2}];

/**
 * TODO 可读性和规范性有待加强
 *  - 对自定义组件的获取(bill.getField('attributeList'))
 *  - 获取拥有自定义组件的 Bill 的 data(自定义组件 onChange)
 */
class ComplexBill extends Component{
    constructor(props){
        super(props);
        this.state={
            type:1,
            mode:"view"
        };
        M.mergeModel(billModel,{
            "forms.props.fields.attributeList.Component":(props)=><CustomTable {...props} ref={(v)=>{this.customTable=v}}  mode={this.state.mode} type={this.state.type}/>,
            "forms.info.fields.info.Component":(props)=><CustomBill {...props} ref={(v)=>{this.customBill=v}} mode={this.state.mode} type={this.state.type}/>
        });
    }
    render(){
        let { type, mode } = this.state;
        return <div className="bill-complex1-demo">
            <div className="operate-type">
                <span>操作模式:</span>
                <RadioGroup model={radioModel} value={type} onChange={(value)=>{this.setState({type:value,mode:"view"})}}/>
            </div>
            <div className="bill-content">
                <div className="edit-panel">
                    {type==1 && mode=="view" && <Button  label="编辑"  size="small"  onClick={this.editAll.bind(this)}/>}
                </div>
                <Bill ref="bill"  model={billModel} data={data} validate={this.validate}/>
                {type==1 && mode!="view" && <div className="save-group">
                    <Button className="btn-cancel" size="small" label="取消" onClick={this.cancelEdit.bind(this)} />
                    <Button className="btn-save" size="small" type="success" label="保存" onClick={this.saveBill.bind(this)} />
                </div>}
            </div>

        </div>
    }
    saveBill() {
        let { bill } = this.refs,data={};
        if(bill.validate()){
            data.info=this.customBill.getData();
            data.attributeList=this.customTable.getData();
            console.log(data)
            Toaster.warning("执行保存所有操作");
            this.setState({mode:"view"});
        }
    }
    validate(){

    }
    cancelEdit(){
        this.setState({mode:"view"});
    }
    editAll(){
        this.setState({mode:"edit"});
    }
}
class CustomTable extends Component{
    constructor(props) {
        super(props);
        this.state ={
            data: props.value || [],
            mode: props.mode || "view",
            columns: []
        }
    }
    componentDidMount(){
        this.setState({columns:this._getColumns(this.props.mode)})
    }
    componentWillReceiveProps(props){
        //对value进行处理
        this.setState({data:props.value||[],mode:props.mode,type:props.type,columns:this._getColumns(props.mode)});

    }
    render(){
        let { mode, data, columns, type } = this.state;
        return <div className="props-table">
            <div className="edit-panel">
                {type!=1 && mode=="view" && <Button className="props-edit-btn"
                                                    label="编辑"
                                                    onClick={this.editTable.bind(this)}
                                                    size="small" />}
                {mode!="view" && <Button className="props-add-btn"
                                       label="新增"
                                       onClick={this.addRow.bind(this)}
                                       size="small" />}
            </div>

            <Table columns={columns}
                   dataSource={data}
                   pagination={false}/>
            {type!=1 && mode!="view" && <div className="save-group">
                <Button className="btn-cancel" size="small" label="取消" onClick={this.cancelEdit.bind(this) }/>
                <Button className="btn-save" size="small" type="success" label="保存" onClick={this.saveCusTable.bind(this)} />
            </div>}
        </div>;
    }
    _getColumns(mode){
        let col =  this.props.model && this.props.model.columns||[];
        return col.map((v,i)=>{
            if(v.code=="operate"){
                return {
                    label: v.label,
                    code: v.code,
                    render: (text, row, index)=> {
                        return <div>
                            {
                                mode!="view" && <Button label="删除"
                                                      shape="no-outline"
                                                      type="primary"
                                                      key={i}
                                                      onClick={()=>this.removeRow(index)}
                                />
                            }
                        </div>;
                    },
                    width: v.width
                }
            }else{
                return {
                    label: v.label,
                    code: v.code,
                    render: (text, row, index)=> {
                        return <Input value={text}
                                      mode={mode=="view"?"view":"default"}
                                      key={i} onChange={(value)=>{
                                        row[v.code] = value;
                                        this.updateRow(row,index);
                                    }}/>
                    },
                    width: v.width
                }
            }
        })
    }
    editTable(){
        this.setState({mode:"edit",columns:this._getColumns("edit")});
    }
    updateRow(row,index){
        let { data, type } = this.state;
        _.forEach(data,function(_row,i){
            if(index==i){
                data[i] = row;
            }
        });
        this.setState({data:data});
        type==1 && this.props.onChange&&this.props.onChange(data);
    }
    removeRow(index){
        let { data, type } = this.state;
        data.splice(index,1);
        this.setState({data:data});
        type==1 && this.props.onChange&&this.props.onChange(data);
    }
    addRow(){
        let { data } = this.state,hasEmpty=false;
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

    }
    validate(){
        let {data} = this.state,isValid = true;
        _.forEach(data,function(_row){
            if(!_row['key']){
                isValid = false;
            }
        });
        return isValid;
    }
    cancelEdit(){
        this.setState({mode:"view",columns:this._getColumns("view")});
    }
    saveCusTable(){
        let { data } = this.state;
        console.log(data);
        if(this.validate()){
            Toaster.warning("执行单独保存表格操作");
            this.setState({mode:"view",columns:this._getColumns("view")});
        }

    }
    getData(){
        return this.state.data;
    }
}
class CustomBill extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data: props.value || {},
            mode: props.mode||"view",
            type: props.type||1,
        }

    }
    componentWillReceiveProps(props){
        //对value进行处理
        this.setState({data:props.value||{},mode:props.mode,type:props.type});

    }
    render(){
        let { mode,data,type } = this.state;
        return <div className="info-bill">
            <div className="edit-panel">
                {type!=1 && mode=="view" && <Button
                                                    label="编辑"
                                                    onClick={this.editBill.bind(this)}
                                                    size="small" />}
            </div>
            <Bill ref="cusBill" model={model["model_"+mode]} key={mode} data={data} onFieldChange={this.fieldChange.bind(this)}/>
            {type!=1 && mode!="view" && <div className="save-group">
                <Button className="btn-cancel" size="small" label="取消" onClick={()=>{ this.setState({mode:"view"})} }/>
                <Button className="btn-save" size="small" type="success" label="保存" onClick={this.saveCusBill.bind(this)} />
            </div>}
        </div>;
    }
    fieldChange(code,value,bill){

    }
    saveCusBill(){
        let { cusBill } = this.refs;
        let data = cusBill.getData();
        console.log(data);
        Toaster.warning("执行单独保存操作");
        this.setState({mode:"view",data:data});
    }
    editBill(){
       this.setState({mode:"edit"});
    }
    getData(){
        let { cusBill } = this.refs;
        return cusBill.getData();
    }
   
}
export default <ComplexBill/>