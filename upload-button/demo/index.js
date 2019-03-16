import React, { Component } from 'react';
import UploadButton from '../UploadButton';
import '../style';
import './index.scss';

class Demo extends Component {
  render() {
    return (
      <div className="upload-button-demo">
        <UploadButton
          type="primary"
          label="upload"
          multiple={true}
          onUpload={this.handleUpload}
        />
      </div>
    );
  }
  handleUpload(files) {
    console.log(files);
  }
}

export default <Demo/>
