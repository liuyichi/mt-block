import React, { Component } from 'react';
import Icon from '../index';
import Model from '../font/selection.json';
import './index.scss';

class Demo extends Component {
  render() {
    return <ul className="icon-demo">
      {Model.icons.map(icon => icon.properties.name).map(icon => {
        icon = icon.split(',')[0];
        return <li key={icon}>
          <Icon type={icon} />
          <span>{icon}</span>
        </li>
      })}
    </ul>
  }
}

export default <Demo />