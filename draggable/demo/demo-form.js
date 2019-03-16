import React from 'react';
import M from '../../util';
import { Icon, Input, RadioGroup, CheckboxGroup } from '../../index';
import { Draggable } from '../index';

let model = [
  {
    code: 'input',
    label: '输入框',
    type: 'input',
    icon: '',
    conf: {
      placeholder: '标准输入框',
    },
  },
  {
    code: 'radio',
    label: '单选按钮',
    type: 'radio',
    icon: '',
    conf: {
      model: [
        {
          label: '单选按钮1',
          value: 1,
        },
        {
          label: '单选按钮2',
          value: 2,
        },
      ]
    },
  },
];

class DemoForm extends M.BaseComponent {
  constructor(props) {
    super(props);
    Object.assign(this.state, {
      model: model.slice(),
      orderList: [],
    });
  }
  render() {
    let { model, orderList } = this.state;
    let fieldListProps = {
      className: 'demo-form__fields__list',
      data: model,
      idField: 'code',
      itemClass: 'demo-form__fields__list-item',
      format: (item, key, index, array) => {
        return this._renderField(item);
      },
      options: {
        group: {
          name: 'demo-form',
          pull: 'clone',
        },
        dragClass: 'demo-form__fields__list-item--dragging',
        ghostClass: 'demo-form__fields__list-item--ghost',
      },
    };
    let orderListProps = {
      className: 'demo-form__custom-orders__list',
      data: orderList,
      options: {
        group: 'demo-form',
        onAdd: (dragInfo, event, instance) => {
          let { from, newIndex, data } = dragInfo;
          let { orderList } = this.state;
          orderList.splice(newIndex, 0, Object.assign({}, data, {
            key: `${data.code}_${Date.now()}`,
          }));
          this.setState({ orderList });
        },
        sort: true,
        ghostClass: 'demo-form__custom-orders__list-item--ghost',
        dragClass: 'demo-form__custom-orders__list-item--dragging',
      },
      idField: 'key',
      itemClass: 'demo-form__custom-orders__list-item',
      format: (item) => {
        return this._renderOrderField(item);
      },
    };
    return (
      <div className="demo-form">
        <div className="demo-form__fields">
          <div className="demo-form__fields__title">字段</div>
          <Draggable {...fieldListProps} />
        </div>
        <div className="demo-form__custom-orders">
          <div className="demo-form__custom-orders__title">自定义表单顺序</div>
          <Draggable {...orderListProps} />
        </div>
      </div>
    );
  }
  _renderField(model) {
    return (
      <div key={model.code} className="demo-form__single-field">
        {model.icon && <Icon type={model.icon} />}
        <span>{model.label}</span>
      </div>
    );
  }
  _renderOrderField(item) {
    let Element;
    switch(item.code) {
      case 'input':
        Element = Input;
        break;
      case 'radio':
        Element = RadioGroup;
        break;
    }
    return Element && <Element {...item.conf} />;
  }
}

export default <DemoForm />;
