import React from "react";
import Tree from '../index';
import Icon from '../../icon';
import Button from '../../button';

let data = [
    { id: 0, parentId: -1, name: 'running man', nickName: 'running man' },
    { id: 1, parentId: 0, name: '刘在石', nickName: '国民MC' },
    { id: 2, parentId: 0, name: '金钟国', nickName: '老虎', selectable: false, disableCheckbox: true },
    { id: 11, parentId: 1, name: '池石镇', nickName: '黑斑羚', leaf: true, disabled: true },
    { id: 21, parentId: 2, name: '河东勋', nickName: 'Haroro', leaf: true },
    { id: 22, parentId: 2, name: '姜熙建', nickName: '姜Gary', leaf: true },
    { id: 3, parentId: 0, name: '宋智孝', nickName: '懵智', leaf: true },
    { id: 4, parentId: 0, name: '李光洙', nickName: '背叛长颈鹿', leaf: true }
];

function format(item, tree){
    if (tree.getChildIds(item.id).length !== 0) {
        return `${item.name} (${item.nickName})`;
    } else {
        return item.name;
    }
}

export default <div>
    <Tree
      showLine
      iconFormat={{
      "close": "block-icon-folder",
      "open": <span className="block-icon-openedFolder"></span>,
      "leaf": (props) => {
        return props.data.id === 4 ? "block-icon-file-o" : "block-icon-file"
      }}}
      data={data}
      idField="id"
      parentIdField="parentId"
      showField="name"
      leafField="leaf"
      checkable={true}
      selectable={true}
      checkHalfable={false}
      format={format}
    />
    <Tree
      iconFormat={{"close": "block-icon-folder", "open": "block-icon-openedFolder", "leaf": "block-icon-file"}}
      data={data}
      idField="id"
      parentIdField="parentId"
      showField="name"
      leafField="leaf"
      checkable={true}
      selectable={true}
      checkHalfable={false}
      format={format}
    />
</div>
