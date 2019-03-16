
import React from 'react';
import M from '../../util';
import Api from '../api';
import   MtProgress from '../progress';

import '../style';
import './index.scss';

@M.reactExtras
class Demo extends M.BaseComponent {

  render() {
    return (
      <div>
          <div>
              <MtProgress ref="progress"  percent={60}   showInfo={false}  format={percent=>percent+"$"}/>
              <MtProgress ref="progress"  percent={60}   showInfo={true} strokeWidth={20} format={percent=>percent+"%"}/>
              <MtProgress ref="progress"  percent={100}  showInfo={true} strokeWidth={10} format={percent=>percent+"%"}/>
              <MtProgress ref="progress"  percent={100} showInfo={true} strokeWidth={20} format={percent=>percent+"%"}/>
              <MtProgress type="line" percent={60}  status="success"  showInfo={true} strokeWidth={10} format={percent=>percent+"%"}/>
              <MtProgress type="line" percent={60}  status="exception"  showInfo={true} strokeWidth={20} format={percent=>percent+"%"}/>
              <MtProgress ref="progress" type="circle" percent={60} width={100}  showInfo={true}  format={percent=>percent+"%"}/>
              <MtProgress ref="progress" type="circle" percent={60} width={60}  showInfo={true} strokeWidth={5} format={percent=>percent+"%"}/>
              <MtProgress ref="progress" type="circle" percent={60} width={60}  showInfo={true} strokeWidth={10} format={percent=>percent+"%"}/>
              <MtProgress ref="progress" type="circle" percent={100} width={100}  showInfo={true} strokeWidth={5} format={percent=>percent+"%"}/>
              <MtProgress ref="progress" type="circle" percent={100} width={60}  showInfo={true} strokeWidth={5} format={percent=>percent+"%"}/>
              <MtProgress ref="progress" type="circle" percent={100} width={60}  showInfo={true} strokeWidth={10} format={percent=>percent+"%"}/>
              <MtProgress type="circle" percent={60} width={100} status="exception"  showInfo={true} strokeWidth={5} format={percent=>percent+"%"}/>
              <MtProgress type="circle" percent={60} width={60} status="exception"  showInfo={true} strokeWidth={5} format={percent=>percent+"%"}/>
              <MtProgress type="circle" percent={100} width={60} status="exception"  showInfo={true} strokeWidth={40} format={percent=>percent+"%"}/>
          </div>
          <Api />
      </div>

    );
  }
}

export default <Demo />
