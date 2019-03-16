import React from 'react';
import Upload from '../index';

export default <div className="upload-drag-demo">
	<ul>
	  <li>
	    <div className="left">
	      normal
	    </div>
	    <div className="right">
	      <label>附件</label>
	      <Upload value={[
	        {id: 1, url: "http://www.baidu.com", name: "张三的离职证明.JPG", readonly: true },
	        {id: 2, url: "http://www.baidu.com", name: "张三的请假申请.JPG", "owner": "张三", attachTs: Date.now()},
	        {id: 4, url: "http://www.baidu.com", name: "张三的啊哈哈哈.JPG", "owner": "李四", attachTs: Date.now()},
	        {id: 5, url: "http://www.baidu.com", name: "张三的哇哈哈哈.JPG", "owner": "王五", attachTs: Date.now()},
	      ]} droppable={true} locale={{desc: "请上传文件（仅限5M以内）"}} />
	    </div>
	  </li>
	  <li>
	    <div className="left">
	      没有数据
	    </div>
	    <div className="right">
	      <label>附件</label>
	      <Upload required={true} emptyLabel="无数据" validation="必填" droppable={true} locale={{desc: "请上传文件（仅限5M以内）"}} />
	    </div>
	  </li>
	  <li>
	    <div className="left">
	      禁用模式
	    </div>
	    <div className="right">
	      <label>附件</label>
	      <Upload disabled={true} value={[
	        {id: 1, url: "http://www.baidu.com", name: "张三的离职证明.JPG", readonly: true},
	        {id: 2, url: "http://www.baidu.com", name: "张三的请假申请.JPG", "owner": "张三", attachTs: Date.now()},
	        {id: 4, url: "http://www.baidu.com", name: "张三的啊哈哈哈.JPG", "owner": "李四", attachTs: Date.now()},
	        {id: 5, url: "http://www.baidu.com", name: "张三的哇哈哈哈.JPG", "owner": "王五", attachTs: Date.now()},
	      ]} droppable={true} locale={{desc: "请上传文件（仅限5M以内）"}} />
	    </div>
	  </li>
	  <li>
	    <div className="left">
	      只能查看
	    </div>
	    <div className="right">
	      <label>附件</label>
	      <Upload mode="view" required={true} emptyLabel="无数据" validation="必填" droppable={true} locale={{desc: "请上传文件（仅限5M以内）"}} />
	    </div>
	  </li>
	</ul>
</div>