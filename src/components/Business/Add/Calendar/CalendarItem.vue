<template>
  <view class="calendar-container">
    <view class="calendar-box">
      <view class="calendar-row flex-between" v-for="(rows, row) in calendarList" :key="row">
        <view
          class="v-hover-opacity calendar-item flex-center"
          v-for="(item, index) in rows"
          :key="index"
          @click="handleClickDay(item)"
        >
          <view v-if="!item.empty" :class="[{ select: item.select }, 'item-box']">
            <text class="calendar-item-day" :style="item.select ? 'color:#fff' : ''"
              >{{ item.day }}</text
            >
            <text class="calendar-item-lunar" :style="item.select ? 'color:#C8CDFF' : ''">{{
              item.lunarDay
            }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * 日历组件
 */
//
import { getCalendarList } from '@/utils/calendar'
const nowDate = new Date()
export default {
  props: {
    year: {
      type: Number,
      default: nowDate.getFullYear()
    },
    month: {
      type: Number,
      default: nowDate.getMonth() + 1
    },
    day: {
      // 为0不选中
      type: Number,
      default: 0
    },
    customData: {
      type: [Number, String],
      default: 0
    }
  },
  data () {
    return {
      weekList: ['日', '一', '二', '三', '四', '五', '六'], // 星期字符串
      calendarList: [],
      dayCount: 0, // 当前日历有多少天是前一个月
      preIndex: 0,
      currIndex: 0,
      dayInfo: {} // 当前选中日期数据
    }
  },
  computed: {},
  created () {
    this.dayCount = new Date(this.year, this.month - 1, 1).getDay()
    this.preIndex = this.day + this.dayCount - 1
    this.currIndex = this.day + this.dayCount - 1
    this.calendarList = this.setInitState(this.year, this.month, this.day)
    this.$emit('change', this.dayInfo, this.customData)
  },
  watch: {
    year () {
      this.calendarList = this.setInitState(this.year, this.month, this.day)
    },
    month () {
      this.calendarList = this.setInitState(this.year, this.month, this.day)
    },
    day () {
      this.calendarList = this.setInitState(this.year, this.month, this.day)
      this.$emit('change', this.dayInfo, this.customData)
    }
  },
  methods: {
    // 设置日历状态
    setInitState (year, month, day) {
      const temp = getCalendarList(year, month)
      if (day) {
        temp[day - 1].select = true
        this.dayInfo = temp[day - 1]
      }
      const calendar = this.formatCalendar(temp)
      return calendar
    },
    handleClickDay ({ index, empty = false, ...data }) {
      if (empty) {
        return
      }
      this.dayInfo = { index, ...data }
      this.clearSelect()
      const list = this.calendarList
      // 设置下一个选中
      this.preIndex = this.currIndex
      this.currIndex = index
      const row = Math.floor(index / 7)
      const column = index % 7
      list[row][column].select = true
      this.calendarList = JSON.parse(JSON.stringify(list))
      this.$emit('handleClick', { index, ...data })
    },
    clearSelect () {
      this.calendarList = this.calendarList.map((rows) => {
        return rows.map(column => ({ ...column, select: false }))
      })
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
    }
  }
}
</script>

<style lang="scss" scoped>
.calendar-box {
  width: 702rpx;
  margin: 0 24rpx;
  height: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .calendar-row {
    width: 100%;
    height: 100%;
  }
  .calendar-item {
    width: 100rpx;
    height: 100%;
    .item-box {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    .select {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: $color-blue;
    }
    &-day {
      padding-bottom: 14px;
      font-size: 16px;
      color: $color-font-black;
      font-family: 'LikeDayFont';
    }
    &-lunar {
      font-size: 10px;
      color: $color-font-lightgray;
    }
  }
}
</style>
