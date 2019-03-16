import React from "react";
import {Button,ButtonGroup} from "../index";

export default <div className="button-demo">
    <ButtonGroup>
        <Button label="时间趋势" size="small" />
        <Button label="数据的明细" size="small" />
        <Button label="路径明细" size="small" />
    </ButtonGroup>
    <ButtonGroup>
        <Button label="1" />
        <Button label="2" disabled={true}/>
        <Button label="3" />
        <Button label="4" />
    </ButtonGroup>
</div>