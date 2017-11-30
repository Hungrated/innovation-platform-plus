function date (time, school_id) {
  let curTime = undefined;
  if (time && typeof time === 'string')
    curTime = new Date(time);
  else
    curTime = (time) ? time : new Date();

  let convert = function (digit) {
    if (digit < 10) return '0' + digit;
    else return digit.toString();
  };

  let year = curTime.getFullYear();
  let month = convert(curTime.getMonth() + 1);
  let day = convert(curTime.getDate());
  let hour = convert(curTime.getHours());
  let minute = convert(curTime.getMinutes());
  let second = convert(curTime.getSeconds());

  if (school_id)
    return ((year % 100) + month + day + hour + minute + second).toString() + school_id;
  else
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}

module.exports = date;
