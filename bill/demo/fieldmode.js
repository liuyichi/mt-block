import React from 'react';
import Bill from '../index';

const model = {
    "code":"system_bill",
    "idField":"busiSysCode",
    "column":"1",
    "alignment":"right",
    "forms":[
        {
            "code":"basic",
            "fields":[
                {
                    "code":"defaultCode",
                    "label":"default状态",
                    "type":"text",
                    "conf": {
                        "mode":"default",
                    }
                },
                {
                    "code":"viewCode",
                    "label":"view状态",
                    "type":"text",
                    "conf": {
                        "mode":"view",
                    }
                },
                {
                    "code":"disabledCode",
                    "label":"disabled状态",
                    "type":"text",
                    "conf": {
                        "disabled":true,
                    }
                },

            ]
        }
    ]
};
const data = {
    "disabledCode": "禁用状态",
    "defaultCode": "默认状态",
    "viewCode": "只能查看"
};

export default <Bill className="bill-basic-demo" model={model} data={data}/>