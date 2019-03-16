
import React, { Component } from 'react';
import Input from '../Input';
import InputGroup from '../InputGroup';
import Immutable from 'immutable';
import '../style';
import './index.scss';

class Demo extends Component {

    render() {
        return (
            <div className="input-demo">
                <div className="panel-body">
                    <InputGroup>
                        <div className="col-4">
                            <Input defaultValue="中国" />
                        </div>
                        <div className="col-5">
                            <Input defaultValue="河北省" />
                        </div>
                        <div className="col-5">
                            <Input defaultValue="石家庄市" />
                        </div>
                    </InputGroup>
                    <InputGroup size="small">
                        <div className="col-4">
                            <Input defaultValue="0571" />
                        </div>
                        <div className="col-8">
                            <Input defaultValue="26888888" />
                        </div>
                    </InputGroup>
                </div>
            </div>
        );
    }
}

export default <Demo />
