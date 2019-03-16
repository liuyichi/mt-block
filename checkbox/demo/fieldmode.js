import React from 'react';
import { Checkbox, CheckboxGroup } from '../index';

const model = [{"label": "官网", value: 1}, {"label": "智联招聘", value: 2}, {"label": "中华英才网", value: 3}];

class FieldModeDemo extends React.Component {
  render() {
    return (
      <div className="checkbox-field-mode-demo">
          <div>
              <label className="checkbox-demo-label">复选框状态：</label>
              <Checkbox label="默认状态" />
              <Checkbox label="选中状态" checked={true} />
              <Checkbox label="禁用状态" disabled={true} />
              <Checkbox label="选中并禁用状态" checked={true} disabled={true} />
              <Checkbox label="半选状态(TreeSelect)" indeterminate={true} />
          </div>
          <div>
              <label>复选框组状态</label>
              <div className="checkbox-demo-sub-item">
                  <label className="checkbox-demo-label">默认模式：</label>
                  <CheckboxGroup model={model} mode="default" />
              </div>
              <div className="checkbox-demo-sub-item">
                  <label className="checkbox-demo-label">显示模式：</label>
                  <CheckboxGroup model={model} value={[1, 2, 3]} mode="view" />
              </div>
              <div className="checkbox-demo-sub-item">
                  <label className="checkbox-demo-label">禁用模式：</label>
                  <CheckboxGroup model={model} disabled={true} />
              </div>
          </div>
      </div>
    );
  }
}

export default <FieldModeDemo />;