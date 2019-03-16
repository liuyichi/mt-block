import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Icon from '../../icon';
import Toaster from '../../toaster';
import Trigger from '../Trigger';
import '../style';
import './index.scss';

class Tooltip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      align: {
        points: ["cl", "tr"],
        offset: [15, 3]
      }
    };
  }

  _getTarget = () => {
    return findDOMNode(this.refs.target);
  };
  getPopupContainer = () => {
    if (this.refs.parentNode) {
      return findDOMNode(this.refs.parentNode);
    } else {
      return document.querySelector(".content-box")
    }
  };

  render() {
    const { align,  visible } = this.state;
    if (!align) {
      return null;
    }
    let iconDomProps = {
      onMouseEnter: this.mouseEnter.bind(this),
      onMouseLeave: this.mouseLeave.bind(this)
    };
    return (
      <div className="trigger-tooltip-demo">
        <div className="trigger-tooltip-demo-content">
          <div className="content-box" ref="parentNode">
            <Icon type="info-circle-o" ref="target"
                  domProps={iconDomProps}
            />
            <Trigger ref="trigger"
                     visible={visible}
                     align={align}
                     equalTargetWidth={false}
                     target={this._getTarget}
                     getPopupContainer={this.getPopupContainer}
                     onAfterVisible={this.afterVisible}
            >
              <div className="trigger-content">
                空山新雨后,天气晚来秋
              </div>
              <div className="trigger-arrow">
                <em></em>
              </div>
            </Trigger>
          </div>
        </div>
      </div>
    );
  }

  afterVisible(visible) {
    Toaster.warning(`visible属性改变,当前visible值为${visible}`)
  }

  mouseEnter() {
    this.setState({visible: true})
  }

  mouseLeave() {
    this.setState({visible: false})
  }
}


export default <Tooltip />