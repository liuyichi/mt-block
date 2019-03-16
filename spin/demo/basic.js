
import React from 'react';
import { Spin } from '../';

class Demo extends React.Component {
  render() {
    return (
      <div className="spin-demo">
        <Spin masked={false} />
      </div>
    );
  }
}

export default <Demo />;
