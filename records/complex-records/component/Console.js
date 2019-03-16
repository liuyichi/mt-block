import React from 'react';
import { findDOMNode } from 'react-dom';
import M from '../../../util';
import { Console as _Console_, ConsoleButton } from '../../../console';
import Button from '../../../button';

/**
 * 操作按钮组
 */
class Console extends M.BaseComponent.Mixin(M.ContextMixin('records')) {
  render() {
    let { className, model, data, inRow } = this.props;
    let { records } = this.context;
    if (model == null) return null;
    let Console_ = this.props.Console || records.props.Console || records.Console || _Console_;

    let buttons = [];
    (model.buttons || []).forEach(b => {
      const isRowBtn = inRow && b.hideIn != 'row';
      const newBtn = {
        // 默认显示超小号button
        size: 'xsmall',
        // 如果是行操作，默认样式primary，没有边框
        style: isRowBtn ? 'primary' : 'default',
        shape: isRowBtn ? 'no-outline' : undefined,
        ...b,
      };
      if (newBtn.hideIn != (inRow ? 'row' : 'main')) {
        buttons.push(newBtn);
      }
    });
    let moreBtn;
    // 当button的数量超过6个时，合并显示
    if (!inRow && buttons.length > 6) {
      moreBtn = <MoreButton className={`${className}__more-btn`} buttons={buttons.slice(5)} />;
      buttons = buttons.slice(0, 5);
    }
    model = { ...model, buttons };
    return (
      <div className={this.classNames()}>
        <Console_ {...this.props}
                  {...model}
                  data={data}
                  className={`${className}__btn-list`}
                  action={records._action} />
        {moreBtn}
      </div>
    );
  }
}

class MoreButton extends M.BaseComponent {
  constructor(props) {
    super(props);
    Object.assign(this.state, {
      showList: false,
    });
  }
  componentDidMount() {
    this.windowEventListener('click', (e) => {
      let { showList } = this.state;
      let { container } = this.refs;
      if (showList
        && !findDOMNode(container).contains(e.target)) {
        this.toggleList(false);
      }
    });
  }
  render() {
    const { buttons } = this.props;
    const { showList } = this.state;
    return (
      <div ref="container" className={this.classNames('more-button')}>
        <Button
          className="more-button__btn"
          type="default"
          size="xsmall"
          label="更多"
          icon={showList ? "angle-up" : "angle-down"}
          onClick={this.toggleList.bind(this, !showList)} />
        {showList && (
          <ul className="more-button__btn-list">
            {buttons.map((item, i) => {
              const { action, ...props } = item;
              return (
                <li key={i} className="more-button__btn-item">
                  <ConsoleButton
                    {...props}
                    size="small"
                    shape="no-outline"
                    onClick={this.action.bind(this, action)} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
  toggleList(show) {
    this.setState({ showList: show });
  }
  action(action, ...args) {
    action && action(...args);
    this.toggleList(false);
  }
}

export default Console;
