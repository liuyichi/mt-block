import React from 'react';
import M from '../../../../util';

import './index.scss';

class Popover extends M.BaseComponent {
  static defaultProps = {
    placement: 'bottom',
  };

  render() {
    let { placement, domProps, children } = this.props;
    let baseCls = `popover`;
    return (
      <div {...domProps} className={this.classNames(baseCls, placement)}>
        <div className={`${baseCls}__arrow`}></div>
        <div className={`${baseCls}__content`}>
          {children}
        </div>
      </div>
    );
  }
}

export default Popover;