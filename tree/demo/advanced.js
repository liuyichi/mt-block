
import React from 'react';
import Tree from '../index';
import Button from '../../button';
var _ = require('lodash-compat');
import './advance/style.scss';
let model = require('./advance/model.json');
let defaultData = require('./advance/data.json');
/**
 * 过滤到几级数据
 * @param data tree的数据
 * @param model tree的model 包含idField和parentIdField
 * @param level 过滤到几级
 */
function filterLevel(data,model,level){
    let idField = model.idField,
        parentField=model.parentIdField;
    var resultList = [];
    let findLevel = function(_item,_data,_index){
        var parentItem = _.find(_data,function(obj){
            if(obj[idField] == _item[parentField]){
                return obj;
            }
        });
        if(parentItem){
            _index ++;
            return findLevel(parentItem,_data,_index);
        }else{
            return _index;
        }

    };
    _.forEach(data,function(item){
        let itemLevel = findLevel(item,data,0);
        if(itemLevel==level){
            //还需要判断是否有子数据
            let hasChild = _.find(data,function(obj){
                if(obj[parentField]==item[idField]){
                    return true;
                }
            });
            if(hasChild){
                resultList.push(item);
            }
        }
    });
    return resultList;
}



/**
 *  定义一个model
 *
 */
let TreeDemo = React.createClass({

    getInitialState(){
      return {
          data:[]
      }
    },
    componentDidMount(){
        //填充数据
        //获取需要展开的n级节点数据
        var defaultExpands = filterLevel(defaultData,model,1),defaultExpandedIds=[];
        //展开对应几级 现在不支持 封装一个
        _.forEach(defaultExpands,function(item){
            defaultExpandedIds.push(item[model.idField]);
        });
        this.setState({data:defaultData,defaultExpandedIds:defaultExpandedIds})
    },
    render(){
        return (
            <div className="demo-tree-advance">
                <Tree ref="tree"
                      defaultExpandedIds={this.state.defaultExpandedIds}
                      data={this.state.data}
                      idField={model.idField}
                      showField={model.showField}
                      parentField={model.parentIdField}
                      leafField={model.leafField}
                      autoExpandParent = {true}
                      format={this._formatHandler}
                      loadData={this._loadHandler}
                      {...model}
                />
            </div>
        );
    },
    _formatHandler(node){
       return <span className="dept-name-box">{node[model.showField]}</span>;
    },
    async _loadHandler(nodeId){
        var fetchData = function (node,time) {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    //构建5个子节点返回
                    let list = [],item;
                    for(var i=1;i<6;i++){
                        item={};
                        item[model.idField]=node[model.idField]+"C00"+i;
                        item[model.showField]=node[model.showField]+"-child"+i;
                        item[model.parentIdField]=node[model.idField];
                        list.push(item);
                    }
                    resolve(list);
                }, time);
            })
        };
        let node = _.find(this.state.data,function(item){
           if(item[model.idField]==nodeId){
               return item;
           }
        });
        let result = await fetchData(node,1000);
        this.setState({data:this.state.data.concat(result)});
    }
});

export default <TreeDemo />