/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      obj[name] = v.substring(index + 1, v.length)
    }
  })
  return obj
}

/**
 * @param jsonObj
 * @returns {FormData}
 */
export function jsonObj2FormData(jsonObj) {
  const formData = new FormData()
  Object.keys(jsonObj).forEach((key) => {
    formData.append(key, jsonObj[key])
  })
  return formData
}

/**
 * 随机hsl颜色
 * @returns {string}
 * @constructor
 */
export function randomColor() {
  return 'rgb(' +
    Math.round(Math.random() * 255) + ',' +
    Math.round(Math.random() * 255) + ',' +
    Math.round(Math.random() * 255) + ')'
}

/**
 * 获取随机el-tag标签样式
 * @returns {string}
 */
export function randomTagType() {
  const tagType = ['', 'info', 'success', 'warning', 'danger']
  return tagType[Math.floor(Math.random() * tagType.length)]
}

/**
 * Delay for a number of milliseconds
 */
export function sleep(delay) {
  const start = new Date().getTime()
  while (new Date().getTime() < start + delay);
}

/**
 * 判断是否为空值，undefined、null、'' 都视为空值
 *
 * @param str         不定参数
 * @return {boolean}  若为空值，返回true，否则返回false
 */
export function isEmpty(...str) {
  return str.some(i => i === undefined || i === null || i === '')
}

/**
 * 根据文件路径获取文件后缀
 * @param filePath
 * @returns {string}
 */
export function getFileType(filePath) {
  const startIndex = filePath.lastIndexOf('.')
  if (startIndex !== -1) {
    return filePath.substring(startIndex + 1, filePath.length).toLowerCase()
  }
  return ''
}

/**
 * 编码oss文件uri
 * @param ossUri
 * @returns {string}
 */
export function encodeOssFileUri(ossUri = '') {
  const i = ossUri.lastIndexOf('/')
  const prefix = ossUri.substring(0, i + 1)
  const suffix = ossUri.substring(i + 1)
  return prefix + encodeURIComponent(suffix)
}
