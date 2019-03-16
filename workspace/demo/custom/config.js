import React from 'react';
import { Link } from 'react-router';

var routes = {
    "home":React.createClass({render(){return <div className="home">首页</div>}}),
    "post-list": () => async(require('./console/PostList'), 'console'),
    "post-review": () => async(require('./console/PostReview'), 'console'),
    "resume-list":() => async(require('./console/ResumeList'), 'console'),
    "resume-review": () => async(require('./console/ResumeReview'), 'console'),
    "resume-interview": () => async(require('./console/ResumeInterview'), 'console'),
    "my-interview": () => async(require('./console/MyInterview'), 'console'),
    "upload-resume":() => async(require('./console/UploadResume'), 'console'),
    "bpm-list":() => async(require('./bpm/BpmList'), 'bpm'),
    "bpm-apprv":() => async(require('./bpm/BpmApprv'), 'bpm'),
    "custom": [
        {path: "/post-list/:id", code: "post-list", component: () => async(require('./console/PostDetail'), 'console')},
        {path: "/resume-list/:id/:name", code: "resume-list", component: () => async(require('./console/ResumeDetail'), 'console')}
    ]

};

var topRoutes = [
    //{path: "/", component: React.createClass({render(){ return <Link to="/home">登录</Link>}})},
    {path: "/preview/resume/previewDetail", component: React.createClass({render(){return <div>简历预览</div>}})}
];


export default {
    routes: routes,
    topRoutes: topRoutes,
    menuModel: {
        idField: "nodeCode",
        showField: "nodeName",
        typeField: "nodeType",
        childrenField: "childrenMenuList"
    },
    pathMap:{
        "post-list":"/resume/post-list"
    },
    noFoundComponent: React.createClass({render(){return <div>404 not found</div>}})
}
