<template>
  <GPopup v-model="isShow" position="bottom" @handleClose="handleCancel">
    <view class="date-container">
      <!-- 头部标题 -->
      <view class="date-title flex-between">
        <picker mode="date" @change="pickerChange" :value="dateFormatValue[1]">
          <view class="title-left flex v-hover-opacity">
            <text class="title-left-solor font-size-16 color-font-black likeday-font">{{dateFormatValue[0]}}</text>
            <text class="title-left-lunar font-size-14 color-font-black">{{titleLunarStr}}</text>
            <text class="iconfont icon-arrow-down font-size-22 color-font-black"></text>
          </view>
        </picker>
        <text class="v-hover-opacity title-right color-font-lightgray font-size-12 flex-center" @click="handleToday">回到今天</text>
      </view>
      <!-- 星期栏 -->
      <view class="date-week padding-lr-24-rpx font-size-14 color-font-lightgray flex-between border-top">
        <text class="week-item flex-center" v-for="(item,index) in weekList" :key="index">{{item}}</text>
      </view>
      <!-- 日历栏 -->
      <swiper class="swiper-box" :autoplay="false" :current="currSwiperIdx" @change="handleSwiperChange" :circular="true">
        <swiper-item v-for="(item,index) in calendarList" :key="index">
          <CalendarItem @handleClick="handleClickDay" :year="item.year" :month="item.month" :day="item.day" @change="handleDayChange" :customData="index"/>
        </swiper-item>
      </swiper>
      <view class="pop-btn">
        <view class="pop-btn-left"><GButton name="取消" type="gray" @handleClick="handleCancel"/></view>
        <view class="pop-btn-right"><GButton name="保存" @handleClick="handleSubmit"/></view>
      </view>
    </view>
  </GPopup>
</template>

<script>
/**
 * 时间选择器
 */
import GPopup from '@/components/Basics/GPopup'
import GButton from '@/components/Basics/GButton'
import CalendarItem from '@/components/Business/Add/Calendar/CalendarItem'
import { solarToLunar } from '@/utils/calendar.js'
import dayjs from 'dayjs'
const nowDate = new Date()
export default {
  components: { GPopup, GButton, CalendarItem },
  props: {
    value: { // 是否显示
      type: Boolean,
      default: false
    },
    currentDate: { // 当前选中的日期 eg. 2020/08/02
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isCancelOperate: false, // 当前是否正在进行取消操作
      nowYear: nowDate.getFullYear(), // 当前年份
      nowMonth: nowDate.getMonth() + 1, // 当前月份
      nowDay: nowDate.getDate(), // 当前日期
      preDayIndex: 0, // 上一个日期的index值
      currDayIndex: 0, // 当前日期的index值
      rows: 5, // 行数
      selectDay: 14,
      currSwiperIdx: 1, // 当前滑块下标
      preSwiperIdx: 1, // 前一个滑块下标
      swiperIndex: 1, // swiper选中的index
      weekList: ['日', '一', '二', '三', '四', '五', '六'], // 星期字符串
      calendarList: [], // 每月日历列表
      dayInfo: {},
      titleLunarStr: '',
      isToToday: false// 是否点击回到今天
    }
  },
  computed: {
    isShow: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    dateFormatValue ({ calendarList, currSwiperIdx }) { // 当前日期的两种展示格式
      const { year = '', month = '', day = '' } = calendarList[currSwiperIdx] || {}
      const res1 = this.$day(`${year}/${month}/${day}`).format('YYYY/MM/DD')
      const res2 = this.$day(`${year}/${month}/${day}`).format('YYYY-MM-DD')
      return [res1, res2]
    }
  },
  mounted () {
    this.resetCalendar()
  },
  methods: {
    pickerChange (e) {
      console.log('picker-----------')
      const value = e.detail.value.split('-').map(item => parseInt(item))
      const year = value[0]
      const month = value[1]
      const day = value[2]
      this.setCalenderState(year, month, day)
      const { monthStr, dayStr, ...other } = solarToLunar(value.join('/'))
      this.titleLunarStr = `${monthStr}${dayStr}`
      console.log(other)
      this.updateCalendarList({ day })
      const week = dayjs(e.detail.value).day()
      console.log(week)
      const weekList = ['日', '一', '二', '三', '四', '五', '六']
      this.dayInfo = {
        year,
        month,
        day,
        lunarDay: dayStr,
        lunarMonth: monthStr,
        lunarYear: other.year,
        select: true,
        week,
        weekStr: weekList[week]
      }

      console.log('picker----', { ...this.dayInfo })
    },
    // 重置日历为初始状态
    resetCalendar () {
      console.log('resetCalendar')
      const year = Number(this.currentDate.split('/')[0])
      const month = Number(this.currentDate.split('/')[1])
      const day = Number(this.currentDate.split('/')[2])
      this.setCalenderState(year, month, day)
    },
    handleDayChange (data, customData) {
      console.log('handleDayChange------')
      if (customData === this.currSwiperIdx) {
        this.dayInfo = data
        this.titleLunarStr = `${data.lunarMonth}${data.lunarDay}`
      }
      // console.log('cahnd--------',);
      console.log('asfsdafsd----', { ...this.dayInfo })
    },
    // swiper 切换事件
    handleSwiperChange ({ detail }) {
      console.log('handleSwiperChange')
      this.preSwiperIdx = this.currSwiperIdx
      this.currSwiperIdx = detail.current
      const currMonth = this.calendarList[this.currSwiperIdx].month
      const currYear = this.calendarList[this.currSwiperIdx].year
      const regex = new RegExp(`${this.preSwiperIdx}${this.currSwiperIdx}`)
      if (!this.isToToday) {
        if (this.isCancelOperate) {
          this.isCancelOperate = false
          this.calendarList = this.calendarList.map((item, index) => ({ ...item, day: Number(this.currentDate.split('/')[2]) }))
        } else {
          this.calendarList = this.calendarList.map((item, index) => ({ ...item, day: index === this.currSwiperIdx ? 1 : 0 }))
        }
        console.log('1--')
      }
      this.isToToday = false
      if (regex.test('1201')) { // 左滑下标变化:120120...
        const year = currMonth === 12 ? currYear + 1 : currYear
        const month = currMonth === 12 ? 1 : currMonth + 1
        const indexDict = { 0: 1, 1: 2, 2: 0 } // 当前下标与要修改下标的映射
        this.calendarList[indexDict[this.currSwiperIdx]] = { year, month, day: 0 }
        console.log('2--')
        return
      }
      if (regex.test('1021')) { // 右滑下标变化:102102...
        const year = currMonth === 1 ? currYear - 1 : currYear
        const month = currMonth === 1 ? 12 : currMonth - 1
        const indexDict = { 0: 2, 1: 0, 2: 1 }
        this.calendarList[indexDict[this.currSwiperIdx]] = { year, month, day: 0 }
        console.log('3--')
      }
    },

    // 初始化日历状态
    setCalenderState (year, month, day = 1) {
      console.log('setCalenderState', year, month, day)
      this.calendarList = [{
        year: month === 1 ? year - 1 : year,
        month: month === 1 ? 12 : month - 1,
        day: 0
      }, {
        year, month, day
      }, {
        year: month === 12 ? year + 1 : year,
        month: month === 12 ? 1 : month + 1,
        day: 0
      }]
      this.currSwiperIdx = 1
      this.preSwiperIdx = 1
    },
    // 日期点击事件
    handleClickDay ({ empty = false, ...data }) {
      this.updateCalendarList({ day: data.day })
    },
    /**
     * 更新日期
     * @param {Number} day 月份中的日 1~31
     **/
    updateCalendarList ({ day }) {
      this.isToToday = false
      this.calendarList = this.calendarList.map((item, index) => {
        if (index === this.currSwiperIdx) {
          return { ...item, day }
        }
        return item
      })
      console.log('calendarList--------------', this.calendarList.map(item => ({ ...item })))
    },
    // 回到今天点击事件
    handleToday () {
      this.isToToday = true
      this.setCalenderState(this.nowYear, this.nowMonth, this.nowDay)
    },
    // 格式化日历列表
    formatCalendar (list) {
      const start = list[0].week
      const end = 6 - list[list.length - 1].week
      const startArr = Array(start).fill({ empty: true })
      const endArr = Array(end).fill({ empty: true })
      const tempList = [...startArr, ...list, ...endArr].map((item, index) => ({ ...item, index }))
      const res = Array(tempList.length / 7)
        .fill('')
        .map((item, index) => {
          const start = index * 7
          const end = (index + 1) * 7
          return tempList.slice(start, end)
        })
      return res
    },
    handleCancel () {
      console.log('handleCancel')
      this.isCancelOperate = true
      this.isShow = false
      this.resetCalendar()
      this.$emit('handleClose')
    },
    handleSubmit () {
      console.log('handleSubmit------', { ...this.dayInfo })
      this.$emit('handleSubmit', this.dayInfo)
    }
  }
}
</script>

<style lang="scss" scoped>
.date-container{
  height: 100%;
  .date-title{
    height: 60px;
    padding: 0 24rpx;
    // background: lightblue;
    .title-left-lunar{
      padding-left: 6px;
    }
    .title-right{
      width:76px;
      height: 30px;
      border-radius: 15px;
      background: $color-bg-gray;
    }
  }
  .date-week{
    width: 100%;
    height: 40px;
    // background: lightgreen;
    .week-item{
      width: 100rpx;
      height: 100%;
    }
  }
  .swiper-box{
    height: 300px;
    // background: lightblue;
    width: 100%;
    .calendar-box{
      width: 702rpx;
      margin: 0 24rpx;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .calendar-row{
        width: 100%;
        height: 100%;
      }
      .calendar-item{
        width: 100rpx;
        height: 100%;
        .item-box{
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }
        .select{
          width: 42px;
          height:42px;
          border-radius: 50%;
          background: $color-blue;
        }
        &-day{
          padding-bottom: 14px;
          font-size: 14px;
          color: $color-font-black;
          font-family: 'LikeDayFont';
        }
        &-lunar{
          font-size: 10px;
          color: $color-font-lightgray;
        }
      }
    }
  }

   .pop-btn{
    width: 100%;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // background: lightseagreen;
    .pop-btn-left{
      width: 50%;
      height: 100%;
      padding: 12px 6px 12px 24rpx;
    }
    .pop-btn-right{
      width: 50%;
      height: 100%;
      padding: 12px 24rpx 12px 6px;
    }
  }

}

</style>
