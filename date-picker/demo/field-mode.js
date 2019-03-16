import React from 'react';
import {DatePicker, TimePicker, RangePicker} from '../index';
import M from '../../util';
//把弹出窗口帮在滚动的元素上
function getPopupContainer(){
  return document.querySelector('mt-workspace__detail');
}

class FieldModeDemo extends M.BaseComponent {
  render() {
    let props = {
      getPopupContainer: getPopupContainer(),
    };
    return (
      <div className="date-picker-field-mode-demo">
        <div>
          <label>默认模式</label>
          <div>
            <DatePicker {...props} defaultValue={'1510213495651'} format="%Y-%m-%d %H:%M" />
            <TimePicker {...props} value="14:56" />
            <RangePicker {...props} value={[Date.now(), Date.now() + 2592000000]}
                         format="%Y-%m-%d %H:%M" />
          </div>
        </div>
        <div>
          <label>显示模式</label>
          <div>
            <DatePicker {...props} value={Date.now()} mode="view" />
            <TimePicker {...props} value="09:34" mode="view" />
            <RangePicker {...props} value={[Date.now() + 864000000, Date.now() + 1036800000]} mode="view" />
          </div>
        </div>
        <div>
          <label>禁用模式</label>
          <div>
            <DatePicker {...props} value={Date.now()} disabled={true} />
            <TimePicker {...props} value="23:12" disabled={true} />
            <RangePicker {...props} value={[Date.now() + 86400000, Date.now() + 950400000]} disabled={true} />
          </div>
        </div>
      </div>
    );
  }
}

export default <FieldModeDemo />;