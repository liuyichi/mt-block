import React, { Component } from 'react';
import M from '../../util';
import Upload from '../index';
import Button from '../../button';

class Demo extends Component {
  validate = () => {
    Object.keys(this.refs).forEach(v => this.refs[v].validate && this.refs[v].validate());
  }
  render() {
    return (
      <div className="upload-basic-demo">
        <ul>
          <li>
            <div className="left">
              未上传
            </div>
            <div className="right">
              <label>附件</label>
              <Upload ref="1"
                      fileType={["png","pdf"]}
                      locale={{label: "上传",desc: "哈哈哈", uploading: "努力上传中",
                      uploadSucceed: "成功啦!",
                      uploadFailed: "很遗憾",
                      delete: "你真的要删除人家嘛",
                      wrongExtType: "只允许上传 png, pdf",
                      }}
                      onBeforeUploadAll={(files)=>{
                      if (files.length > 3) {
                      return "一次不能超过 3 个"
                      }
                      }}
                      model={{idField: "id", nameField: "name", urlField: "url"}}
                      async={false}
                      size="small"
                      onUpload={(file, params) => {
                        return new Promise((success, error) => {
                          // 这里向后端发下请求吧
                          var status = 1;
                          if (status === 0) {
                           // 弹出报错框
                           error({message: "失败啦"});
                          }
                          success({id: file._pkCode_, name: file.name, owner: "刘开梅", "attachTs": Date.now()})
                        });
                      }}
                      onError={()=>{console.log("失败")}}
                      onSuccess={()=>{console.log("成功")}}/>
            </div>
          </li>
          <li>
            <div className="left">
              已上传
            </div>
            <div className="right">
              <label>附件</label>
              <Upload ref="1.1" value={[
                {id: 1, url: "http://www.baidu.com", name: "张三的离职证明.JPG", readonly: true},
                {id: 2, url: "http://www.baidu.com", name: "张三的离职证明2.JPG"},
                {id: 4, url: "http://www.baidu.com", name: "张三的离职证明3.JPG"},
                {id: 5, url: "http://www.baidu.com", name: "张三的离职证明4.JPG"},
              ]} multiple={false} />
            </div>
          </li>
          <li>
            <div className="left">
              单文件上传
            </div>
            <div className="right">
              <label>附件</label>
              <Upload ref="1.1" value={[
                {id: 5, url: "http://www.baidu.com", name: "张三的离职证明4.JPG"},
              ]} multiple={false} />
            </div>
          </li>
          <li>
            <div className="left">
              正在上传
            </div>
            <div className="right">
              <label>附件</label>
              <Upload ref="1.2" value={[
                {id: 1, url: "http://www.baidu.com", name: "张三的离职证明1.JPG"},
                {id: 2, url: "http://www.baidu.com", name: "张三的离职证明2.JPG", uploading: true},
              ]}></Upload>
            </div>
          </li>
          <li>
            <div className="left">
              上传成功
            </div>
            <div className="right">
              <label>附件</label>
              <Upload className="custom_field" ref="1.3" value={[
                {id: 1, url: "https://gss1.bdstatic.com/9vo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike180%2C5%2C5%2C180%2C60/sign=ca5abb5b7bf0f736ccf344536b3cd87c/29381f30e924b899c83ff41c6d061d950a7bf697.jpg", name: "张三的离职证明1.JPG"},
                {id: 2, url: "https://gss3.bdstatic.com/-Po3dSag_xI4khGkpoWK1HF6hhy/baike/crop%3D36%2C0%2C1207%2C799%3Bc0%3Dbaike150%2C5%2C5%2C150%2C50/sign=443363679b504fc2b610ea45d8eed13d/7acb0a46f21fbe09007e2c7b6b600c338744adb9.jpg", name: "张三的离职证明2.JPG", succeed: true, "owner": "张三", attachTs: Date.now()},
              ]} model={{nameField: (record) => {
              return <div><img src={record.url} /> {record.name}</div>
              }, timeField: (record) => {
              return <span>{M.formatDatetime(record.attachTs, "%m-%d")}</span>
              }}}></Upload>
            </div>
          </li>
          <li>
            <div className="left">
              上传失败
            </div>
            <div className="right">
              <label>附件</label>
              <Upload ref="1.4" value={[
                {id: 1, url: "http://www.baidu.com", name: "张三的离职证明1.JPG"},
                {id: 2, url: "http://www.baidu.com", name: "张三的离职证明2.JPG", failed: true, "owner": "张三", attachTs: Date.now()},
              ]}></Upload>
            </div>
          </li>
          <li>
            <div className="left">
              没有数据
            </div>
            <div className="right">
              <label>附件</label>
              <Upload ref="1.5" required={true} validation="必填" locale={{desc: "请上传文件（仅限5M以内）"}} />
            </div>
          </li>
          <li>
            <div className="left">
              禁用模式
            </div>
            <div className="right">
              <label>附件</label>
              <Upload ref="1.6" value={[
                {id: 1, url: "http://www.baidu.com", name: "张三的离职证明1.JPG"},
                {id: 2, url: "http://www.baidu.com", name: "张三的离职证明2.JPG", failed: true, "owner": "张三", attachTs: Date.now()},
              ]} disabled={true} required={true} validation="必填" locale={{desc: "请上传文件（仅限5M以内）"}} />
            </div>
          </li>
          <li>
            <div className="left">
              只能查看
            </div>
            <div className="right">
              <label>附件</label>
              <Upload ref="1.7" emptyLabel="无数据" mode="view" required={true} validation="必填" locale={{desc: "请上传文件（仅限5M以内）"}} />
            </div>
          </li>
          <li>
            <div className="left">
              只能查看
            </div>
            <div className="right">
              <label>附件</label>
              <Upload ref="1.7" value={[
                {id: 1, url: "http://www.baidu.com", name: "张三的离职证明1.JPG"},
                {id: 2, url: "http://www.baidu.com", name: "张三的离职证明2.JPG", failed: true, "owner": "张三", attachTs: Date.now()},
              ]}  emptyLabel="无数据" mode="view" required={true} validation="必填" locale={{desc: "请上传文件（仅限5M以内）"}} />
            </div>
          </li>
        </ul>
        <Button label="校验有效性" type="primary" onClick={this.validate}/>
        <br />
      </div>
    );
  }
}

export default <Demo />