import _ from 'lodash-compat';

let cache = {};

function template(tpl, obj) {
  // 缓存 tpl，加前缀避免 tpl 内容和 JS 对象自带的属性冲突
  let key = 'tpl ' + tpl;
  if (!cache.hasOwnProperty(key)) {
    cache[key] = _.template(tpl, {
      interpolate: /{{([\s\S]+?)}}/g,
    });
  }

  try {
    return cache[key](obj);
  } catch (e) {
    console.error('Template Error:', e, ` tpl: ${tpl}  obj:`, obj);
    return "";
  }
}

// 清空缓存
function clearCache() {
  cache = clearCache;
}
global.addEventListener('hashchange', clearCache);

export default template;
export { cache, clearCache };
