import { isEmptyString } from '../../util/data';
/**
 * 给数字加上千分号,并支持精确到小数点后几位
 * @param num
 * @param toFixed
 * @returns {*}
 */
export const numberToEn = (num = 0, toFixed)=>{
  var num = "" + num,
    string = num.split("."),
    integer = string[0],
    decimal = (string[1] ? +("." + string[1]) : 0),
    result = "";
  decimal = (isEmptyString(toFixed) ? '' + decimal : decimal.toFixed(toFixed)).slice(1);
  while (integer.length > 3) {
    if ((+integer).toLocaleString() !== integer) {
      return (+integer).toLocaleString() + decimal;
    }
    result = ',' + integer.slice(-3) + result;
    integer = integer.slice(0, integer.length - 3);
  }
  if (integer) {
    result = integer + result + decimal;
  }
  return result;
};