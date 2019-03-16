import React from 'react';
import { Radio, RadioGroup } from '../index';

const model = [{"label": "官网", value: 1}, {"label": "智联招聘", value: 2}, {"label": "中华英才网", value: 3}];

class FieldModeDemo extends React.Component {
  render() {
    return (
      <div className="radio-field-mode-demo">
          <div>
              <label className="radio-demo-label">状态：</label>
              <Radio label="不选" />
              <Radio label="选中" checked={true} />
              <Radio label="禁用" disabled={true} />
          </div>
          <div>
              <label>复选框组状态</label>
              <div className="radio-demo-sub-item">
                  <label className="radio-demo-label">默认模式：</label>
                  <RadioGroup model={model} value={1} mode="default" />
              </div>
              <div className="radio-demo-sub-item">
                  <label className="radio-demo-label">显示模式：</label>
                  <RadioGroup model={model} value={2} mode="view" />
              </div>
              <div className="radio-demo-sub-item">
                  <label className="radio-demo-label">禁用模式：</label>
                  <RadioGroup model={model} value={3} disabled={true} />
              </div>
          </div>
      </div>
    );
  }
}

export default <FieldModeDemo />;