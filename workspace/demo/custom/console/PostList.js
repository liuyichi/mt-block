import React from 'react';
import { Button } from "../../../../index";


export  default React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    render(){
        return <div>
            <p>职位列表</p>
            <Button label="刷新数字" type="primary" onClick={() => {
                    window.app&&window.app.refreshPostNum();
                 }}/>
            <Button onClick={
                ()=>{
                    this.context.router.push({
                      pathname: '/post-list/21',
                      query: { modal: true },
                      state: { fromDashboard: true }
                    });
                }
            }>详情</Button>
        </div>
    }
});