
let prefixes = [];
let _shift = 0;  // FIXME: 使用更模块化的方案

function _updatePrefixes () {
  let parts = window.location.hash.split('?', 1)[0].split('/');
  for (let i = 1; i < parts.length; i++) {
    parts[i] = parts[i-1] + '/' + parts[i];
  }
  prefixes = parts;
}
window.addEventListener('hashchange', _updatePrefixes);
_updatePrefixes();

function get(level) {
  return prefixes[level];
}

function format(s) {
  return s.replace(/^#(\d+)/, (_, level) => prefixes[+level + _shift]);
}

function shift(delta) {
  _shift = delta;
}

export default { get, format, shift };
