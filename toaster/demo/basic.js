
import React from 'react';
import M from '../../util';
import { Toaster } from '../';
import Button from '../../button';
import './index.scss'

@M.reactExtras
class Demo extends M.BaseComponent {
    render() {
        return (
            <div className="demo">
                <h4>点击按钮查看对应弹框效果</h4>
                <div className="toaster-demo">
                    <Button type="primary" onClick={this.demoInfo}>显示提示信息</Button>
                    <Button type="success" onClick={this.demoSuccess}>执行成功信息</Button>
                    <Button type="warning" onClick={this.demoWarning}>提出警告</Button>
                    <Button type="danger" onClick={this.demoError}>错误信息</Button>
                    <Button type="primary" onClick={this.demoContentInfo}>带内容提示信息</Button>
                    <Button type="warning" onClick={this.demoOnlyWarning}>无标题无内容</Button>
                </div>
            </div>
        );
    }
    demoInfo() {
        Toaster.show({
            type: 'info',
            title: '显示提示信息',
        });
    }
    demoSuccess() {
        Toaster.show({
            type: 'success',
            title: '执行成功信息',
        });
    }
    demoWarning() {
        Toaster.show({
            type: 'warning',
            title: '提出警告',
        });
    }
    async demoError() {
        await Toaster.show({
            type: 'error',
            title: '错误信息'
        });
    }
    demoContentInfo() {
        Toaster.show({
            type: 'info',
            title: '提示信息',
            content:"提示信息内容"
        });
    }
    demoOnlyWarning() {
        Toaster.show({
            type: 'warning'
        });
    }
}

export default <Demo />
