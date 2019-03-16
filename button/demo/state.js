import React from "react";
import Button from '../Button';

export default <div className="button-demo">
    <p>
        <Button label="BUTTON" shape="no-outline"/>
        <Button label="BUTTON" type="success"/>
    </p>
    <p>
        <Button label="BUTTON" shape="no-outline" disabled={true}/>
        <Button label="BUTTON" disabled={true}/>
    </p>
    <p>
        <Button label="BUTTON" shape="no-outline" loading={true}/>
        <Button label="BUTTON" type="primary" loading={true}/>
        <Button label="BUTTON" icon="plus" type="primary" loading={true}/>
    </p>
    <p>
        <Button icon="plus" loading={true} shape="no-outline"/>
        <Button icon="plus" loading={true}/>
    </p>
</div>