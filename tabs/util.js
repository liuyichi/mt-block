export const PADDING = {
  default: 28,
  large: 36,
  small: 24,
}; // 左右箭头所占宽度
export const MODEL = { // 默认的配置
  idField: "code",
  showField: "label",
  iconField: "icon",
  deleteIconField: "deleteIcon",
  disableField: "disabled",
  contentField: "content",
};
const POSITIONMAP = {
  "horizontal": {
    "prev": "left", "next": "right",
    "offsetLeft": "offsetLeft", "offsetWidth": "offsetWidth", "width": "width", "scrollWidth": "scrollWidth"
  },
  "vertical": {"prev": "up", "next": "down",
    "offsetLeft": "offsetTop", "offsetWidth": "offsetHeight", "width": "height", "scrollWidth": "scrollHeight"
  },
};
export const getPositionMap = (position = "top") => {
  return POSITIONMAP[isVertical(position) ? 'vertical' : 'horizontal'];
};

/**
 * 如果是要向右滚动, 需要判断是否已经到最后一个tab边界了
 * @param width 传入想要向右滚动的距离
 * @private invisibleRight Tabs 右侧被挡住的内容宽度
 */
export const getScrollRight = (scrollPage, width = 0) => {
  if (!scrollPage) return;
  let { pageWidth = 0, translate = 0, totalWidth = 0, padding } = scrollPage;
  let invisibleRight = totalWidth - padding + translate - pageWidth;
  return translate - Math.min(width, invisibleRight);
};
/**
 * 如果是要向左滚动, 需要判断是否已经到第一个tab边界了
 * @param width 传入想要向左滚动的距离
 */
export const getScrollLeft = (scrollPage, width = 0) => {
  let { translate = 0 } = scrollPage;
  return translate + Math.min(-translate, width);
};

/**
 * 获取组件的内联样式 - 宽高
 */
export const getSizeValue = (value) => {
  return isNaN(value) ? value : value + 'px';
};

// 判断是否有上一页
export const hasPrev = (scrollPage) => {
  let { translate = 0 } = scrollPage;
  return translate < 0;
};
// 判断是否有下一页
export const hasNext = (scrollPage) => {
  let { translate = 0, totalWidth = 0, pageWidth = 0, padding } = scrollPage;
  return -translate + pageWidth < totalWidth - padding;
};
// 判断是否是竖向
export const isVertical = (position) => {
  return position !== 'top' && position !== 'bottom';
};
// 判断tabs排在后面
export const isTabsRight = (position) => {
  return position !== 'top' && position !== 'left';
};