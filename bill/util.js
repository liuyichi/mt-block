import { isEmptyString, getSafetyString } from '../util/data';

/**
 * 返回指定code的model
 * @param model bill的model
 * @param code 指定字段的code
 * @param model
 * @param code
 * @returns {field}
 */
export function getFieldModel(model,code){
  let field;
  if(model&&model.forms&&model.forms.length>0){
    model.forms.some(form=>{
      field = (form&&form.fields&&form.fields.length>0&&form.fields.find(field=>field.code===code));
      return field;
    });
  }
  return field;
}
/**
 * 从对象中拷贝指定的属性
 * @param obj 需要更改的对象
 * @param fromObj 参照对象
 * @param array 定义指定的属性
 */
export function mergeProps(obj, fromObj, array) {
  if(_.isEmpty(fromObj)){
    return;
  }
  if(array&&array.length>0){
    array.forEach(prop=>{
      fromObj[prop]&&(obj[prop]=fromObj[prop]);
    })
  }
}

/**
 * 返回解析后的参数集合
 * @param paramList
 * @returns {Array}
 */
export function getParamList(paramList) {
  var _paramList = [];
  if (paramList && paramList.length > 0) {
    paramList.forEach(v => {
      if (_.isObject(v)) {
        _paramList = _paramList.concat(Object.keys(v).map(key => {
          return {code: key, fromCode: v[key]};
        }));
      } else if (_.isString(v)) {
        _paramList.push({code: v, fromCode: v});
      }
    });
  }
  return _paramList;
}

/**
 * 类型兼容
 * list 系列转换为 select 系列
 */
export function transferFieldType(field) {
  if (_.isEmpty(field)) {
    return;
  }
  switch (field.type) { // 进行类型的兼容
    case "list":
      field.type = "select";
      break;
    case "multiList":
      field.type = "multiSelect";
      break;
    case "treeList":
      field.type = "treeSelect";
      break;
    case "treeMultiList":
      field.type = "treeMultiSelect";
      break;
  }
}