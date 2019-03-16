import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { findDOMNode } from 'react-dom';
// TODO  ICON 引入
import Icon from '../icon';

export default class Progress extends Component {
  static propTypes = {
    type:PropTypes.oneOf(['line', 'circle']),
    percent: PropTypes.number,
    showInfo: PropTypes.bool,
    status:PropTypes.string,
    format:PropTypes.func,
    width:PropTypes.number,
    className: PropTypes.string,
  };
  static defaultProps = {
    type:'line',       //设置进度条类型，可选值为 success|exception|active 默认设置为line
    percent: 0,
    width:132,      // circle时为132
    showInfo: true,
    status:'',
    className: '',
    format:percent => percent+'%',
    prefixCls: 'mt-progress',
  };
  constructor(props){
    super(props);
    this.state = {
      //loading: props.loading || false
    };
  }

  componentWillUnmount() {
    //// 卸载后将延时器清掉
    //if (this.clickedTimeout) {
    //  clearTimeout(this.clickedTimeout);
    //}
    //if (this.timeout) {
    //  clearTimeout(this.timeout);
    //}
  }


  render() {
    let {  type, className, percent,status,format,showInfo,strokeWidth,style,width, ...others} = this.props;
    const prefixCls = this.props.prefixCls;

    if(!strokeWidth){              //strokeWidth的值 line时默认为10   circle为6
      if(type=="line"){
        strokeWidth=10;
      }else{
        strokeWidth=6;
      }
    }
    strokeWidth=type=="line"?strokeWidth/10:strokeWidth;



   // lineProgress
    const center = strokeWidth / 2;
    const right = (100 - strokeWidth / 2);
    const linePathString = `M ${center},${center} L ${right},${center}`;
    const viewBoxString = `0 0 100 ${strokeWidth}`;
    const linePathStyle = {
      strokeDasharray: '100px, 100px',
      strokeDashoffset: `${(100 - percent)}px`,
      transition: 'stroke-dashoffset 0.6s ease 0s,stroke 0.6s ease',
    };

    //circleProgress
    const radius = (50 - strokeWidth/2 );  //radius 圆的半径长
    const circlePathString = `M 50,50 m 0,-${radius}
     a ${radius},${radius} 0 1 1 0,${2 * radius}
     a ${radius},${radius} 0 1 1 0,-${2 * radius}`;
    const len = Math.PI * 2 * radius;
    const circlePathStyle = {
      strokeDasharray: `${len}px ${len}px`,
      strokeDashoffset: `${((100 - percent) / 100 * len)}px`,
      transition: 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease',
    };

    const strokeColorCls = classNames({
      [`${prefixCls}-stroke-default`]: percent!==100&&status!=='exception',
      [`${prefixCls}-stroke-seccess`]: percent==100,
      [`${prefixCls}-stroke-error`]: status=='exception',
      //className]: !!className,

    });


    var checkIcon=type=="line"?<Icon type="check-circle" />:
                               <Icon  type="check" style={{'fontSize':width/4+'px'}} />;

    var closeIcon=type=="line"?<Icon type="cross-circle"  />:
                               <Icon  type="cross" style={{'fontSize':width/4+'px'}}  />;


    var progressText=type=="line"?<span>{format(percent)}</span>:
                                  <span  style={{'fontSize':width/4+'px'}}>{format(percent)}</span>;


        if(type=='line'){
          return(
              <div className={`${prefixCls}-line  ${className}`}>
                <svg
                    viewBox={viewBoxString}
                    preserveAspectRatio="none"
                    style={style}
                    {...others}
                >
                  <path
                      className={`${prefixCls}-trail`}
                      d={linePathString}
                      strokeLinecap='round'
                      strokeWidth={ strokeWidth/2}
                      fillOpacity="0"
                  />
                  <path
                      className={`${prefixCls}-line-path ${strokeColorCls}`}
                      d={linePathString}
                      strokeLinecap='round'
                      strokeWidth={strokeWidth/2}
                      fillOpacity="0"
                      style={linePathStyle}
                  />
                </svg>
                  <span className={`${prefixCls}-line-text`}>
                  {showInfo?(percent==100?<span className={`${prefixCls}-checkIcon`}>{checkIcon}</span>:(status==='exception'?<span className={`${prefixCls}-closeIcon`}>{closeIcon}</span>:progressText)):null}
                </span>
              </div>
              )
        }else{
          return (
              <div style={{"width":width+'px'}} className={`${prefixCls}-circle-box ${prefixCls}-circle ${className}`}>
                <svg
                    viewBox="0 0 100 100"
                    style={style}
                    {...others}
                >
                  <path
                      className={`${prefixCls}-trail`}
                      d={circlePathString}
                      strokeWidth={strokeWidth/2}
                      fillOpacity="0"
                  />
                  <path
                      className={`${prefixCls}-circle-path ${strokeColorCls}`}
                      d={circlePathString}
                      strokeLinecap='round'
                      strokeWidth={strokeWidth/2}
                      fillOpacity="0"
                      style={circlePathStyle}
                  />
                </svg>
                <span className={`${prefixCls}-circle-text`}>
                  {showInfo?(percent==100?<span className={`${prefixCls}-checkIcon`}>{checkIcon}</span>:(status==='exception'?<span className={`${prefixCls}-closeIcon`}>{closeIcon}</span>:progressText)):null}
                </span>
              </div>
          )
        }
  }
};
