export const forEach = (arr, fn) => {
  if (!arr.length || !fn) return
  let i = -1
  let len = arr.length
  while (++i < len) {
    let item = arr[i]
    fn(item, i, arr)
  }
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的交集, 两个数组的元素为数值或字符串
 */
export const getIntersection = (arr1, arr2) => {
  let len = Math.min(arr1.length, arr2.length)
  let i = -1
  let res = []
  while (++i < len) {
    const item = arr2[i]
    if (arr1.indexOf(item) > -1) res.push(item)
  }
  return res
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的并集, 两个数组的元素为数值或字符串
 */
export const getUnion = (arr1, arr2) => {
  return Array.from(new Set([...arr1, ...arr2]))
}

/**
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr, arr) => {
  return targetarr.some(_ => arr.indexOf(_) > -1)
}

/**
 * @param {String|Number} value 要验证的字符串或数值
 * @param {*} validList 用来验证的列表
 */
export function oneOf (value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}

/**
 * @param {Number} timeStamp 判断时间戳格式是否是毫秒
 * @returns {Boolean}
 */
const isMillisecond = timeStamp => {
  const timeStr = String(timeStamp)
  return timeStr.length > 10
}

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} currentTime 当前时间时间戳
 * @returns {Boolean} 传入的时间戳是否早于当前时间戳
 */
const isEarly = (timeStamp, currentTime) => {
  return timeStamp < currentTime
}

/**
 * @param {Number} num 数值
 * @returns {String} 处理后的字符串
 * @description 如果传入的数值小于10，即位数只有1位，则在前面补充0
 */
const getHandledValue = num => {
  return num < 10 ? '0' + num : num
}

const  myTime= date =>{
       var arr=date.split("T");
       var d=arr[0];
       var darr = d.split('-');
       var t=arr[1];
       var tarr = t.split('.000');
       var marr = tarr[0].split(':');
       var dd = parseInt(darr[0])+"/"+parseInt(darr[1])+"/"+parseInt(darr[2])+" "+parseInt(marr[0])+":"+parseInt(marr[1])+":"+parseInt(marr[2]);
     return dd;
    }
  export function renderTime(date,startType) {
    var dateTime=myTime(date);
    var d = new Date(Date.parse(dateTime));
    d.setTime(d.setHours(d.getHours() + 8));
    const year = d.getFullYear()
    const month = getHandledValue(d.getMonth() + 1)
    const day= getHandledValue(d.getDate())
    const hours = getHandledValue(d.getHours())
    const minutes = getHandledValue(d.getMinutes())
    const second = getHandledValue(d.getSeconds())
    let resStr =''
    if (startType === 'year'){
      resStr = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + second
    }else if(startType === 'nian'){
      resStr = year + '年' + month + '月' + day + '日' + hours + '时' + minutes + '分' + second +'秒'
    }else if(startType === 'nian2'){
      resStr = year + '' + month + '' + day + '' + hours + '' + minutes + '' + second +''
    }else if(startType === 'day'){
      resStr = year + '-' + month + '-' + day
    }else resStr = month + '-' + day + ' ' + hours + ':' + minutes
    return resStr
  }
/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} startType 要返回的时间字符串的格式类型，传入'year'则返回年开头的完整时间
 */
export function getDate(timeStamp, startType){
  let resStr ='';
  var type=typeof timeStamp;
  if(timeStamp){
    if(type=='string'&& timeStamp.indexOf("T")>1&& timeStamp.split("T").length==2){
      resStr =renderTime(timeStamp, startType);
    }else{
      const d = new Date(timeStamp)
      const year = d.getFullYear()
      const month = getHandledValue(d.getMonth() + 1)
      const date = getHandledValue(d.getDate())
      const hours = getHandledValue(d.getHours())
      const minutes = getHandledValue(d.getMinutes())
      const second = getHandledValue(d.getSeconds())
      if (startType === 'year'){
        resStr = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + second
      }else if(startType === 'nian'){
        resStr = year + '年' + month + '月' + date + '日' + hours + '时' + minutes + '分' + second +'秒'
      }else if(startType === 'nian2'){
        resStr = year + '' + month + '' + date + '' + hours + '' + minutes + '' + second +''
      }else if(startType === 'day'){
        resStr = year + '-' + month + '-' + date
      }else resStr = month + '-' + date + ' ' + hours + ':' + minutes
    }
  }
  return resStr
}

/**
 * @param {Number} currDate 传入的时间戳
 * @param {Number} num 相差 -num 天前的时间 num 天后的时间
 */
export function getPointDate (currDate, num) {  //num表示天数，接受正负数
  if(!num){//做num简单验证
    return currDate;
  }
  num = Math.floor(num);
  var myDate = new Date(currDate),
      lw = new Date(Number(myDate) + 1000 * 60 * 60 * 24 * num), //num天数
      lastY = lw.getFullYear(),
      lastM = lw.getMonth()+1,
      lastD = lw.getDate(),
      startdate=lastY+ '-' +(lastM<10 ? "0" + lastM : lastM)+ '-' +(lastD<10 ? "0"+ lastD : lastD);
  return startdate;
}

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} many 相差 many 个月之前的时间
 */
export function getPreDate(timeStamp, many){
  var many=many*1;
  var d = new Date(rightTime(timeStamp));
  var year = d.getFullYear();
  var month =d.getMonth() + 1;// getHandledValue(d.getMonth() + 1)
  if(month-many>0){
    month= getHandledValue(month-many)
  }else{
    year=year-1;
    month=getHandledValue(12+(month-many))
  };
  var date = getHandledValue(d.getDate())
  var hours = getHandledValue(d.getHours())
  var minutes = getHandledValue(d.getMinutes())
  var second = getHandledValue(d.getSeconds())
  let resStr = year + '-' + month + '-' + date
  resStr=rightTime(resStr)
  return resStr
}

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} many 相差 many 个月之后的时间
 */
export function getNextDate(timeStamp, many){
  var many=many*1;
  var d = new Date(timeStamp);
  var year = d.getFullYear();
  var month =d.getMonth() + 1;// getHandledValue(d.getMonth() + 1)
  if(month+many>12){
    year=year+1;
    month=getHandledValue((month+many)-12)
  }else{
    month= getHandledValue(month+many)
  };
  var date = getHandledValue(d.getDate())
  var hours = getHandledValue(d.getHours())
  var minutes = getHandledValue(d.getMinutes())
  var second = getHandledValue(d.getSeconds())
  let resStr = year + '-' + month + '-' + date
  resStr=rightTime(resStr);
  return resStr
}

/**
 * @param {Number} startTime 传入开始时间
 * @param {Number} endTime 传入结束时间
 * @param {Number} many 相差 many 个月之后的时间
 */
export function isRightDate(startTime,endTime,many){
  var many=many*1;
  var start_Time= new Date(rightTime(startTime));
  var end_Time= new Date(rightTime(endTime));
  var s_year = start_Time.getFullYear();
  var e_year = end_Time.getFullYear();
  var s_month =start_Time.getMonth() + 1;// getHandledValue(d.getMonth() + 1)
  var e_month =end_Time.getMonth() + 1;// getHandledValue(d.getMonth() + 1)
  var s_date =start_Time.getDate()
  var e_date =end_Time.getDate()
  var resStr=''
  if((e_year*12+e_month)-(s_year*12+s_month)>many){
    resStr= getNextDate(startTime,many)
  }else if(((e_year*12+e_month)-(s_year*12+s_month))<0){
    resStr= getNextDate(startTime,many)
 }else{
   resStr=endTime
  }
  resStr=getDate(resStr,'day')
  return resStr
}

/**
 * @param {Number} startTime 传入开始时间
 *  判断传入的时间是否大于当天时间 如果是就返回当前时间
 */
export function rightTime(startTime){
  var current_time=new Date();
  var start_Time= new Date(startTime);
  // console.log(start_Time>current_time)
  var resStr=""
  if(start_Time>current_time){
    resStr=getDate(current_time,'day')
  }else{
    resStr=getDate(start_Time,'day');
  }
  // console.log(resStr)
  return resStr
}

/**
 * @param {String|Number} timeStamp 时间戳
 * @returns {String} 相对时间字符串
 */
export const getRelativeTime = timeStamp => {
  // 判断当前传入的时间戳是秒格式还是毫秒
  const IS_MILLISECOND = isMillisecond(timeStamp)
  // 如果是毫秒格式则转为秒格式
  if (IS_MILLISECOND) Math.floor(timeStamp /= 1000)
  // 传入的时间戳可以是数值或字符串类型，这里统一转为数值类型
  timeStamp = Number(timeStamp)
  // 获取当前时间时间戳
  const currentTime = Math.floor(Date.parse(new Date()) / 1000)
  // 判断传入时间戳是否早于当前时间戳
  const IS_EARLY = isEarly(timeStamp, currentTime)
  // 获取两个时间戳差值
  let diff = currentTime - timeStamp
  // 如果IS_EARLY为false则差值取反
  if (!IS_EARLY) diff = -diff
  let resStr = ''
  const dirStr = IS_EARLY ? '前' : '后'
  // 少于等于59秒
  if (diff <= 59) resStr = diff + '秒' + dirStr
  // 多于59秒，少于等于59分钟59秒
  else if (diff > 59 && diff <= 3599) resStr = Math.floor(diff / 60) + '分钟' + dirStr
  // 多于59分钟59秒，少于等于23小时59分钟59秒
  else if (diff > 3599 && diff <= 86399) resStr = Math.floor(diff / 3600) + '小时' + dirStr
  // 多于23小时59分钟59秒，少于等于29天59分钟59秒
  else if (diff > 86399 && diff <= 2623859) resStr = Math.floor(diff / 86400) + '天' + dirStr
  // 多于29天59分钟59秒，少于364天23小时59分钟59秒，且传入的时间戳早于当前
  else if (diff > 2623859 && diff <= 31567859 && IS_EARLY) resStr = getDate(timeStamp)
  else resStr = getDate(timeStamp, 'year')
  return resStr
}

/**
 * @returns {String} 当前浏览器名称
 */
export const getExplorer = () => {
  const ua = window.navigator.userAgent
  const isExplorer = (exp) => {
    return ua.indexOf(exp) > -1
  }
  if (isExplorer('MSIE')) return 'IE'
  else if (isExplorer('Firefox')) return 'Firefox'
  else if (isExplorer('Chrome')) return 'Chrome'
  else if (isExplorer('Opera')) return 'Opera'
  else if (isExplorer('Safari')) return 'Safari'
}

/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * 判断一个对象是否存在key，如果传入第二个参数key，则是判断这个obj对象是否存在key这个属性
 * 如果没有传入key这个参数，则判断obj对象是否有键值对
 */
export const hasKey = (obj, key) => {
  if (key) return key in obj
  else {
    let keysArr = Object.keys(obj)
    return keysArr.length
  }
}

/**
 * @param {*} obj1 对象
 * @param {*} obj2 对象
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 */
export const objEqual = (obj1, obj2) => {
  const keysArr1 = Object.keys(obj1)
  const keysArr2 = Object.keys(obj2)
  if (keysArr1.length !== keysArr2.length) return false
  else if (keysArr1.length === 0 && keysArr2.length === 0) return true
  /* eslint-disable-next-line */
  else return !keysArr1.some(key => obj1[key] != obj2[key])
}
