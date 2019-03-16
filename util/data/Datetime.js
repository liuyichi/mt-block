import _ from 'lodash-compat';
import strftime from 'strftime';

function format(timestamp, pattern='yyyy-mm-dd') {
  if (timestamp == null || timestamp === '' || !_.isFinite(+timestamp)) {
    return "";
  }

  var date = new Date();
  date.setTime(timestamp);

  // 检查format, 不满足则使用新语法(strftime)
  // 支持格式 yyyy-mm-dd, yyyy/mm/dd, yyyy-mm, yyyy/mm
  // hh:MM:ss, yyyy-mm-dd hh:MM:ss, yyyy/mm/dd hh:MM:ss
  if (!/^yyyy(-|\/)mm(\1dd( hh:MM:ss)?)?|hh:MM:ss$/.test(pattern)) {
    return strftime(pattern, date);
  }

  // 如果有 日期 信息
  if (pattern.search(/yyyy/) != -1) {
    var separator = pattern.charAt(4);
    var patterntedDate = date.getFullYear() + separator
      + _toTwoDigit(date.getMonth() + 1);

    // 如果有 日 信息
    if (pattern.search(/dd/) != -1) {
      patterntedDate += separator + _toTwoDigit(date.getDate());
    }

    // 如果包含时间信息
    if (pattern.search(/hh:MM:ss/) != -1) {
      patterntedDate += " " + _getTime(date);
    }

  } else { // 只有时间信息
    return _getTime(date);
  }

  return patterntedDate;
}

function parse(str, format) {
  // 检查format, 不满足则为默认值 yyyy-mm-dd
  // 支持格式 yyyy-mm-dd, yyyy/mm/dd, yyyy-mm, yyyy/mm
  // yyyy-mm-dd hh:MM:ss, yyyy/mm/dd hh:MM:ss
  if (!/^yyyy(-|\/)mm(\1dd( hh:MM:ss)?)?$/.test(format)) {
    format = "yyyy-mm-dd";
  }

  //要求str与format的格式一致
  var regExp = new RegExp("^" + format.replace(/\w/g, "\\d") + "$");
  if (!regExp.test(str)) {
    throw new Error(str + " 不符合 " + format);
  }

  var date = new Date(1970, 0, 2, 0, 0, 0);

  var separator = format.charAt(4);
  var datePart = str.split(separator);

  if (format.search(/hh:MM:ss/) != -1) {
    var fields = str.split(' ');
    datePart = fields[0].split(separator);
    var timePart = fields[1].split(':');

    date.setHours(Number(timePart[0]));
    date.setMinutes(Number(timePart[1]));
    date.setSeconds(Number(timePart[2]));
  }

  date.setFullYear(Number(datePart[0]));
  date.setMonth(Number(datePart[1]) - 1);
  date.setDate(1);

  // 如果有 日 信息
  if (format.search(/dd/) != -1) {
    date.setDate(Number(datePart[2]));
  }

  return date.getTime();
}

function _toTwoDigit(v) {
  return ('0' + v).slice(-2);
}

function _getTime(date) {
  return _toTwoDigit(date.getHours()) + ':' + _toTwoDigit(date.getMinutes())
    + ':' + _toTwoDigit(date.getSeconds());
}

export default { format, parse };
