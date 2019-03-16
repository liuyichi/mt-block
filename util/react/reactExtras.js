let lifecycleMethods = [
  'componentWillMount',
  'componentDidMount',
  'componentWillReceiveProps',
  //'shouldComponentUpdate',
  'componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount',
  'getChildContext',
];

let staticProps = [
  'childContextTypes',
  'contextTypes',
  'defaultProps',
  'propTypes'
];

export function chainLifecycleExcept(...args) {
  let excepts = {};
  for (let arg of args) {
    excepts[arg] = true;
  }
  return function (target) {
    for (let method of lifecycleMethods) {
      if (excepts[method]) continue;
      if (!target.prototype.hasOwnProperty(method)) continue;
      let orig = target.prototype[method];
      target.prototype[method] = function () {
        let inherited = Object.getPrototypeOf(target.prototype)[method];
        if (inherited) var ret = inherited.apply(this, arguments);
        if (method === 'getChildContext') {
          return Object.assign(orig.apply(this, arguments), ret);
        } else {
          return orig.apply(this, arguments);
        }
      };
    }
    return target;
  };
}
export let chainLifecycle = chainLifecycleExcept();

export function mergeStaticExcept(...args) {
  let excepts = {};
  for (let arg of args) {
    excepts[arg] = true;
  }
  return function (target) {
    for (let prop of staticProps) {
      if (excepts[prop]) continue;
      if (!target.hasOwnProperty(prop)) continue;
      let inherited = Object.getPrototypeOf(target)[prop];
      if (inherited) Object.assign(target[prop], inherited);
    }
    return target;
  };
}
export let mergeStatic = mergeStaticExcept();

export function inheritReactClassExcept(...arg) {
  let decorators = [
    chainLifecycleExcept(...arg),
    mergeStaticExcept(...arg),
  ];
  return function (target) {
    for (let decorator of decorators) {
      target = decorator(target);
    }
    return target;
  };
}
let inheritReactClass = inheritReactClassExcept();
let reactInheritHelper = inheritReactClassExcept();

export default inheritReactClass;
