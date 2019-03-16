import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Trigger from '../Trigger';
import '../style';
import './index.scss';

const showData = [
    "蒹葭苍苍",
    "白鹭为霜",
    "所谓伊人",
    "在水一方"
];
class Select extends Component {
	constructor(props) {
    super(props);
    this.state={
        visible: false,
        autoDestory: false,
        align: {
          points: ["tc", "bc"],
          offset: [0,0],
          overflow: {
              adjustX: true,
              adjustY: true
          }
        }
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
        return findDOMNode(this.refs.input);
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
        if (!align) {
          return null;
        }
        return (
                <div className="trigger-select-demo" >
                      <div className="trigger-select-demo-content">
                          <div className="content-box"  ref="container">
                              <input type="text" ref="input"
                                     value={showValue}
                                     placeholder="点击输入框并进行选择"
                                     onFocus={this.focusHandler.bind(this)}
                                     onChange={this.changeHandler.bind(this)}
                              />
                              <Trigger ref="trigger"
                                       visible={visible}
                                       align={align}
                                       equalTargetWidth={true}
                                       target={this._getTarget}
                                       getPopupContainer={this.getPopupContainer}
                              >
                                  <ul>
                                      {showData.map((v,i)=>{
                                          return <li key={i} onClick={this.clickHandler.bind(this,v)}>{v}</li>
                                      })}
                                  </ul>
                              </Trigger>
                          </div>
                          分别将输入框滚动到外框顶部、底部、中间后查看弹框位置
                      </div>
                </div>
            );
	}
    clickHandler(v,e) {
        this.setState({showValue:v,visible:false});
    }
    changeHandler(e) {
        this.setState({showValue:e.target.value});
    }
    hideDropDown() {
        this.setState({visible:false});
    }
    focusHandler() {
        this.setState({visible:true});
    }
}


export default <Select />