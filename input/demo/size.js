
import React, { Component } from 'react';
import Input from '../Input';
import InputGroup from '../InputGroup';
import Immutable from 'immutable';
import '../style';
import './index.scss';

class Demo extends Component {
        constructor(props) {
                super(props);
                this.state = {
                        data: Immutable.Map()
                }
        }

        _changeHandle(code, value) {
                let data = this.state.data.set(code, value);
                this.setState({data});
        }

        render() {
                return (
                    <div className="input-demo">
                            <div className="panel-body">
                                    <Input value="默认大小" onChange={this._changeHandle.bind(this, "_6")} />
                                    <Input size="small" value="小号输入框" onChange={this._changeHandle.bind(this, "_6.1")} />
                            </div>
                    </div>
                );
        }
}

export default <Demo />
