import React from 'react';
import TreeSelect from '../index';

function getPopupContainer(){
    return document.querySelector('.mt-workspace__detail');
}

let model = {
    "idField": "id",
    "parentIdField": "parentId",
    "showField": "name",
    "showTpl": "{{name}}({{id}})",
    "leafField": "leaf",
    "checkable":true,
    "height": "300px"
};

function fetchData(filter, callback){
    var data = [
        {id: 1, parentId: 0, name: 'app'},
        {id: 10, parentId: 0, name: '餐饮平台', leaf: true},
        {id: 20, parentId: 1, name: 'node_modules'},
        {id: 201, parentId: 20, name: 'A1.0'},
        {id: 2011, parentId: 201, name: 'node_modules',leaf:false},
      {id:301,parentId: 2011, name: 'B1.0',leaf: true},
        {id: 2012, parentId: 201, name: '后端组',leaf:true},
        {id: 2013, parentId: 201, name: '产品组',leaf:true},
        {id: 202, parentId: 20, name: '大象'},
        {id: 2021, parentId: 202, name: '前端组',leaf:true}

    ];
    callback && callback(data);
}
function onChange(value){
    console.info(value);
}

export default <div className="tree-select-basic-demo">
    <div className="select-panel">
        <p>单选 分三种状态显示 default|disabled|view</p>
        <TreeSelect onChange={onChange}
                    required={true}
                    model={model}
                    placeholder="选择部门"
                    validation="必填"
                    getPopupContainer={getPopupContainer()}
                    onFetchData={fetchData}
                    defaultValue={{"id":20,"name":"企业平台"}}
        />
        <TreeSelect model={model}
                    disabled={true}
                    defaultValue={{"id":20,"name":"企业平台"}}
        />
        <TreeSelect model={model}
                    mode="view"
                    defaultValue={{"id":20,"name":"企业平台"}}
        />
     </div>
    <div className="select-panel">
        <p>多选</p>
        <TreeSelect multiple = {true}
                    onChange={onChange}
                    required={true}
                    model={model}
                    placeholder="选择部门"
                    validation="必填"
                    getPopupContainer={getPopupContainer()}
                    defaultValue={[{"id":20,"name":"企业平台"},{"id":2011,"name":"前端组"}]}
                    onFetchData={fetchData}/>
        <TreeSelect model={model}
                    multiple = {true}
                    disabled={true}
                    defaultValue={[{"id":20,"name":"企业平台"},{"id":2011,"name":"前端组"}]}
        />
        <TreeSelect model={model}
                    mode="view"
                    multiple = {true}
                    defaultValue={[{"id":20,"name":"企业平台"},{"id":2011,"name":"前端组"}]}
        />
    </div>


</div>
