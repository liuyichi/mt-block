import React from 'react';
import { Icon } from '../icon';

export const buildIcon = (icon = '') => {
  return icon ? /http(s)?:\/\/.*/.test(icon) ? <img src={icon} /> : <Icon type={icon} /> : ''
};