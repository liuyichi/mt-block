/*
 * based on https://github.com/angus-c/es6-react-mixins/blob/master/src/mixin.js
 */

import reactExtras from './reactExtras'

const REACT_PROPS = [
  'childContextTypes',
  'contextTypes',
  'defaultProps',
  'propTypes'
];
const REACT_LIFECYCLES = [
  'componentWillMount',
  'componentDidMount',
  'componentWillReceiveProps',
  'componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount',
  'render'
];

const es6ify = (mixin) => {
  if (typeof mixin === 'function') {
    // mixin is already es6 style
    return mixin;
  }
  return (Base) => {
    // mixin is old-react style plain object
    // convert to ES6 class
    class NewClass extends Base {}

    const clonedMixin = Object.assign({}, mixin);
    // move React props to NewClass's constructor
    upgradeReactProps(NewClass, clonedMixin);
    // merge React props defined as ES7 class static properties
    // mergeStaticProps(NewClass, clonedMixin);
    Object.assign(NewClass.prototype, clonedMixin);

    return reactExtras(NewClass);
  };
};

function mixin (...mixins) {
  return mixins.reduceRight((Klass, mixin) => es6ify(mixin)(Klass), this);
}

function upgradeReactProps(klass, mixin) {
  const staticProps = REACT_PROPS.reduce((result, prop) => {
    if (mixin[prop]) {
      klass[prop] = mixin[prop];
      delete mixin[prop];
    }
    return result;
  }, {});
  return klass;
}

function mergeStaticProps(klass, clonedMixin) {
  const superKlass = Object.getPrototypeOf(klass);
  const mixin = clonedMixin || superKlass;
  Object.keys(mixin).forEach(m => {
    if (typeof m !== 'function') {
      klass[m] = Object.assign(klass[m] || {}, mixin[m]);
    }
  });

  return klass;
}

export { mergeStaticProps };
export default mixin;
