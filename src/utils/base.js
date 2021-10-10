
/**
 * 获取字符串的长度单位，半角为1个单位，全角为2个单位
 * @param {String} str 待计算的字符串
 * @return {Number} 长度
 */
export const getStrLength = (str = '') => {
  return str.split('').reduce((accumulator, currentValue) => {
    // eslint-disable-next-line no-control-regex
    const regex = /[\x00-\xff]/g
    const count = regex.test(currentValue) ? 1 : 2
    return accumulator + count
  }, 0)
}

/**
 * 快排
 * @param {Array} arr 列表
 * @param {String} sortKey 排列基准值
 * @param {Boolean} isAscending 是否为升序
 */
export const quickSort = (arr = [], sortKey = '', isAscending = true) => {
  if (arr.length <= 1) { return arr }
  const pivotIndex = Math.floor(arr.length / 2)
  const pivotKey = sortKey ? arr.slice(pivotIndex, pivotIndex + 1)[0][sortKey] : arr.slice(pivotIndex, pivotIndex + 1)[0]
  const pivot = arr.splice(pivotIndex, 1)[0]
  const left = []
  const right = []
  arr.forEach((item, index) => {
    const key = sortKey ? item[sortKey] : item
    if (isAscending) {
      if (key < pivotKey) {
        left.push(item)
      } else {
        right.push(item)
      }
    } else {
      if (key > pivotKey) {
        left.push(item)
      } else {
        right.push(item)
      }
    }
  })
  return [...quickSort(left, sortKey, isAscending), pivot, ...quickSort(right, sortKey, isAscending)]
}

export const uuid = (len, radix) => {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  var uuid = []
  var i
  radix = radix || chars.length
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
  } else {
    var r
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}
