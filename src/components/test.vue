<template>
  <view class="date">
    <view class="head">
      <view class="icon" @click="switch_month_week('prev', true)"
        ><text class="iconfont icon-fanhui"
      /></view>
      <view class="title">{{ nowYear + '年' + nowMonth + '月' }}</view>
      <view class="icon" @click="switch_month_week('next', true)"
        ><text class="iconfont next icon-fanhui"
      /></view>
    </view>
    <view class="date_dl">
      <view class="dd" v-for="(item, index) in week" :key="index">{{ item }}</view>
    </view>
    <swiper
      :style="{ height: (retract ? 2 * 80 : (week_list.length + 1) * 80) + 'rpx' }"
      :current="current"
      circular
      @change="change_date"
    >
      <swiper-item>
        <view
          class="date_dl"
          v-show="!retract || index == to_prev_week_index"
          v-for="(item, index) in week_list_prev_co"
          :key="index"
        >
          <view class="dd" @click="item_click(vo, index, key)" v-for="(vo, key) in item" :key="key">
            <view
              class="num"
              :class="[
                vo.today ? 'today' : '',
                vo.type == 'month' ? 'month' : retract ? '' : 'disabled'
              ]"
              >{{ vo.day }}</view
            >
            <view v-show="vo.dot && (vo.type == 'month' || retract)" class="dot"></view>
          </view>
        </view>
        <view @click="open" class="retract icon"
          ><text class="iconfont next icon-fanhui" :class="[retract ? '' : 'retract_icon']"
        /></view>
      </swiper-item>
      <swiper-item>
        <view
          class="date_dl"
          v-show="!retract || index == to_week_index"
          v-for="(item, index) in week_list"
          :key="index"
        >
          <view class="dd" @click="item_click(vo, index, key)" v-for="(vo, key) in item" :key="key">
            <view
              class="num"
              :class="[
                vo.today ? 'today' : '',
                vo.type == 'month' ? 'month' : retract ? '' : 'disabled'
              ]"
              >{{ vo.day }}</view
            >
            <view v-show="vo.dot && (vo.type == 'month' || retract)" class="dot"></view>
          </view>
        </view>
        <view @click="open" class="retract icon"
          ><text class="iconfont next icon-fanhui" :class="[retract ? '' : 'retract_icon']"
        /></view>
      </swiper-item>
      <swiper-item>
        <view
          class="date_dl"
          v-show="!retract || index == to_next_week_index"
          v-for="(item, index) in week_list_next_co"
          :key="index"
        >
          <view class="dd" @click="item_click(vo, index, key)" v-for="(vo, key) in item" :key="key">
            <view
              class="num"
              :class="[
                vo.today ? 'today' : '',
                vo.type == 'month' ? 'month' : retract ? '' : 'disabled'
              ]"
              >{{ vo.day }}</view
            >
            <view v-show="vo.dot && (vo.type == 'month' || retract)" class="dot"></view>
          </view>
        </view>
        <view @click="open" class="retract icon"
          ><text class="iconfont next icon-fanhui" :class="[retract ? '' : 'retract_icon']"
        /></view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    dot_lists: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      debug: false,
      week: ['日', '一', '二', '三', '四', '五', '六'],
      week_list: [],
      week_list_prev: [],
      week_list_prev_week: [],
      week_list_next: [],
      week_list_next_week: [],
      now_date: '',
      start_date: '',
      end_date: '',
      prev_date: '',
      next_date: '',
      nowYear: '',
      nowMonth: '',
      nowDay: '',
      retract: true,
      to_week_index: 0,
      to_prev_week_index: 0,
      to_next_week_index: 0,
      nowTime: 0,
      dot_list: [],
      current: 1,
      date: ''
    }
  },
  watch: {
    value (value) {
      this.get_date(this.date_parse(value))
    },

    dot_lists: {
      immediate: true,
      handler (value) {
        this.dot_list = value
        this.set_doc_lists_update()
      }
    }
  },
  computed: {
    week_list_prev_co () {
      return this.retract ? this.week_list_prev_week : this.week_list_prev
    },
    week_list_next_co () {
      return this.retract ? this.week_list_next_week : this.week_list_next
    }
  },
  created () {
    this.init()
  },
  mounted () {
    console.log('week_list_prev_co', this.week_list_prev_co)
    console.log('week_list', this.week_list)
    console.log('week_list_next_co', this.week_list_next_co)
  },
  methods: {
    change () {
      const value = {
        fulldate: this.date.replace(/-(\d)(?!\d)/g, '-0$1')
      }

      this.$emit('change', value)
    },
    init () {
      console.log(this.value)
      if (this.value) {
        this.get_date(this.date_parse(this.value))
      } else {
        this.get_date()
      }

      this.doc_list_update()
      this.update_month()
    },
    open () {
      this.retract = !this.retract
      this.get_date(this.nowTime)
      this.set_to_day('week_list_prev')
      this.set_to_day('week_list_next')

      this.change_week()

      if (this.retract) {
        this.update_swiper_item('week')
      } else {
        this.update_swiper_item('month')
      }
      this.set_doc_lists_update()
    },
    change_week () {
      if (this.to_week_index < this.week_list.length - 1) {
        this.to_next_week_index = this.to_week_index + 1
        this.week_list_next_week = this.week_list
      } else {
        this.to_next_week_index = 0
        this.week_list_next_week = this.week_list_next
      }

      if (this.to_week_index == 0) {
        this.update_month()

        // if(){
        const next_day = this.week_list_prev[this.week_list_prev.length - 1][6].day

        // }
        this.to_prev_week_index = this.week_list_prev.length - 1 - Math.ceil(next_day / 7)

        this.week_list_prev_week = JSON.parse(JSON.stringify(this.week_list_prev))
      } else {
        this.to_prev_week_index = this.to_week_index - 1
        this.week_list_prev_week = this.week_list
      }

      // if(this.current == 1){

      // }
      // let to_week_index = this.to_week_index;
      // if(this.current == 2){
      // 	this.to_next_week_index = this.to_week_index;
      // 	this.to_week_index = this.to_week_index - 1;
      // 	this.to_prev_week_index =  this.to_next_week_index + 1;
      // }else if(this.current == 0){
      // 	this.to_next_week_index = this.to_week_index;
      // 	this.to_week_index = this.to_week_index - 1;
      // 	this.to_prev_week_index =  this.to_next_week_index + 1;
      // }
    },
    change_date_week (type) {
      const week_list = this.week_list
      const to_week_index = this.to_week_index
      if (type == 'prev') {
        this.to_week_index = this.to_prev_week_index
        this.to_prev_week_index = this.to_next_week_index
        this.to_next_week_index = to_week_index

        this.week_list = this.week_list_prev_week
        this.week_list_prev_week = this.week_list_next_week
        this.week_list_next_week = week_list
      } else if (type == 'next') {
        this.to_week_index = this.to_next_week_index
        this.to_next_week_index = this.to_prev_week_index
        this.to_prev_week_index = to_week_index

        this.week_list = this.week_list_next_week
        this.week_list_next_week = this.week_list_prev_week
        this.week_list_prev_week = week_list
      }

      this.set_to_day_all()
    },
    change_date_month (type) {
      const week_list = this.week_list
      if (type == 'prev') {
        this.week_list = this.week_list_prev
        this.week_list_prev = this.week_list_next
        this.week_list_next = week_list
      } else if (type == 'next') {
        this.week_list = this.week_list_next
        this.week_list_next = this.week_list_prev
        this.week_list_prev = week_list
      }
    },
    change_date (e) {
      console.log(e.detail.current, '------')
      const primary_current = this.current
      const current = e.detail.current

      this.current = current

      if (primary_current - current == -1 || primary_current - current == 2) {
        if (this.retract) {
          this.switch_month_week('next')
          this.change_week()
          if (primary_current - current == -1 && current != 1) {
            this.change_date_week('prev')
          } else if (primary_current - current == 2) {
            this.change_date_week('next')
          }
        } else {
          this.get_date(this.get_month('next'))
          this.update_month()
          if (primary_current - current == -1 && current != 1) {
            this.change_date_month('prev')
          } else if (primary_current - current == 2) {
            this.change_date_month('next')
          }
        }
      } else {
        if (this.retract) {
          this.switch_month_week('prev')
          this.change_week()
          if (primary_current - current == 1 && current != 1) {
            this.change_date_week('next')
          } else if (primary_current - current == -2) {
            this.change_date_week('prev')
          }
        } else {
          this.get_date(this.get_month('prev'))
          this.update_month()
          if (primary_current - current == 1 && current != 1) {
            this.change_date_month('next')
          } else if (primary_current - current == -2) {
            this.change_date_month('prev')
          }
        }
      }

      this.set_to_day_all()
      this.set_doc_lists_update()
      this.change()
      // const a = JSON.parse(JSON.stringify(this.week_list_prev_co))
      // const b = JSON.parse(JSON.stringify(this.week_list))
      // const c = JSON.parse(JSON.stringify(this.week_list_next_co))
      // console.log('1', [...a])
      // console.log('2', [...b])
      // console.log('3', [...c])
    },
    update_month () {
      this.get_date(this.get_month('prev'), 'prev')
      this.get_date(this.get_month('next'), 'next')
    },
    set_doc_lists_update () {
      this.doc_list_update('week_list')
      this.doc_list_update('week_list_prev')
      this.doc_list_update('week_list_next')
      this.doc_list_update('week_list_prev_week')
      this.doc_list_update('week_list_next_week')
    },
    doc_list_update (week_list = 'week_list') {
      const list = []

      this[week_list].map((item, index) => {
        list.push(
          item.map((vo, key) => {
            if (
              this.dot_list.indexOf(vo.date) > -1 ||
              this.dot_list.indexOf(vo.date.replace(/-(\d)(?!\d)/g, '-0$1')) > -1
            ) {
              vo.dot = true
            } else {
              vo.dot = false
            }
            return { ...vo }
          })
        )
      })
      this[week_list] = list
    },
    set_to_day (type) {
      const list = []

      this[type].map((item, index) => {
        list.push(
          item.map((vo, key) => {
            if (vo.date == `${this.date}`) {
              vo.today = true
            } else {
              vo.today = false
            }
            return { ...vo }
          })
        )
      })
      this[type] = list
    },
    item_click (item, item_index = -1) {
      if (!this.retract && item.type !== 'month') {
        return false
      }
      this.date = item.date
      if (item.type == 'month') {
        this.nowDay = item.day
        if (item_index >= 0) this.to_week_index = item_index
      } else if (this.retract) {
        this.nowDay = item.day
      }

      const now_arr = item.date.split('-')
      this.nowYear = now_arr[0]
      this.nowMonth = now_arr[1]
      this.nowDay = now_arr[2]

      this.set_to_day_all(item_index)

      this.nowTime = this.date_parse(`${item.date}`)

      this.change()
      this.set_doc_lists_update()
    },
    set_to_day_all (item_index) {
      this.set_to_day('week_list')
      this.set_to_day('week_list_prev')
      this.set_to_day('week_list_next')
      this.set_to_day('week_list_prev_week')
      this.set_to_day('week_list_next_week')
    },
    get_month (type) {
      let nowMonth = this.nowMonth
      let nowYear = this.nowYear
      let nowDay = this.nowDay

      if (type == 'prev') {
        if (nowMonth == 1) {
          nowMonth = 12
          nowYear = nowYear - 1
        } else {
          nowMonth--
        }
      } else if (type == 'next') {
        if (nowMonth == 12) {
          nowMonth = 1
          nowYear = nowYear + 1
        } else {
          nowMonth++
        }
      }

      const days = this.get_month_days(nowMonth, nowYear)
      if (nowDay > days) {
        nowDay = days
      }

      return this.date_parse(`${nowYear}-${nowMonth}-${nowDay}`)
    },

    date_parse (str) {
      return Date.parse(str.replace(/-(\d)(?!\d)/g, '-0$1'))
    },
    switch_month_week (type = 'next', update_week = false) {
      if (this.retract) {
        if (type == 'prev') {
          this.get_date(this.nowTime - 86400 * 7 * 1000)
        } else if (type == 'next') {
          this.get_date(this.nowTime + 86401 * 7 * 1000)
        }
        if (update_week) {
          this.update_swiper_item('week')
          this.set_doc_lists_update()
        }
      } else {
        this.get_date(this.get_month(type))
        this.update_swiper_item('month')
      }
      this.set_doc_lists_update()

      this.set_to_day_all()

      if (update_week) {
        this.change()
      }
    },
    update_swiper_item (type = 'month') {
      if (type == 'month') {
        if (this.current == 0) {
          this.change_date_month('next')
        } else if (this.current == 2) {
          this.change_date_month('prev')
        }
      } else if (type == 'week') {
        if (this.current == 0) {
          this.change_date_week('next')
        } else if (this.current == 2) {
          this.change_date_week('prev')
        }
      }
    },
    next () {
      this.get_date(this.next_date)
    },
    get_date (value = '', type = 'same') {
      let date = new Date()
      if (value) {
        date = new Date(value)
      }
      const nowMonth = date.getMonth() + 1
      const nowYear = date.getFullYear()
      const nowDay = date.getDate()
      const nowTime = date.getTime()
      const nowWeek = date.getDay()

      const days = this.get_month_days(nowMonth, nowYear)
      const start_date = new Date(nowYear, nowMonth - 1, 1)
      const end_date = new Date(nowYear, nowMonth - 1, days)
      const prev_date = new Date(start_date.getTime() - 1)
      const prev_date_days = prev_date.getDate()
      const next_date = new Date(end_date.getTime() + 86401 * 1000)
      const next_date_days = next_date.getDate()
      const start_week = start_date.getDay()
      const date_arrs = []

      const week_list = []
      let count_days = 35

      for (let i = prev_date_days - start_week + 1; i <= prev_date_days; i++) {
        date_arrs.push({
          day: i,
          type: 'prev',
          date: `${prev_date.getFullYear()}-${prev_date.getMonth() + 1}-${i}`
        })
      }

      for (let i = 1; i <= days; i++) {
        date_arrs.push({
          day: i,
          type: 'month',
          today: i == nowDay,
          date: `${nowYear}-${nowMonth}-${i}`
        })

        if (i == nowDay && type == 'same') {
          this.date = `${nowYear}-${nowMonth}-${i}`
        }
      }
      if (this.debug) {
        console.log(
          value,
          date,
          this.date,
          `${next_date.getFullYear()}-${next_date.getMonth() + 1}-${next_date.getDate()}`
        )
      }
      const date_arrs_length = date_arrs.length

      // if(date_arrs_length > 35){
      count_days = 42
      // }
      for (let i = 1; i <= count_days - date_arrs_length; i++) {
        date_arrs.push({
          day: i,
          type: 'next',
          date: `${next_date.getFullYear()}-${next_date.getMonth() + 1}-${i}`
        })
      }

      for (let i = 0; i < date_arrs.length / 7; i++) {
        const arr = []
        for (let j = 0; j < 7; j++) {
          if (date_arrs[i * 7 + j].today) {
            if (type == 'same') {
              this.to_week_index = i
            }
          }
          arr.push(date_arrs[i * 7 + j])
        }
        week_list.push(arr)
      }

      if (type == 'same') {
        this.week_list = week_list
        this.nowYear = nowYear
        this.nowMonth = nowMonth
        this.nowDay = nowDay
        this.nowTime = nowTime
        this.start_date = start_date
        this.end_date = end_date
        this.prev_date = prev_date
        this.next_date = next_date
      } else if (type == 'prev') {
        this.week_list_prev = week_list
      } else if (type == 'next') {
        this.week_list_next = week_list
      }
    },
    get_month_days (nowMonth, nowYear) {
      const month_arr = [1, 3, 5, 7, 8, 10, 12]
      let days = 0
      if (nowMonth == 2) {
        if (nowYear % 4 == 0) {
          days = 29
        } else {
          days = 28
        }
      } else if (month_arr.indexOf(nowMonth) >= 0) {
        days = 31
      } else {
        days = 30
      }
      return days
    }
  }
}
</script>

<style lang="scss">
@import '//at.alicdn.com/t/font_1730081_rg9g4ctfu1.css';

.date {
  width: 750rpx;
}
.head {
  display: flex;
  align-items: center;
  height: 100rpx;
  justify-content: center;
  border-bottom: 1rpx solid #f5f5f5;
  color: #333;
}
.head .title {
  width: 200rpx;
  font-size: 30rpx;
  text-align: center;
}
.head .icon {
  display: block;
}
.head .icon .next {
  transform: rotate(180deg);
  display: block;
}
.retract {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80rpx;
}
.retract .iconfont {
  transform: rotate(270deg);
}
.retract .iconfont.retract_icon {
  transform: rotate(90deg);
}
.date_dl {
  display: flex;
  width: 100%;
}
.date_dl .dd {
  flex: 1;
  text-align: center;
  height: 80rpx;
  font-size: 26rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}
.date_dl .dd .num {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  line-height: 60rpx;
}
.date_dl .dd .num.disabled {
  color: #f1f1f1;
}
.date_dl .dd .num.month {
  color: #333;
}
.date_dl .dd .num.today {
  background: #007aff;
  color: #fff;
}
.date_dl .dd .dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: #007aff;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

</style>
