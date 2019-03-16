/**
 * block 用到的公共方法
 */

import classNames from 'classnames';
import { default as BaseComponent } from './react/BaseComponent';
import { default as mergeModel } from './data/mergeModel';
import { default as template } from './data/template';
import { default as HashPrefix } from './dom/HashPrefix';
import { default as reactExtras } from './react/reactExtras';
import { default as ContextMixin } from './react/ContextMixin';
import { default as FormatMixin } from './react/FormatMixin';
import { default as toObject } from './data/toObject';
import { default as toPairs } from './data/toPairs';
import { default as promisify } from './func/promisify';
import { default as Datetime } from './data/Datetime';
import { default as delayAsync } from './dom/delayAsync';

export default {
    classNames,
    formatDatetime: Datetime.format,
    parseDatetime: Datetime.parse,
    BaseComponent,
    mergeModel,
    toObject,
    toPairs,
    template,
    HashPrefix,
    reactExtras,
    ContextMixin,
    FormatMixin,
    promisify,
    delayAsync
}
