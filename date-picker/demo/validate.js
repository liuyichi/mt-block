import React from 'react';
import {DatePicker, TimePicker, RangePicker} from '../index';
import M from '../../util';
import { Button } from '../../index';

//把弹出窗口帮在滚动的元素上
function getPopupContainer(){
  return document.querySelector('mt-workspace__detail');
}

class ValidateDemo extends M.BaseComponent {
  render() {
    let props = {
      getPopupContainer: getPopupContainer(),
    };
    return (
      <div className="date-picker-validate-demo">
        <div>
          <label>日期选择</label>
          <div>
            <DatePicker {...props} ref="1" placeholder="必填项" required={true} validation="必填项" />
          </div>
        </div>
        <div>
          <label>时间选择</label>
          <div>
            <TimePicker {...props} ref="2" value="13:14"
                        placeholder="必填项，且不得小于15点" required={true}
                        validation="必填项" validator={this._validateTime.bind(this)}/>
          </div>
        </div>
        <div>
          <label>时间段选择</label>
          <div>
            <RangePicker ref="3" required={true} showUpToNow={true}
                         validation={['请填写开始时间', '请填写结束时间']}
                         placeholder={['开始时间', '结束时间']}
                         value={[1473955200000, 1474041600000]}
                         validator={this._validateRange.bind(this)} />
          </div>
        </div>
        <div>
          <Button label="检查有效性" type="primary" onClick={this._validate.bind(this)} />
        </div>
      </div>
    );
  }
  _validateTime(value) {
    let split = value.split(':');
    if (split[0] < 15) {
      return '不得小于15点';
    }
  }
  _validate() {
    for (let prop in this.refs) {
      this.refs[prop].validate();
    }
  }
  _validateRange(value) {
    if (value[1] - value[0] < 259200000) {
      return '不得少于三天';
    }
  }
}

export default <ValidateDemo />;