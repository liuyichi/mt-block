import React from 'react';

export  default React.createClass({
    render(){
        return <div>
            <p>职位详情</p>
            <p> id:{this.props.params.id}</p>
        </div>
    }
});