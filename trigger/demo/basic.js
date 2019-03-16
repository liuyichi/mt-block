import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Select from '../../select';
import Input from '../../input';
import Button from '../../button';
import Checkbox from '../../checkbox';
import Trigger from '../Trigger';
import '../style';
import './index.scss';

class Demo extends Component {
  constructor(props) {
    super(props);
    const prop = {
      visible: true,
      equalTargetWidth: false,
      equalTargetHeight: false,
      autoDestory: false,
      align: {
        points: ["tl", "tr"],
        offset: [0, 0],
        targetOffset: [0, 0],
        overflow: {
          adjustX: 0,
          adjustY: 0
        },
        useCssBottom: 0,
        useCssRight: 0,
        useCssTransform: 0,
      }
    };
    this.state = {
      ...prop,
      prop,
    }
  }

  _changeAlign(code, value) {
    var obj = {};
    obj[code] = value;
    var align = Object.assign({}, this.state.align, obj);
    this.setState({align});
  };

  _changeProp(code, value) {
    var obj = {};
    obj[code] = value;
    var state = Object.assign({}, this.state, obj);
    this.setState(state);
  };

  _changeMixValue(code, index, value) {
    var prevValue = this.state.align[code];
    if (Array.isArray(prevValue)) {
      prevValue[index] = value;
    } else if (typeof prevValue === 'string') {
      prevValue[index] && prevValue.replace(prevValue[index], value.value);
    } else {
      prevValue[index] = value;
    }
    this._changeAlign(code, prevValue);
  }

  _changeMixArray(index, strIndex, value) {
    var points = this.state.align.points;
    points[index] = points[index].replace(points[index][strIndex], value.value);
    this._changeAlign("points", points);
  }

  _open = () => {
    this.setState({open: !this.state.open});
  };
  _getTarget = () => {
    return findDOMNode(this.refs.target);
  };
  getPopupContainer = () => {
    return findDOMNode(this.refs.parentNode);
  };
  reAlign = () => {
    var prop = {};
    ["align", "visible", "equalTargetWidth", "equalTargetHeight", "autoDestory"].forEach(v => prop[v] = this.state[v]);
    this.setState({prop}, ()=> {
      this.refs.trigger.forceAlign();
    })
  };

  render() {
    const { align, visible, equalTargetWidth, equalTargetHeight, autoDestory, prop } = this.state;
    const selectModel = {idField: "value", showField: "label"};
    if (!align) {
      return null;
    }
    return (
      <div className="trigger-basic-demo">
        <h1>配置 align :</h1>
        <p>计算方位的功能使用了 dom-align 插件, 详情请查阅 <a href="https://www.npmjs.com/package/dom-align">dom align 官网文档</a></p>
        <ul className="demo-ul">
          <li>
            <label>points</label>
            <div>
              [<Select value={align["points"][0][0]} model={selectModel}
                       onFetchData={(filter, callback)=>{callback(["t", "c", "b"])}}
                       onChange={this._changeMixArray.bind(this, "0", "0")}/>
              <Select value={align["points"][0][1]} model={selectModel}
                      onFetchData={(filter, callback)=>{callback(["l", "c", "r"])}}
                      onChange={this._changeMixArray.bind(this, "0", "1")}/>
              ,
            </div>
          </li>
          <li>
            <div>
              <Select value={align["points"][1][0]} model={selectModel}
                      onFetchData={(filter, callback)=>{callback(["t", "c", "b"])}}
                      onChange={this._changeMixArray.bind(this, "1", "0")}/>
              <Select value={align["points"][1][1]} model={selectModel}
                      onFetchData={(filter, callback)=>{callback(["l", "c", "r"])}}
                      onChange={this._changeMixArray.bind(this, "1", "1")}/>
              ]
            </div>
          </li>
        </ul>
        <ul className="demo-ul">
          <li>
            <label>offset</label>
            <div>
              [
              <Input type="number" value={align["offset"][0] || "0"}
                     onChange={this._changeMixValue.bind(this, "offset", "0")}/>
              <Input type="number" value={align["offset"][1] || "0"}
                     onChange={this._changeMixValue.bind(this, "offset", "1")}/>
              ]
            </div>
          </li>
          <li>
            <label>targetOffset</label>
            <div>
              [
              <Input type="number" value={align["targetOffset"][0] || "0"}
                     onChange={this._changeMixValue.bind(this, "targetOffset", "0")}/>
              <Input type="number" value={align["targetOffset"][1] || "0"}
                     onChange={this._changeMixValue.bind(this, "targetOffset", "1")}/>
              ]
            </div>
          </li>
        </ul>
        <ul className="demo-ul">
          <li>
            <label>overflow</label>
            <ul className="demo-ul">
              <li>
                <label>adjustX</label>
                <Checkbox checked={align["overflow"]["adjustX"]}
                          onChange={(e) => this._changeMixValue('overflow', 'adjustX', e.target.checked)}/>
              </li>
              <li>
                <label>adjustY</label>
                <Checkbox checked={align["overflow"]["adjustY"]}
                          onChange={(e) => this._changeMixValue('overflow', 'adjustY', e.target.checked)}/>
              </li>
            </ul>
          </li>
        </ul>
        <ul className="demo-ul">
          <li>
            <label>useCssBottom</label>
            <Checkbox checked={align["useCssBottom"]}
                      onChange={(e) => this._changeAlign('useCssBottom', e.target.checked)}/>
          </li>
          <li>
            <label>useCssRight</label>
            <Checkbox checked={align["useCssRight"]}
                      onChange={(e) => this._changeAlign('useCssRight', e.target.checked)}/>
          </li>
          <li>
            <label>useCssTransform</label>
            <Checkbox checked={align["useCssTransform"]}
                      onChange={(e) => this._changeAlign('useCssTransform', e.target.checked)}/>
          </li>
        </ul>
        <h1>配置其他的属性:</h1>
        <ul className="demo-ul">
          <li>
            <label>visible</label>
            <Checkbox checked={visible} onChange={(e) => this._changeProp("visible", e.target.checked)}/>
          </li>
          <li>
            <label>equalTargetWidth</label>
            <Checkbox checked={equalTargetWidth}
                      onChange={(e) => this._changeProp("equalTargetWidth", e.target.checked)}/>
          </li>
          <li>
            <label>equalTargetHeight</label>
            <Checkbox checked={equalTargetHeight}
                      onChange={(e) => this._changeProp("equalTargetHeight", e.target.checked)}/>
          </li>
          <li>
            <label>autoDestory</label>
            <Checkbox checked={autoDestory} onChange={(e) => this._changeProp("autoDestory", e.target.checked)}/>
          </li>
        </ul>
        <Button type="primary" label="align" onClick={this.reAlign}/>
        <div className="panel-body" ref="parentNode">
          我是 popupContainer node
          <div ref="target" className="target-node">我是定位参照物 target node</div>
        </div>
        <Trigger ref="trigger"
          {...prop}
                 target={this._getTarget}
                 getPopupContainer={this.getPopupContainer}>
          <div className="source-node">
            <p>我是弹出内容 source node</p>
            <p>我是弹出内容 source node</p>
            <p>我是弹出内容 source node</p>
            <p>我是弹出内容 source node</p>
            <p>我是弹出内容 source node</p>
            <p>我是弹出内容 source node</p>
            <p>我是弹出内容 source node</p>
            <p>我是弹出内容 source node</p>
            <p>我是弹出内容 source node</p>
            <p>我是弹出内容 source node</p>
          </div>
        </Trigger>
      </div>
    );
  }
}

export default <Demo />