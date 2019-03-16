import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Trigger from '../Trigger';
import Button from '../../button';
import Toaster from '../../toaster';
import Table from '../../table';
import '../style';
import './index.scss';

class TableDeleteConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: null,
      autoDestory: false,
      align: {
        points: ["tl", "tl"],
        offset: [0, 0],
        targetOffset: [0, 0]
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
      const popup = this.trigger && this.trigger.getPopupDOMNode();
      if (!(this.target.contains(e.target) || (popup && popup.contains(e.target)))) {
        this.hideDropDown();
      }
    };
    window.addEventListener('click', this.removeMenu, true);
  };
  _getTarget = () => {
    return findDOMNode(this.target);
  };
  getPopupContainer = () => {
    return document.body;
  };

  render() {
    const { align, visible } = this.state;
    if (!align) {
      return null;
    }
    let data = [
      {
        name: "trigger示例",
        memo: "点击删除,执行删除表格行操作"
      }
    ];
    const columns = [
      {
        label: 'type',
        code: 'name'
      },
      {
        label: '描述',
        code: 'memo'
      },
      {
        label: '操作',
        code: 'action',
        render: (text, record) => (
          <div className="table-action">
            <a onClick={this.showTrigger.bind(this, "delete")} ref={(v)=>{this.target=v;}}>删除</a>
            <Trigger
              ref={(v)=>{this.trigger=v}}
              visible={visible && visible.delete}
              align={{
                points: ["bc", "tc"],
                offset: [0, -10],
              }}
              equalTargetWidth={false}
              target={this._getTarget}
              getPopupContainer={()=>this.refs.container}
            >
              <div className="trigger-content">
                <p>确定要删除本行吗?</p>
                <Button label="取消" size="small" onClick={this.hideDropDown.bind(this)}/>
                <Button label="确定" size="small" type="primary" onClick={this.saveHandler.bind(this)}/>
              </div>
              <div className="trigger-arrow">
                <em></em>
              </div>
            </Trigger>
            <a onClick={this.showTrigger.bind(this, "detail")}>详情</a>
            <Trigger
              ref={(v)=>{this.trigger=v}}
              visible={visible && visible.detail}
              align={align}
              equalTargetWidth={true}
              equalTargetHeight={true}
              className="dialog-trigger"
              target={this.getPopupContainer}
            >
              <div className="dialog-trigger-mask">
                <div className="trigger-content">
                  <p>查看详情</p>
                  <Button label="取消" size="small" onClick={this.hideDropDown.bind(this)}/>
                </div>
              </div>
            </Trigger>
          </div>
        )
      }
    ];
    return (
      <div className="trigger-confirm-demo">
        <div className="content-box" ref="container">
          <Table ref="table" columns={columns} data={data}/>
        </div>
      </div>
    );
  }

  saveHandler() {
    Toaster.warning(`执行相关操作`);
    this.hideDropDown();
  }

  hideDropDown() {
    this.setState({visible: null});
  }

  showTrigger(code) {
    this.setState({visible: {[code]: true}});
  }
}


export default <TableDeleteConfirm />