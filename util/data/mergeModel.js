import _ from 'lodash-compat';
import { isValidElement } from 'react';

function mappable(model) {
  if (isValidElement(model)) return;
  if (_.isPlainObject(model)) {
    for (let item of Object.values(model)) {
      mappable(item);
    }
  } else if (_.isArray(model)) {
    for (let item of model) {
      if (item != null && item.code != null && !Number.isInteger(+item.code)) {
        model[item.code] = item;
      }
      mappable(item);
    }
  }
}

function merge(model, affix) {
  for (let [k, v] of Object.entries(affix)) {
    if (_.isPlainObject(v) && !isValidElement(v)) {
      let o = _.get(model, k);
      if (o == null) {
        o = {};
        _.set(model, k, o);
      }
      merge(o, v);
    } else {
      _.set(model, k, v);
    }
  }
}

function mergeModel(model, ...sources) {
  mappable(model);
  for (let source of sources) {
    merge(model, source);
  }
}

export default mergeModel;
