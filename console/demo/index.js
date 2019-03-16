
import React from 'react';
import M from '../../util';

import { Console } from '../../index';
import model from './model';
import data from './data';

@M.reactExtras
class Demo extends M.BaseComponent {
  render() {
    return (
      <Console
        {...model}
        data={data}
        action={this.action}
      />
    );
  }
  action(data, model) {
    console.log(data, model);
  }
}

export default <Demo />
