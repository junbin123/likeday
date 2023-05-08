import request from '@/app/request'
import store from '@/store'
import dayjs from 'dayjs'
import { solarToLunar } from '@/utils/calendar'

// 更新目标日
const updateTargetDate = ({ targetDate = {}, repeatInfo = {} }) => {
  const { solorDate, isLunar } = targetDate
  const { interval } = repeatInfo
  const today = dayjs(dayjs().format('YYYY/MM/DD'))
  const delta = today.diff(solorDate, 'day')
  if (interval === 0 || delta <= 0) { // 没有设置重复 || 目标日还没到
    return targetDate
  }
  const newSolorDate = getNextTargetDate({ targetDate, repeatInfo, today, noToday: false })
  console.log({ newSolorDate }, '===')
  if (!newSolorDate) {
    return ''
  }
  const lunar = solarToLunar(newSolorDate.format('YYYY/MM/DD'))
  return {
    isLunar,
    solorDate: newSolorDate.format('YYYY/MM/DD'),
    week: newSolorDate.day(),
    lunarDate: `${lunar.year}年${lunar.monthStr}${lunar.dayStr}`
  }
}

/**
 * 获取当前日期的下一个目标日
 * @param {Object} param.targetDate
 * @param {Object} param.repeatInfo
 * @param {dayjs} param.today 当前日期
 * @param {Boolean} param.noToday 目标日能否是今天，不能再取下一个目标日
 * @returns {dayjs}
 */
const getNextTargetDate = ({ targetDate, repeatInfo, today, noToday }) => {
  const { type, interval } = repeatInfo
  const { solorDate } = targetDate
  const delta = today.diff(solorDate, 'day')
  if (interval === 0 || (noToday ? delta < 0 : delta <= 0)) {
    return dayjs(solorDate)
  }
  const typeDict = { // 获取新的目标日 dayjs对象
    day: () => {
      const dayCount = Math.ceil(delta / interval) * interval || interval
      const res = dayjs(solorDate).add(dayCount, 'day')
      return res
    },
    week: () => {
      const count = Math.ceil(delta / (interval * 7)) || 1 // 获取最小周期数，使得新日期在当前之后
      const res = dayjs(solorDate).add(count * interval, 'week')
      return res
    },
    month: () => {
      const deltaMonth = today.diff(solorDate, 'month') || 1 // 最多间隔几个月
      const count = Math.ceil(deltaMonth / interval) // 最多间隔几个周期
      const res = dayjs(solorDate).add(count * interval, 'month')
      return res
    },
    year: () => {
      const deltaYear = today.diff(solorDate, 'year') || 1
      const count = Math.ceil(deltaYear / interval) // 最多间隔几个周期
      const res = dayjs(solorDate).add(count * interval, 'year')
      return res
    }
  }
  const res = typeDict?.[type]?.() || ''
  return res
}

// 格式化倒数日方法
export const formatCountdown = (item) => {
  const { targetDate, repeatInfo } = item
  const newTargetDate = updateTargetDate({ targetDate, repeatInfo })
  const now = dayjs(dayjs().format('YYYY/MM/DD'))
  const target = dayjs(newTargetDate.solorDate)
  const dayTimes = target.diff(now, 'day')
  return {
    ...item,
    targetDate: newTargetDate,
    dayTimes // 天数,负数已过去 正数在未来
  }
}

/**
 * 获取倒数日事件
 */
export const getCountdownList = async (params) => {
  const res = await request('/countdown/get', params)
  const { data, total } = res.data
  const resData = {
    data: data?.map(item => formatCountdown(item)),
    total
  }
  return resData
}

// 添加倒数日事件
export const addCountdown = async data => {
  store.dispatch('app/updateCount', 1)
  store.dispatch('app/updateCategoryCount', {
    id: data.categoryId,
    change: 1
  })
  const res = await request('/countdown/add', data)
  return res
}

// 编辑倒数日事件
export const editCountdown = async ({ id, ...data }) => {
  const res = await request(`/countdown/update?id=${id}`, data)
  return res
}

// 删除倒数日事件
export const deleteCountdown = async ({ id, ...data }) => {
  const res = await request(`/countdown/delete?id=${id}`, data)
  return res.data
}

// 归档倒数日事件
export const archiveCountdown = async ({ id, ...data }) => {
  store.dispatch('app/updateCount', data.isArchive ? -1 : 1)
  store.dispatch('app/updateCategoryCount', {
    id: data.categoryId,
    change: data.isArchive ? -1 : 1
  })
  const res = await request(`/countdown/archive?id=${id}`, data)
  return res.data
}

/**
 * 获取归档倒数日列表
 */
export const getArchiveCountdown = async (params) => {
  const res = await request('/countdown/getArchive', params)
  const { data, total } = res.data
  return {
    data: data?.map(item => formatCountdown(item)),
    total
  }
}

// export const getCountdownQrcode = async (data) => {
//   const res = await request('/countdown/getqrcode', data)
//   return res.data
// }
