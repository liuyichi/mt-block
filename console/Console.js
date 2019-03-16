
import React from 'react';
import M from '../util';
import ConsoleButton from './ConsoleButton'

class Console extends M.BaseComponent {
  static defaultProps = {
    prefixCls: 'mt',
    buttons: undefined,
    data: undefined,
    action: undefined,  // 事件操作，function (data, model) { }
  };
  render() {
    let { prefixCls, className, buttons, data, action } = this.props;
    if (buttons == null) return null;
    return (
      <div className={M.classNames(className, `${prefixCls}-console`)}>
        {buttons.map(b => (
          <ConsoleButton
            key={b.code}
            {...b}
            data={data}
            onClick={action}
          />
        ))}
      </div>
    );
  }
}

Console.Button = ConsoleButton;

export default Console;
