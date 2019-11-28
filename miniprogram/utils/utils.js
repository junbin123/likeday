// 返回目标日期与当前日期的天数差值，输入目标日期
function daysBetween(year, month, day) {
  var currentTimestamp = new Date().getTime();
  var targetTimestamp = new Date(year, month - 1, day).getTime();
  var currentDay = currentTimestamp / 1000 / 60 / 60 / 24;
  var targetDay = targetTimestamp / 1000 / 60 / 60 / 24;
  return Math.ceil(targetDay - currentDay)
}


function daysBetween2(targetDate) {
  var currentTimestamp = new Date().getTime();
  var targetTimestamp = new Date(targetDate).getTime();
  var currentDay = currentTimestamp / 1000 / 60 / 60 / 24;
  var targetDay = targetTimestamp / 1000 / 60 / 60 / 24;
  return Math.ceil(targetDay - currentDay)
}


// 实现事件置顶，输入数组，返回数组；其中deleteState为true会剔除
function setTopCard(originalCards) {
  var tempCards = originalCards;
  var topCards = [];
  var normalCards = [];
  var cards = [];
  for (let item of tempCards) {
    // 动态计算天数差值
    let year = item.targetDate.slice(0, 4),
      month = item.targetDate.slice(5, 7),
      day = item.targetDate.slice(-2);
    let betweenDays = daysBetween(year, month, day);
    item.betweenDays = betweenDays;
    // 置顶实现
    if (item.top === true) {
      topCards.push(item)
    } else {
      normalCards.push(item)
    }
  }
  cards = topCards.reverse().concat(normalCards);
  return cards
}


// 根据用户输入目标日和重复间隔，设置新目标日 targetDate:2019-12-02  repeat: 2
// 重复间隔时间：['不重复', '每天重复', '每周重复', '每月重复', '每年重复']
function resetTargetDate(initTargetDate, targetDate, repeat) {
  var year = parseInt(targetDate.slice(0, 4)),
    month = parseInt(targetDate.slice(5, 7)),
    day = parseInt(targetDate.slice(8, 10))
  var currentDate = new Date()
  var cYear = currentDate.getFullYear(),
    cMonth = currentDate.getMonth() + 1,
    cDay = currentDate.getDate()
  var newTargetDate = targetDate
  var betweenDays = daysBetween2(targetDate)

  if (repeat != 0 && betweenDays <= 0) {
    if (repeat === 1) { // 每天重复
      newTargetDate = formatDate(currentDate)
    } else if (repeat === 2) { // 每周重复
      let tempTargetDate = new Date(targetDate)
      let count = 7
      if (targetDate === initTargetDate) { // 判断是否初始设置目标日
        let differWeek = currentDate.getDay() - tempTargetDate.getDay()
        count = differWeek > 0 ? 7 - differWeek : -differWeek
        tempTargetDate = currentDate
      }
      tempTargetDate.setDate(tempTargetDate.getDate() + count)
      newTargetDate = formatDate(tempTargetDate)
    } else if (repeat === 3) { // 每月重复
      let tempTargetDate = currentDate
      if (cDay <= day) {
        tempTargetDate.setDate(tempTargetDate.getDate() + day - cDay)
      } else {
        tempTargetDate.setDate(day)
        tempTargetDate.setMonth(tempTargetDate.getMonth() + 1)
      }
      newTargetDate = formatDate(tempTargetDate)
    } else if (repeat === 4) { // 每年重复
      let tempTargetDate = new Date(initTargetDate)
      tempTargetDate.setFullYear(cYear)
      if (daysBetween2(formatDate(tempTargetDate)) <= 0) {
        tempTargetDate.setFullYear(cYear + 1)
      }
      newTargetDate = formatDate(tempTargetDate)
    }
  }
  return newTargetDate
}


// 输入：Wed Nov 27 2019 22:59:11 GMT+0800 (中国标准时间)
// 输出：2019-12-04
function formatDate(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  return (year + "-" + month + "-" + day)
}


// 加载数字字体Klavika
function getNumberFont() {
  wx.loadFontFace({
    family: 'Klavika',
    source: 'url("https://raw.githubusercontent.com/junbin123/hello-world/master/KlavikaMedium-Italic.ttf")',
    success: res => {
      console.log('font load success', res)
    },
    fail: err => {
      console.log('font load fail', err)
    }
  })


}


/** 生成绘制倒数日图片数组信息 **/
function getBetweenDaysArray(betweenDays, color) {
  var betweenDaysArray = [];
  var x = 0;
  var betweenDaysWidth = 0;
  // 计算天数宽度&值、宽度
  for (let item of betweenDays) {
    if (item === "1") {
      betweenDaysWidth += 40
      betweenDaysArray.push({
        "value": item,
        "width": 40
      })
    } else if (item === "4") {
      betweenDaysWidth += 65
      betweenDaysArray.push({
        "value": item,
        "width": 65
      })
    } else {
      betweenDaysWidth += 60
      betweenDaysArray.push({
        "value": item,
        "width": 60
      })
    }
  }
  // 计算x的值和url
  x = (320 - betweenDaysWidth) / 2
  for (let item of betweenDaysArray) {
    item.url = "/images/poster/number/" + color + "_number" + item.value + ".png"
    item.x = x
    x += item.width
  }
  return betweenDaysArray
}




module.exports = {
  daysBetween: daysBetween,
  setTopCard: setTopCard,
  getNumberFont: getNumberFont,
  getBetweenDaysArray: getBetweenDaysArray,
  formatDate: formatDate,
  resetTargetDate: resetTargetDate,
  daysBetween2: daysBetween2,
}