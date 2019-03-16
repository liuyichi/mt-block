import React from "react";
import U from '../util';
import Button from '../button/Button';

class UploadButton extends U.BaseComponent {
  static propTypes = Object.assign({
    multiple: React.PropTypes.bool,
    onUpload: React.PropTypes.func.isRequired,
  }, Button.propType);
  static defaultProps = {
    prefixCls: 'mt',
    multiple: false,
  };
  constructor(props) {
    super(props);
    Object.assign(this.state, {
      items: [],
    });
  }
  componentDidMount() {
    // 避免 this.handleClick 因为冒泡被触发多次
    this.refs.input.addEventListener('click', e => e.stopImmediatePropagation(), true);
  }
  render() {
    let { label, children, accept, multiple, ...props } = this.props;
    let prefixCls = this.props.prefixCls + '-upload-button';
    return (
      <Button
        {...props}
        className={this.classNames(prefixCls)}
        onClick={this.handleClick}
      >
        <input
          ref="input"
          type="file"
          hidden
          accept={accept}
          multiple={multiple}
          onChange={this.handleChange}
        />
        {label || children}
      </Button>
    );
  }
  handleClick() {
    let { input } = this.refs;
    input.value = "";
    input.click();
  }
  handleChange(e) {
    this.props.onUpload(e.target.files);
  }
}

export default UploadButton;
