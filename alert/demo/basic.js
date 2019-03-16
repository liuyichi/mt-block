import React from "react";
import Alert from '../Alert';

export default <div className="alert-demo">
    <Alert type="info"  title="一条普通的信息" />
    <Alert type="success" title="一条普通的信息" />
    <Alert type="warning"  title="一条普通的信息" />
    <Alert type="error"  title="一条普通的信息" />
    <Alert title="一条有详情的信息" onClose={() => {}} content="普通信息普通信息普通信息普通信息普通信息普通信息普通信息普通信息普通信息普通信息普通信息普通信息普通信息普通信息普通信息" />
    <Alert type="info"  title="" />
</div>