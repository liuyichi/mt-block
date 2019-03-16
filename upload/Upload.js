import React, { Component, PropTypes, isValidElement } from 'react';
import M from '../util';
import _ from 'lodash-compat';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import { Button, Toaster, Dialog } from '../index';
import LOCALE from './locale/zh_CN';
import { upload, filterFiles, isFileUploadable, isDuplicated } from './Helper';
import { IconPrefixCls, noop, isFunction, isEmptyString, isString } from '../util/data';

const MODEL = {
  idField: "id",           // 主键
  nameField: "name",       // 名称
  urlField: "url",         // 链接
  timeField: "attachTs",   // 上传时间
  oprField: "owner",       // 上传人
};

export default class Upload extends Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    mode: PropTypes.oneOf(['view', 'default']),
    multiple: PropTypes.bool,
    droppable: PropTypes.bool,
    value: PropTypes.array,
    defaultValue: PropTypes.array,
    locale: PropTypes.shape({
      desc: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      uploading: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      uploadSucceed: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      uploadFailed: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      delete: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      overMaxSize: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      wrongType: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      unknownDocumentType: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      unknownImgType: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      unknowArchiveType: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      wrongExtType: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      duplicated: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    }),
    model: PropTypes.shape({
      idField: PropTypes.string,
      nameField: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
      urlField: PropTypes.string,
      timeField: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
      oprField: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    }),
    size: PropTypes.oneOf(['small', 'default']),
    async: PropTypes.bool,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    validation: PropTypes.string,
    validator: PropTypes.func,
    fileType: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.array]),
    fileMaxSize: PropTypes.number,
    uploadParams: PropTypes.object,
    headersConf: PropTypes.object,
    errToast: PropTypes.bool,
    useFormData: PropTypes.bool,
    durationIfSucceed: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    emptyLabel: PropTypes.string,
    onUpload: PropTypes.func,
    onBeforeUploadAll: PropTypes.func,
    onBeforeUpload: PropTypes.func,
    onError: PropTypes.func,
    onSuccess: PropTypes.func,
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
    domProps: PropTypes.object,
  };
  static defaultProps = {
    prefixCls: 'mt',         // 样式前缀
    mode: 'default',         // 控件的状态
    multiple: true,          // 是否支持多文件
    droppable: false,        // 是否支持拖拽上传
    value: [],          // 初始显示的内容
    locale: {},
    model: {},               // 数据配置对象
    size: 'default',         // 控件的大小
    async: true,             // 是否支持异步上传
    disabled: false,         // 是否禁用
    required: false,         // 是否必填
    validation: '',         // 校验失败时的提示
    validator: noop,         // 自定义校验
    fileType: null,          // 支持的文件类型, 可选值为 `document` `image` `archive` `.ext1.ext2` 或传入方法
    fileMaxSize: Infinity,   // 支持的最大文件大小, 单位为字节
    uploadParams: {},   // 会被原样传给 onUpload 的参数
    headersConf: {},    // 设置请求头
    errorToast: false,    // 设置是否上传失败后立即弹窗报错而非抛出错误
    useFormData: true,    // 是否使用 formData 来封装交互时上传的参数
    durationIfSucceed: 500,                // 上传成功的文字显示的时间
    emptyLabel: '',         // 只读时无值情况下显示的文本
    onUpload: upload.bind(null,null),  // 与服务端交互的函数, bind的第二个参数是上传路径
    onBeforeUploadAll: noop,  // 选择文件上传前的校验 返回false则终止上传
    onBeforeUpload: noop,  // 上传单个文件前的校验 返回false则终止上传
    onError: noop,             // 上传失败的回调
    onSuccess: noop,           // 上传成功的回调
    onChange: noop,            // 当值改变时触发的函数(包括删除/上传成功)
    onDelete: () => true,            // 删除时触发的函数
    domProps: {},           // 传递给 input 原生的属性
  };
  constructor(props) {
    super(props);
    this.state = {
      files: _.cloneDeep(props.value) || [],
      valid: true,
      model: Object.assign({}, MODEL, props.model || {}),
      locale: Object.assign({}, LOCALE, props.locale || {}),
    }
  }

  componentDidMount() {
    let { disabled, mode, defaultValue, droppable } = this.props;
    if (this.state.files.length === 0 && !_.isEmpty(defaultValue)) {
      this.setState({files: _.cloneDeep(defaultValue) || []});
    }
    if (!disabled && mode !== 'view' && droppable) {
      // 实现拖拽至 dropzone 上方时的显示效果
      var $dropzone = findDOMNode(this.refs.dropzone);

      // 需要避免被拖拽进入子元素时触发的 dragleave 干扰
      var first = false;
      var second = false;
      $dropzone.addEventListener('dragenter', function (e) {
        e.preventDefault(); // 阻止 dragover 否则 drop 不会触发
        e.stopPropagation();
        if (first) {
          second = true;
        } else {
          first = true;
          $dropzone.classList.add('dragover');
        }
      }, false);
      $dropzone.addEventListener('dragleave', function () {
        if (second) {
          second = false;
        } else if (first) {
          first = false;
        }
        if (!first && !second) {
          $dropzone.classList.remove('dragover');
        }
      }, false);

      $dropzone.addEventListener('dragover', function (e) {
        e.preventDefault(); // 阻止 dragover 否则 drop 不会触发
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
      }, false);

      $dropzone.addEventListener('drop', function (e) {
        e.preventDefault();
        // 不要 stopPropagation，否则处理文件添加的监听函数无法被触发
        first = false;
        second = false;
        $dropzone.classList.remove('dragover');
      }, false);
    }
    // 用代码点击 input[type=file] 需要在一个非模拟的点击事件中才有效
    // 拦截触摸事件避免上传区域被 fastclick 等库处理
    let $inputArea = this.refs.inputArea || this.refs.dropzone;
    $inputArea && $inputArea.addEventListener('touchstart', e => e.stopPropagation());
  }

  componentWillReceiveProps(nextProps) {
    let { files, model, locale } = this.state;
    if (files.length === 0 && !_.isEmpty(nextProps.value)) {
      files = _.cloneDeep(nextProps.value) || [];
    }
    if ('model' in nextProps) {
      model = Object.assign({}, MODEL, nextProps.model || {});
    }
    if ('locale' in nextProps) {
      locale = Object.assign({}, LOCALE, nextProps.locale || {});
    }
    this.setState({model, files, locale});
  }

  componentWillUnmount() {
    for (let item in this.timeout) {
      clearTimeout(this.timeout[item]);
    }
  }
  /**
   * 上传文件
   * @param files 需要上传的文件
   * @private
   */
  _uploadHandle = (files) => {
    let { onUpload, uploadParams, headersConf, async: _async, disabeld, domProps, useFormData, multiple, errToast } = this.props;
    _async = true; // TODO 同步上传
    if (disabeld || !files || files.length === 0) {
      return;
    }
    let { model } = this.state;
    // 需要上传的文件
    var filter = files.filter(file => isFileUploadable(file)).map(v => {
      var file = {
        _pkCode_: _.uniqueId(),
        size: v.size,
        source: v,
      };
      file[model.nameField] = v.name;
      return file;
    });
    if (_async) { // 异步上传
      filter.map(v => {
        v.uploading = true;
        return v;
      });
      this.setState({files: multiple ? this.state.files.concat(filter) : filter}, () => {
        filter.forEach(file => {
          var index = this.state.files.findIndex(v => v._pkCode_ === file._pkCode_);
          onUpload(file.source, uploadParams, {headers: headersConf, name: domProps.name, useFormData, errToast }).then(this._successHandle.bind(this, index), this._errorHandle.bind(this, index));
        });
      });
    } else {
    }
  };

  /**
   * 上传成功响应事件
   * @param index 文件在files集合里的索引
   * @param res 成功信息 包括主键,下载链接,上传时间,上传人等.
   */
  _successHandle = (index, res) => {
    let { onSuccess, durationIfSucceed } = this.props;
    let { files } = this.state;
    Object.assign(files[index], res, {
      uploading: false,
      succeed: true,
    });
    this.forceUpdate();
    onSuccess(files[index], res);
    this._triggerChangeHandle();
    !this.timeout && (this.timeout = {});
    this.timeout[index] = setTimeout(()=>{
      Object.assign(this.state.files[index], { // 之后再去掉上传成功的显示
        succeed: null
      });
      this.forceUpdate();
    }, durationIfSucceed);
    this.validate();
  };

  /**
   * 上传失败响应事件
   * @param index 文件在files集合里的索引
   * @param res 失败信息
   */
  _errorHandle = (index, res) => {
    let { onError } = this.props;
    let { files } = this.state;
    Object.assign(files[index], {
      uploading: false,
      failed: true,
    });
    this.forceUpdate();
    onError(files[index], res);
    this.validate();
    //Toaster.show({
    //  type: "error",
    //  title: (res && res.message) || "上传失败"
    //});
  };

  /**
   * 追加新选择的文件
   * @param newFiles 追加的文件
   */
  _appendFilesHandle = async (newFiles) => {
    const { disabled, multiple, onBeforeUploadAll } = this.props;
    const { locale } = this.state;
    if (disabled) {
      return;
    }
    let props = {...this.props};
    newFiles = Array.from(newFiles);
    if (newFiles && newFiles.length > 0) {
      if (!multiple) {
        newFiles = [newFiles[0]];
      }
      let res = await onBeforeUploadAll(newFiles);
      if (res === false || (res && isString(res))) { // 如果返回的是 false 或一个字符串,则报错; 返回 true 则继续走下面的验证逻辑
        Toaster.error(res || "文件大小或类型不符合");
        return;
      }
      let filter = [];
      for (let file of newFiles) {
        if (isDuplicated(file, this.state.files)) {
          if (await Dialog.confirm({
              title: '文件重复',
              content: M.template(locale.duplicated, file)
          })) {
            filter.push(file);
          }
        } else {
          var explain = filterFiles(file, Object.assign({}, props, {locale: this.state.locale}));
          if (!_.isEmpty(explain)) {
            Toaster.error(explain);
          } else {
            filter.push(file);
          }
        }
      };
      this._uploadHandle(filter);
    }
  };

  /**
   * 文件被选中后
   */
  _changeHandle = async (e) => {
    var files = findDOMNode(this.refs.fileinput).files;
    files && await this._appendFilesHandle(files);
  };

  /**
   * 响应点击上传文件按钮
   */
  _clickHandle = (e) => {
    findDOMNode(this.refs.fileinput).click();
  };

  /**
   * 删除某个文件
   * @param file 删除的文件
   */
  _removeHandle = async (file, e) => {
    e.preventDefault();
    let res = await this.props.onDelete(file);
    if (res) {
      var files = this.state.files;
      var index = files.indexOf(file);
      files.splice(index, 1);
      this.forceUpdate();
      this._triggerChangeHandle();
      this.validate();
    }
  };

  /**
   * 触发数据变更的回调函数 筛选所有有url的条目
   */
  _triggerChangeHandle = () => {
    this.props.onChange(this.getAllFiles());
  };

  /**
   * 监听拖拽过来的文件
   */
  _dropHandle = async (e) => {
    if (e.dataTransfer.files) {
      await this._appendFilesHandle(e.dataTransfer.files);
    }
  };

  // 渲染文件列表
  renderFileList = () => {
    let { prefixCls, disabled, mode } = this.props;
    let { model, locale, files } = this.state;
    prefixCls += '-upload';
    return (
      <ul className={prefixCls + '-items'}>
        {(files || []).map((file, index) => {
          let _prefixCls = prefixCls + '-item';
          // TODO 如果failed 去支持重新上传
          let { error, uploading, succeed, failed, [model.urlField]: urlField } = file;
          let timeField = isFunction(model.timeField) ? model.timeField(file) : M.formatDatetime(file[model.timeField]);
          let oprField = isFunction(model.oprField) ? model.oprField(file) : file[model.oprField];
          let nameField = isFunction(model.nameField) ? model.nameField(file) : file[model.nameField];
          return (
            <li className={`${_prefixCls}` + (error ? ` ${_prefixCls}-error` : '')} key={index}>
              <a href={urlField} target="_blank">
                <div className={`${_prefixCls}-right`}>
                  {uploading && <span className={`${_prefixCls}-status ${_prefixCls}-status-loading`}>{locale.uploading}</span>}
                  {succeed && <span className={`${_prefixCls}-status ${_prefixCls}-status-success`}>
                    <i className={`${IconPrefixCls} ${IconPrefixCls}-check`}></i>
                    {locale.uploadSucceed}
                  </span>}
                  {failed && <span className={`${_prefixCls}-status ${_prefixCls}-status-failed`}>
                    <i className={`${IconPrefixCls} ${IconPrefixCls}-cross`}></i>
                    {locale.uploadFailed}
                  </span>}
                  <span className={`${_prefixCls}-owner`} title={isValidElement(oprField) ? '' : oprField}>{oprField}</span>
                  <span className={`${_prefixCls}-time`}>{timeField}</span>
                  {mode !== "view" && !disabled && !file.readonly && <i className={`${_prefixCls}-remove ${IconPrefixCls} ${IconPrefixCls}-cross`}
                                                     title={locale.delete}
                                                     onClick={this._removeHandle.bind(this, file)}></i>}
                </div>
                <div className={`${_prefixCls}-name`} title={isValidElement(nameField) ? '' : nameField}>{nameField}</div>
              </a>
            </li>
          )
        })}
      </ul>
    )
  };
  // 渲染拖拽区域
  renderDragInput = () => {
    let { prefixCls, disabled, multiple, domProps } = this.props;
    let { locale } = this.state;
    prefixCls += '-upload-dropzone';
    const outerCls = classNames({
      [prefixCls]: true,
      [`${prefixCls}-disabled`]: disabled,
    });
    return (
      <div ref="dropzone" className={outerCls} onDrop={!disabled && this._dropHandle} onClick={!disabled && this._clickHandle}>
        <input {...domProps} value="" type="file" ref="fileinput" className="hidden" multiple={multiple} onChange={this._changeHandle}/>
        <i className={`${prefixCls}-append ${IconPrefixCls} ${IconPrefixCls}-plus`}></i>
        <div className={`${prefixCls}-title`}>
          {locale.desc}
        </div>
      </div>
    )
  };
  // 渲染非拖拽上传区域
  renderFileInput = () => {
    let { prefixCls, multiple, disabled, size } = this.props;
    let { locale } = this.state;
    prefixCls += '-upload-append';
    const outerCls = classNames({
      [prefixCls]: true,
      [`${prefixCls}-disabled`]: disabled,
    });
    return (
      <div ref="inputArea" className={outerCls} onClick={!disabled && this._clickHandle}>
        <span className={`${prefixCls}-desc`/*  */}>{locale.desc}</span>
        <Button className={`${prefixCls}-btn`} disabled={disabled} size={size}>
          <input value="" type="file" ref="fileinput" className="hidden" multiple={multiple} onChange={this._changeHandle} onClick={e => e.stopPropagation()}/>
          {locale.label}
        </Button>
      </div>
    )
  };
  render() {
    const props = this.props;
    let { prefixCls, mode, size, disabled, droppable, className, emptyLabel } = props;
    let { valid, files, explain } = this.state;
    prefixCls += '-upload';
    if (mode === 'view') {
      const hasData = (files || []).length > 0;
      const wrapperCls = classNames({
        [`${prefixCls}`]: true,
        [`${prefixCls}-view`]: true,
        [`${prefixCls}-sm`]: size === 'small',
        [className]: className,
        'has-error': !valid
      });
      return (
        <div className={wrapperCls}>
          {hasData ? this.renderFileList() : emptyLabel}
        </div>
      )
    }
    const wrapperCls = classNames({
      [`${prefixCls}`]: true,
      [`${prefixCls}-sm`]: size === 'small',
      [`${prefixCls}-disbaled`]: disabled,
      [className]: className,
      'has-error': !valid,
    });
    return (
      <div className={wrapperCls}>
        {this.renderFileList()}
        {droppable ? this.renderDragInput() : this.renderFileInput()}
        {!valid && <span className={`has-explain ${prefixCls}-explain`}>{explain}</span>}
      </div>
    )
  }

  /**
   * 校验有效性
   */
  validate = () => {
    const { mode, required, validation, validator } = this.props;
    if (mode === 'view') {
      !this.state.valid && this.setState({valid: true});
      return true;
    }
    var flag = true, files = this.state.files, explain = '';

    // 非空校验, 必须上传一条, 或者每一条都失败了
    if (required && ((files || []).length === 0 || files.every(v => v.failed))) {
      explain = validation || '';
      flag = false;
    }
    // 自定义校验
    if (validator) {
      //自定义校验
      if (isFunction(validator)) {
        explain = validator(files);
      }
      //返回字符串 不为空表示校验没通过 且返回错误提示
      if (!isEmptyString(explain)) {
        flag = false;
      } else {
        explain = '';
      }
    }
    this.state.explain = explain;
    this.state.valid = flag;
    this.forceUpdate();
    return flag;
  };

  /**
   * 重置控件，清空数据并清空校验状态
   */
  reset = () => {
    if (this.props.mode !== "view") {
      let resetValue =  _.cloneDeep(this.props.defaultValue) || [];
      this.setState({files: resetValue, valid: true, explain: ""}, () => {
        this.props.onChange(resetValue);
      });
    }
  };

  /**
   * 清空异常状态，校验提示等
   */
  clear = () => {
    this.setState({valid: true, explain: ""});
  };

  /**
   * 获取当前所有已上传成功的有效的文件
   * @returns {Array}
   */
  getAllFiles = () => {
    const { model, files } = this.state;
    let keys = Object.values(model) || [];
    return (files || []).filter(v => v[model.urlField]).map(v => {
      var file = {};
      keys.forEach(key => file[key] = v[key]);
      if ('readonly' in v) {
        file.readonly = v.readonly;
      }
      return file;
    });
  };
};
