
import React from 'react';
import { Upload } from '../';
import Doc from '../../util/doc';
import api from '../api';
import './index.scss';

let conf = {
	"code": "upload",
	"sub": {
		"title": "Upload",
		"desc": "点击上传、拖拽上传"
	},
	"stage": {
		"title": "使用场景",
		"desc": "用户需要上传文件的时候"
	},
	demos: [
		{
			"code":"basic",
      "title":"点击上传",
      "desc":"分为未上传、已上传、上传成功、正在上传三种状态。可已上传的文件进行删除和下载。点击文件后面的X删除、点击整行预览和下载。",
      'element':require('./basic').default,
      "link":"basic.js"
		},
		{
			"code":"drag",
      "title":"拖拽上传",
      "desc":"可以把文件拖入指定区域，完成上传，同样支持点击上传。",
      'element':require('./drag').default,
      "link":"drag.js"
		}
	],
	api: api
};

export default <Doc className="block-upload-demo" {...conf}/>;

