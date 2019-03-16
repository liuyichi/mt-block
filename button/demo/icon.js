import React from "react";
import Button from '../Button';

export default <div className="button-demo">
    <Button icon="plus" size="large" shape="circle-outline" />
    <Button icon="plus" shape="circle-outline" />
    <Button icon="plus" size="small" shape="circle-outline" />
    <Button icon="plus" size="xsmall" shape="circle-outline" />
    <Button icon="plus" label="添加" />
    <Button icon="plus" label="添加" iconRight={true} type="primary" />
</div>