import React from 'react';
import M from '../../util';
import { Icon, Input, RadioGroup, CheckboxGroup,DatePicker, Select, TreeSelect, RangePicker, Upload, Table } from '../../index';
import { Draggable } from '../index';
import "./create-bill.scss";

/**
 * 这里模拟实现动态生产表单的demo
 */

class CreateBill extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fieldListModel: [
                {"code": "text", "label": "输入框", "icon": "ellipsis"},
                {"code": "textarea", "label": "多行输入", "icon": "ellipsis"},
                {"code": "number", "label": "数字", "icon": "ellipsis"},
                {"code": "select", "label": "下拉", "icon": "ellipsis"},
                {"code": "multi-select", "label": "多选下拉", "icon": "ellipsis"},
                {"code": "tree-select", "label": "树下拉", "icon": "ellipsis"},
                {"code": "multi-tree-select", "label": "多选树下拉", "icon": "ellipsis"},
                {"code": "auto-text", "label": "联想输入", "icon": "ellipsis"},
                {"code": "multi-auto-text", "label": "多选联想", "icon": "ellipsis"},
                {"code": "radio", "label": "单选按钮", "icon": "ellipsis"},
                {"code": "radio-group", "label": "单选按钮组", "icon": "ellipsis"},
                {"code": "checkbox", "label": "复选按钮", "icon": "ellipsis"},
                {"code": "checkbox-group", "label": "复选按钮组", "icon": "ellipsis"},
                {"code": "date", "label": "日期", "icon": "ellipsis"},
                {"code": "range-date", "label": "日期区间", "icon": "ellipsis"},
                {"code": "upload", "label": "文件上传", "icon": "ellipsis"},
                {"code": "table", "label": "表格", "icon": "ellipsis"}
            ],
            billModel: [
                {code: "input_default", label: "输入框", type: "text"},
                //{
                //    code: "radio",
                //    label: "单选框",
                //    type: "radio",
                //    range: [{"id": "1", "name": "是"}, {"id": "2", "name": "否"}],
                //    model: {idField: "id", showField: "name"}
                //},
                {code: "date_default", label: "日期", type: "date", format: "%Y.%m.%d"}
            ]
        };
    }


    render() {
        let {fieldListModel,billModel} = this.state;
        let fieldList = {
            className: "field-list",
            data:fieldListModel,
            idField:"code",
            itemClass:"field-list-item",
            format:(item)=>{
                return this._renderField(item);
            },
            options:{
                group:{
                    name:"billList",
                    pull:"clone"
                },
                dragClass:"field-list-item-dragging",
                ghostClass:"field-list-item-ghost"
            }
        };
        let billList = {
            className:"bill-list",
            data:billModel,
            idField:"code",
            itemClass:"bill-list-item",
            format:(item)=>{
                return this._renderBill(item);
            },
            options:{
                group:{
                    name:"billList",
                    pull: false,
                },
                sort:true,
                dragClass:"bill-list-item-dragging",
                ghostClass:"bill-list-item-ghost",
                onAdd:(dragInfo, event,instance)=>{
                    // console.info(dragInfo, event,instance);
                    let { data, newIndex } = dragInfo;
                    let d = Object.assign({}, data);
                    d.type = data.code;
                    d.code = `${data.code}_${Date.now()}`; //唯一key
                    billModel.splice(newIndex, 0, d);
                    this.forceUpdate();
                }
            }
        };

        return <div className="drag-demo-create-bill">
            <div className="fields-panel">
                <div className="fields-panel-header">字段</div>
                <Draggable {...fieldList} />
            </div>
            <div className="preview-panel">
                <div className="preview-panel-container">
                    <div className="preview-panel-header">
                        <span className="preview-panel-title">表单配置</span>
                    </div>
                    <Draggable {...billList} />
                </div>
            </div>
            <div className="set-panel">
                <div className="set-panel-header">表单设置</div>
            </div>
        </div>
    }


    _renderField(model){
        return <div className="field-item-cell">
            <Icon className="cell-icon" type={model.icon}/>
            <span className="cell-label">{model.label}</span>
        </div>
    }
    _renderBill(model){
        let Element;
        model.placeholder = model.label;
        switch(model.type){
            case "text":
            case "textarea":
                Element = Input;
                break;
            case "radio":
            case "radio-group":
                Element = RadioGroup;
                if (model.type.endsWith('group')) {
                    model.model = [{ label: "单选按钮1", value: "1" }, { label: "单选按钮2", value: "2" }];
                } else {
                    model.model = [{ label: "单选按钮", value: "1" }];
                }
                break;
            case "checkbox":
            case "checkbox-group":
                Element = CheckboxGroup;
                if (model.type.endsWith('group')) {
                    model.model = [{ label: "复选按钮1", value: "1" },
                        { label: "复选按钮2", value: "2" }, { label: "复选按钮3", value: "3" }];
                } else {
                    model.model = [{ label: "复选按钮", value: "1" }];
                }
                break;
            case "date":
                Element = DatePicker;
                break;
            case "range-date":
                Element = RangePicker;
                model.placeholder = ['开始日期', '结束日期'];
                break;
            case 'select':
            case 'multi-select':
            case 'auto-text':
            case 'multi-auto-text':
                Element = Select;
                if (model.type.startsWith('multi')) {
                    model.multiple = true;
                }
                if (model.type.endsWith('auto-text')) {
                    model.combobox = true;
                }
                break;
            case 'tree-select':
            case 'multi-tree-select':
                Element = TreeSelect;
                if (model.type == 'multi-tree-select') {
                    model.multiple = true;
                }
                break;
            case 'upload':
                Element = Upload;
                break;
            case 'table':
                Element = Table;
                model.columns = [{ label: '列1', code: 'col1'}, { label: '列2', code: 'col2'}];
                model.data = [{ col1: '内容1', col2: '内容2'}];
                model.pagination = false;
                break;
            default:
                Element = Input;
                break;
        }
        return <div className="bill-item-cell">
            <Element {...model} disabled={true} />
        </div>
    }
}


export default <CreateBill />;