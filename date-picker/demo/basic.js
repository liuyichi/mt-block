import React from 'react';
import { DatePicker, TimePicker, RangePicker } from '../index';
import M from '../../util';

//把弹出窗口帮在滚动的元素上
function getPopupContainer(){
    return document.querySelector('mt-workspace__detail');
}

class BasicDemo extends M.BaseComponent {
  render() {
    let props = {
      getPopupContainer: getPopupContainer(),
    };
    return (
      <div className="date-picker-basic-demo">
        <div>
          <label className="date-picker-demo-label">日期选择</label>
          <div>
            <div>
              <DatePicker {...props} placeholder="选择日期" />
            </div>
            <div>
              <DatePicker {...props} placeholder="选择日期" size="small" />
            </div>
          </div>
        </div>
        <div>
          <label className="date-picker-demo-label">时间选择</label>
          <div>
            <div>
              <TimePicker {...props} format="%H:%M" placeholder="选择时间" />
            </div>
            <div>
              <TimePicker {...props} placeholder="选择时间" size="small" />
            </div>
          </div>
        </div>
        <div>
          <label className="date-picker-demo-label">时间段选择</label>
          <div>
            <div>
              <RangePicker {...props} format="%Y-%m-%d %H:%M:%S" placeholder={['开始时间', '结束时间']} />
            </div>
            <div>
              <RangePicker {...props} placeholder={['开始时间', '结束时间']} size="small" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default <BasicDemo />;