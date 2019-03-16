import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import strftime from 'strftime';
import Trigger from '../Trigger';
import Button from '../../button';
import { DateCalendar } from '../../date-picker/calendar';
import '../style';
import './index.scss';

class DatePicker extends Component {
    constructor(props) {
        super(props);
        this.state={
            visible: false,
            autoDestory: false,
            align: {
                points: ["tl", "bl"],
                overflow: {
                    adjustX: true,
                    adjustY: true
                }
            },
            showValue:Date.now()
        };
    }
    componentDidMount() {
        // 点击了非控件内区域  关闭弹窗
        this.removeMenu = (e) => {
            if (!this.state.visible) {
                return;
            }
            //获取当前弹出框
            const popup = this.refs.trigger && this.refs.trigger.getPopupDOMNode();
            if (!(findDOMNode(this.refs.container).contains(e.target) || (popup && popup.contains(e.target)))) {
                this.hideDropDown();
            }
        };
        window.addEventListener('click', this.removeMenu, true);
    };
    _getTarget = () => {
        return findDOMNode(this.refs.target);
    };
    getPopupContainer = () => {
        if(this.refs.container){
            return findDOMNode(this.refs.container);
        }else{
            return document.querySelector(".content-box")
        }

    };
    render() {
        const { align,  visible, showValue} = this.state;
        let showDate = strftime("%Y-%m-%d",new Date(showValue));
        if (!align) {
            return null;
        }
        return (
            <div className="trigger-date-demo" >
                    <div className="content-box"  ref="container">
                        <Button  ref="target"
                               onClick={this.showTrigger.bind(this)}
                        >{showDate}</Button>
                        点击按钮选择日期
                        <Trigger ref="trigger"
                                 visible={visible}
                                 align={align}
                                 equalTargetWidth={false}
                                 target={this._getTarget}
                                 getPopupContainer={this.getPopupContainer}
                        >
                           <div className="date-trigger-content">
                                <DateCalendar value={showValue} onSelect={this.selectDate.bind(this)}/>
                           </div>
                        </Trigger>
                    </div>
            </div>
        );
    }
    selectDate(date) {
        this.setState({showValue:date,visible:false})
    }
    hideDropDown() {
        this.setState({visible:false});
    }
    showTrigger() {
        this.setState({visible:true});
    }
}


export default <DatePicker />