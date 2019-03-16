import React from 'react';
import { Trigger } from '../';
import Doc from '../../util/doc';
import api from '../api';
import './index.scss';

let conf = {
	"code": "trigger",
	"sub": {
		"title": "Trigger",
		"desc": "弹出容器"
	},
	"stage": {
		"title": "使用场景",
		"desc": "需要有弹出容器做进一步问题说明"
	},
	demos: [
		{
			"code":"basic",
		    "title":"基本用法",
		    "desc":(
			  <div>
				 <p>通过配置来定义弹出容器的各个方向: 指定点分为 't'(top), 'b'(bottom), 'c'(center), 'l'(left), 'r'(right)</p>
				 <p>points[0] (type:String[2]): 是source弹层焦点的指定，如：['t','l']指定为source区域的左上角。</p>
				 <p>points[1] (type:String[2]): 对齐到target区域焦点的指定，如：['b','r']指定为target区域右下角。</p>
				 <p>offset (type:Number[2]): 相对于source源节点的偏移量,offset[0]为X轴方向位移，offset[1]为Y轴方向位移，偏移往右下走。 </p>
				 <p>targetOffset (type:Number[2]): 相对于target源节点的偏移量(注意: 移动的还是弹出框),offset[0]为X轴方向位移，offset[1]为Y轴方向位移，偏移往左上走。 </p>
				 <p>overflow (type:Object): 接收两个属性值:adjustX,adjustY; 如果adjustX设置为 1 或者 true时弹窗会根据当前浏览器的显示情况调整弹层X轴方向的显示位置，使窗口始终显示在当期的可视区域。adjustY同理为Y轴方向。 </p>
				 <p>useCssBottom (type:Boolean): css 是否使用 bottom 替代 top 来定位。默认为false</p>
				 <p>useCssRight (type:Boolean): css 是否使用 right 替代 left 来定位。默认为false</p>
				 <p>useCssTransform (type:Boolean): 如果浏览器支持，是否使用 CSS 的 transform，替代 left/top/right/bottom 来定位。默认为false</p>
			  </div>
		    ),
		    'element':require('./basic').default,
		    "link":"basic.js"
		},
		{
			"code":"tooltip",
		    "title":"tooltip示例",
		    "desc":(
				<div>
					<p>设置visible属性,鼠标移入图标时,显示相应提示</p>
					<p>通过onAfterVisible传入当前 visible 改变时的事件</p>
			  </div>
			  ),
			'element':require('./tooltip').default,
			"link":"tooltip.js"
		},
		{
			"code":"date",
      		"title":"日期弹出框示例",
			"desc":(
				<div></div>
			),
			'element':require('./date').default,
			"link":"date.js"
		},
		{
			"code":"select",
      		"title":"下拉框示例",
			"desc":(
				<div>
					<p>设置overflow的adjustX和adjustY属性为true,让弹框可以调整它的显示位置</p>
				</div>
			),
			'element':require('./select').default,
			"link":"select.js"
		},
		{
			"code":"confirm",
      		"title":"删除确认框、全屏弹框示例",
			"desc":(
				<div></div>
			),
			'element':require('./confirm').default,
			"link":"confirm.js"
		}
	],
	api: api
};

export default <Doc className="block-trigger-demo" {...conf}/>;

