export function timestampToTime(timestamp) {
  let date = new Date(timestamp) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '年'
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月'
  let D = date.getDate() + '日'
  return Y + M + D
}

export function timestampToDay(timestamp) {
  let date = new Date(timestamp) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  // let Y = date.getFullYear() + '年'
  // let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月'
  let D = date.getDate()
  return D
}
/** 数字金额大写转换(可以处理整数,小数,负数) */
// export function smalltoBIG(n) {
//   let fraction = ['角', '分'];
//   let digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
//   let unit = [
//     ['元', '万', '亿'],
//     ['', '拾', '佰', '仟']
//   ];
//   let head = n < 0 ? '欠' : '';
//   n = Math.abs(n);
//   let s = '';
//   for (let i = 0; i < fraction.length; i++) {
//     s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
//   }
//   s = s || '整';
//   n = Math.floor(n);
//   for (let i = 0; i < unit[0].length && n > 0; i++) {
//     let p = '';
//     for (let j = 0; j < unit[1].length && n > 0; j++) {
//       p = digit[n % 10] + unit[1][j] + p;
//       n = Math.floor(n / 10);
//     }
//     s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
//   }
//   return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
// }

export function getUrlPrmt(url) {
  let curUrl = url || window.location.href;
  let _pa = curUrl.substring(curUrl.indexOf('?') + 1),
    _arrS = _pa.split('&'),
    _rs = {};
  for (let i = 0, _len = _arrS.length; i < _len; i++) {
    let pos = _arrS[i].indexOf('=');
    if (pos === -1) {
      continue;
    }
    let name = _arrS[i].substring(0, pos),
      value = window.decodeURIComponent(_arrS[i].substring(pos + 1));
    _rs[name] = value;
  }
  return _rs;
}