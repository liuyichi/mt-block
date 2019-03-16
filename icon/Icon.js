import React from 'react';
import U from '../util';
import './style';

class Icon extends U.BaseComponent {
  static defaultProps = {
    prefixCls: 'mt',
  };
  render() {
    const { type, domProps={} } = this.props;
    let prefixCls = `${this.props.prefixCls}-icon`;
    return (
      <i
        {...domProps}
        className={this.classNames(prefixCls, 'block-icon', `block-icon-${type}`)}
      />
    );
  }

}

Icon.question = <Icon className="mt-icon_preset-question" type="question-circle" />;
Icon.info = <Icon className="mt-icon_preset-info" type="info-circle" />;
Icon.success = <Icon className="mt-icon_preset-success" type="check-circle" />;
Icon.warning = <Icon className="mt-icon_preset-warning" type="exclamation-triangle" />;
Icon.error = <Icon className="mt-icon_preset-error" type="minus-circle" />;
Icon.close = <Icon className="mt-icon_preset-close" type="cross" />;
Icon.heart = <Icon className="mt-icon_preset-warning" type="heart"/>;
Icon.heartOlike = <Icon className="mt-icon_preset-warning" type="heart-olike"/>;

export default Icon;
