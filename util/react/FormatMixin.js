import _ from 'lodash-compat';
import ContextMixin from './ContextMixin';

/**
 * 配置上下文中的格式化方法（this.context.format()）
 * 与 context 的覆盖机制相反，定义在外层的 format 方法优先级更高
 * 用法：在 mixins 中添加 FormatterMixin(function (data, model) { })
 * @param format 接收待格式化的数据和模型，返回格式化后的 HTML 片段或 React 元素
 *               返回 undefined 时会掉落到更内层的 format 函数
 */
function FormatMixin(format) {
  format = format || _.constant(undefined);
  var wrapped = function () {
    if (this.context.format) {
      var formatted = this.context.format.apply(this, arguments);
    }
    if (formatted === undefined) {
      formatted = format.apply(this, arguments);
    }
    return formatted;
  };
  return _.extend({},
    ContextMixin.Child({format: wrapped}),
    ContextMixin('format')
  );
}

export default FormatMixin;
