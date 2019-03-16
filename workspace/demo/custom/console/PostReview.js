import React from 'react';
import { Button } from "../../../../index";

export  default React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    render(){
        return <div>
            <p>职务预览</p>
            <Button onClick={
                ()=>{
                    //this.context.router.push({
                    //  pathname: '/preview/resume/previewDetail'
                    //});
                     this.context.router.push("/preview/resume/previewDetail");
                }
            }>预览</Button>
        </div>
    }
});