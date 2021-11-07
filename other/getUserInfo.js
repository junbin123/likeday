// 老likeday数据转新数据
const { uuid } = require('./uuid.js')
const countdownList = require('./likeday-countdown.json')
const updateTime = Date.parse(new Date())
const fs = require('fs')
const dayjs = require('dayjs')
const { solarToLunar } = require('./calendar.js')

console.log(`一共有${countdownList.length}个事件`)
// countdownList = countdownList.filter(item => {
//   if (!item.targetDate) {
//     return false
//   }
//   const year = parseInt(item.targetDate.split('-')[0])
//   return year < 2100
// })
// console.log(`过滤后，一共有${countdownList.length}个事件`)

// 梳理老数据
// const formatCountdown = () => {
//   console.log('formatCountdown')
//   // eslint-disable-next-line no-path-concat
//   const path = __dirname + '/../script/likeday-countdown.json'
//   const data = fs.readFileSync(path, 'utf8').split('\n')
//   const target = '[' + data.map((item, index) => index === data.length - 1 ? item : item + ',').join('') + ']'
//   fs.writeFile(path, target, err => {
//     console.log('梳理完成', err)
//   })
// }

const getRepeatInfo = (repeat) => {
  if (parseInt(repeat) === 1) {
    return {
      name: '每1天重复',
      interval: 1, // 取值:0~10 0未开启
      type: 'day' // 取值：day week month year
    }
  }
  if (parseInt(repeat) === 2) {
    return {
      name: '每1周重复',
      interval: 1, // 取值:0~10 0未开启
      type: 'week' // 取值：day week month year
    }
  }
  if (parseInt(repeat) === 3) {
    return {
      name: '每1月重复',
      interval: 1, // 取值:0~10 0未开启
      type: 'month' // 取值：day week month year
    }
  }
  if (parseInt(repeat) === 4) {
    return {
      name: '每1年重复',
      interval: 1, // 取值:0~10 0未开启
      type: 'year' // 取值：day week month year
    }
  }
  return {
    name: '每1天重复',
    interval: 0, // 取值:0~10 0未开启
    type: 'day' // 取值：day week month year
  }
}

const getNewCountdown = (data, updateTime, openidDict) => {
  const solorDate = dayjs(data.targetDate).format('YYYY/MM/DD')
  const lunar = solarToLunar(solorDate)
  const lunarDate = `${lunar.year}年${lunar.monthStr}${lunar.dayStr}`
  return {
    uid: openidDict[data._openid],
    categoryId: '', // 分类id，没有为空
    isArchive: data.deleteState, // 是否归档
    isReminder: false, // 是否开启提醒
    isTop: data.top, // 是否置顶
    title: data.title,
    updateTime,
    reminderInfo: { // 提醒信息
      name: '当天下午 9 点提醒我',
      day: 1, // 取值0~7，提前day天
      type: 'am', // 取值am pm
      hour: 9 // 取值1~12，几点
    },
    targetDate: {
      isLunar: data.isLunar, // 是否显示农历
      week: dayjs(data.targetDate).day(), // 0~6，星期
      solorDate,
      lunarDate
    },
    repeatInfo: getRepeatInfo(data.repeat)
  }
}

// 获取openid去重的countdownList
const getCountdownListTemp = () => {
  const res = []
  countdownList.forEach(item => {
    const openidList = res.map(item => item._openid)
    if (!openidList.includes(item._openid)) {
      // if (item.nickname && item.nickname !== '点击登录') {
      //   console.log('用户昵称：', item.nickname)
      // }
      res.push(item)
    }
  })
  return res
}

// 根据倒数日提取用户信息
const getUserInfo = (data) => {
  const openid = data._openid
  const countdownCount = countdownList.filter(item => item._openid === openid && !item.deleteState).length
  const uid = uuid(8, 16)
  let { nickname: nickName, avatarUrl } = data
  if (avatarUrl === '/images/icon/personal_icon/default_avatar.png') {
    nickName = ''
    avatarUrl = ''
  }
  return {
    avatarUrl,
    nickName,
    uid,
    isNew: true,
    isAuth: false,
    categoryList: [{ name: '重要的一天', id: '001', count: 0, icon: 'icon-love' }],
    openid,
    createTime: updateTime,
    countdownCount
  }
}
console.log('正在计算有多少用户')
const userList = getCountdownListTemp().map(item => {
  return getUserInfo(item)
})

const writeUserList = () => {
  return new Promise(resolve => {
    console.log('有多少用户：', userList.length)
    // eslint-disable-next-line no-path-concat
    const path = __dirname + '/../script/target-user.json'
    const writeData = userList.map(item => {
      return JSON.stringify(item)
    }).join('\n')
    console.log('正在写入target-user.json')
    fs.writeFile(path, writeData, () => {
      console.log('已写入target-user.json')
      resolve(true)
    })
  })
}

const writeCountdown = () => {
  const openidDict = {}
  userList.forEach(item => {
    openidDict[item.openid] = item.uid
  })
  const writeData = countdownList.map(item => {
    const res = getNewCountdown(item, updateTime, openidDict)
    if (Object.keys(res).length !== 10) {
      console.log('没有10个', Object.keys(res), res.uid)
    }
    return JSON.stringify(res)
  }).join('\n')
  console.log('正在写入target-countdown.json')
  // eslint-disable-next-line no-path-concat
  const path = __dirname + '/../script/target-countdown.json'
  fs.writeFile(path, writeData, () => {
    console.log('已写入target-countdown.json')
  })
}

// formatCountdown()
writeUserList().then(res => {
  writeCountdown()
})
