import React from 'react';
import ReactDOM from 'react-dom';
import M from '../../../../util';

import './index.scss';

class SlidingPanel extends M.BaseComponent {
  constructor(props) {
    super(props);
    Object.assign(this.state, {
      Content: null,
    });
  }

  componentDidMount() {
    this.windowEventListener('click', (e) => {
      const { mask } = this.refs;
      if (this.state.Content && mask && mask.contains(e.target)) {
        this.remove();
      }
    });
  }

  render() {
    let { Content } = this.state;
    let baseCls = `sliding-panel`;
    return (
      <div className={this.classNames('mt-complex-records__sliding-panel', baseCls)} hidden={!Content}>
        <div ref="mask" className={`${baseCls}__mask`}></div>
        <div className={`${baseCls}__content`}>
          {Content && <Content onClose={this.remove} />}
        </div>
      </div>
    );
  }

  add(Content) {
    this.setState({
      Content: Content,
    });
  }

  remove() {
    this.setState({
      Content: null,
    });
  }

  static getContainer() {
    return document.body;
  }
  static show(content, config) {
    if (this.instance == null) {
      let $container = document.createElement('div');
      this.getContainer().appendChild($container);
      this.instance = ReactDOM.render(<SlidingPanel {...config} />, $container);
    }
    return this.instance.add(content);
  }
  static hide() {
    this.instance && this.instance.remove();
  }
  static clear() {
    this.instance && this.instance.remove();
  }
}

export default SlidingPanel;