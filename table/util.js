import assign from 'object-assign';
import { cloneDeep } from 'lodash-compat';
import React from 'react';

export function flatArray(data = [], childrenName = 'children') {
  const result = [];
  const loop = (array) => {
    array.forEach(item => {
      const newItem = assign({}, item);
      delete newItem[childrenName];
      result.push(newItem);
      if (item[childrenName] && item[childrenName].length > 0) {
        loop(item[childrenName]);
      }
    });
  };
  loop(data);
  return result;
}

export function treeMap(tree, mapper, childrenName = 'children') {
  return tree.map((node, index) => {
    const extra = {};
    if (node[childrenName]) {
      extra[childrenName] = treeMap(node[childrenName], mapper, childrenName);
    }
    return assign({}, mapper(node, index), extra);
  });
}
export function isMultiTh({ columns }) {
  if (!columns || columns.length === 0) return;
  return columns.every(col => Array.isArray(col));
}
/**
 * 获取列配置
 * @param columns 当前列的配置
 * @param lastCol 如果不传, 则返回有效的列, 否则将有效的列更新后返回全部的配置
 * @returns {*}
 */
export function getValidColumns({ columns }, lastCol) {
  if (!columns) return null;
  if (!isMultiTh({ columns })) return lastCol || columns;
  if (lastCol) {
    columns.splice(columns.length - 1, 1, lastCol);
    return columns;
  }
  if (columns.length > 0 && columns.every(v => Array.isArray(v))) {
    return columns[columns.length - 1];
  }
}
/**
 * 有固定列, 合并表头需要拆分
 * @param columns 当前列的配置
 * @param fCols 固定的列
 */
export function filterColumns({columns}, fCols) {
  if (!columns || !fCols) return null;
  if (!isMultiTh({columns})) return fCols;
  columns = cloneDeep(columns);
  let indexs = fCols.map(col => columns[columns.length - 1].findIndex(v => v.key === col.key));
  if (indexs.some(v => v === -1)) return fCols;
  let sum = 0;
  columns = columns
    .slice(0, columns.length - 1)
    .map(col => {
      return col.filter(row => {
        let _sum = sum + (row.colSpan || 1);
        if (indexs.some(index => sum < index + 1 && _sum >= index + 1)) {
          sum = _sum;
          return true;
        }
        sum = _sum;
      }).map(v => {
        v.colSpan = 1;
        return v;
      });
    });
  columns.push(fCols);
  return columns;
}

