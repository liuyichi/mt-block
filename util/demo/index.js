import React, { Component } from 'react';
import Doc from '../doc';
let api = require("./api");
let conf = {
    "code":"utils",
    "sub":{
        "title":"Utils",
        "desc":"block用到的公共API"
    },
    api:api
};

export default <Doc className="block-util-demo" {...conf}/>;




