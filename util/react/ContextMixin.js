import _ from 'lodash-compat';
import toObject from '../data/toObject';

/**
 * 根据参数中的字段为组件生成 contextTypes 属性
 * 用法：在 mixins 中添加 ContextMixin('name1', 'name2', ...)
 */
function ContextMixin(...fields) {
  return {
    contextTypes: toObject(fields, _.identity, _.constant(_.noop)),
  };
}

/**
 * 根据 contexts 为组件生成 childContextTypes 属性和 getChildContext 属性
 * 用法：在 mixins 中添加 ChildContextMixin({name1: value1, name2: value2, ...})
 */
function ChildContextMixin(contexts) {
  return {
    childContextTypes: _.mapValues(contexts, _.constant(_.noop)),
    getChildContext: function () {
      return _.mapValues(contexts, function (context) {
        return _.isFunction(context) ? context.bind(this) : context;
      }.bind(this));
    },
  };
}
ContextMixin.Child = ChildContextMixin;

/**
 * 与 M.ChildContextMixin 类似，但是添加一个 getter 而不是一个属性
 */
function ChildContextGetterMixin(contexts) {
  _.each(contexts, function (context) {
    context.bind = context.apply;
  });
  return ChildContextMixin(contexts);
}
ContextMixin.ChildGetter = ChildContextGetterMixin;

export default ContextMixin;
