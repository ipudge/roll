/**
 * Created by 35781 on 2016/12/16.
 */

exports.fmtDate = function (time) {
  var today = new Date();
  var date = time ? new Date(time) : today;
  var year = date.getFullYear();
  var month = prefixZero(date.getMonth() + 1);
  var day = prefixZero(date.getDate());
  var hour = prefixZero(date.getHours());
  var minute = prefixZero(date.getMinutes());
  var seconds = prefixZero(date.getSeconds());
  var theDay = year + '-' + month + '-' + day;
  var theTime = hour + ':' + minute + ':' + seconds;
  return [theDay, theTime].join(' ');
};

function prefixZero (s) {
  s = s < 10 ? '0' + s : s;
  return s;
}
