<template>
  <div class="event-card">
    <div class="left v-hover-background" @click="handleClick">
      <div class="left-title text-overflow color-333"><text class="font-weight-bold">{{ item.title }}</text><text class="font-color-small-black">{{ ' '+nameEndStr }}</text></div>
      <div class="left-date text-overflow">目标日：{{ targetStr }}</div>
    </div>
    <div
      :class="['right', item.dayTimes < 0 ? 'bg-red' : 'bg-blue']"
      @click="handleRightClick">
      <view :class="['right-box', flipClass]">
        <view v-if="isTimesChinese" class="right-chinese-box">
          <view v-for="(item, index) in timesChineseArr" :key="index" style="padding: 0 1px">
              <text
                class="likeday-font"
                :style="timesChineseArr.length === 3? 'font-size:24px': 'font-size:32px'">
                {{ item.number }}
              </text>
              <text
                class="likeday-font"
                :style="timesChineseArr.length === 3 ? 'font-size:12px' : 'font-size:16px'"
                style="position: relative; top: -1px"
                >{{ item.text }}</text>
          </view>
        </view>
        <view v-else class="likeday-font" style="font-size: 34px">{{timesStr}}</view>
      </view>
    </div>
    <image
      src="/static/image/home/day_icon.png"
      class="day-icon"
      v-show="!isTimesChinese"/>
    <image
      src="/static/image/home/star_icon.png"
      class="star-icon"
      v-if="item.isTop"
    />
  </div>
</template>

<script>
/**
 * 倒数日组件
 */
export default {
  name: 'EventCard',
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      isTimesChinese: false, // 是否显示汉字形式的天数
      flipClass: ''
    }
  },
  computed: {
    nameEndStr () { // 事件名后缀
      let res = ''
      if (this.item.dayTimes === 0) {
        res = '就在今天'
      } else if (this.item.dayTimes > 0) {
        res = '还有'
      } else {
        res = '过去'
      }
      return res
    },
    targetStr ({ item }) {
      const { isLunar, week, solorDate, lunarDate } = item.targetDate || {}
      const weekList = ['日', '一', '二', '三', '四', '五', '六']
      const weekStr = `星期${weekList[week]}`
      const res = `${isLunar ? lunarDate : solorDate} ${weekStr}`
      return res
    },
    timesStr () {
      // 右边天数字符串
      const days = Math.abs(this.item.dayTimes)
      return days > 99999 ? '99999+' : days
    },
    timesChineseArr () {
      // 右边显示中文天信息
      const days = Math.abs(this.item.dayTimes)
      const year = Math.floor(days / 365)
      const month = Math.floor((days % 365) / 30)
      const day = (days - 365 * year) % 30
      const res = [
        { number: year, text: '年' },
        { number: month, text: '月' },
        { number: day, text: '天' }
      ].filter((item) => item.number)
      return year + month + day === 0 ? [{ number: 0, text: '天' }] : res
    }
  },
  methods: {
    handleClick () {
      this.$emit('handleClick', this.item)
    },
    handleRightClick () {
      this.flipClass = ''
      this.isTimesChinese = !this.isTimesChinese
      this.flipClass = 'flip-animation'
      setTimeout(() => {
        this.flipClass = ''
      }, 800)
      console.log('hhh')
    }
  }
}
</script>

<style lang="scss" scoped>
.event-card {
  position: relative;
  width: 100%;
  height: 64px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
  .left {
    width: 65%;
    height: 64px;
    box-sizing: border-box;
    padding: 0 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .left-title {
      font-size: 16px;
      line-height: 22px;
    }
    .left-date {
      color: #999;
      font-size: 12px;
      line-height: 18px;
    }
  }
  .right {
    width: 35%;
    height: 100%;
    .right-box {
      @include flex-center();
      width: 100%;
      height: 100%;
      color: #fff;
      .right-chinese-box {
        @include flex-center();
      }
    }
  }
  .bg-blue {
    background-image: linear-gradient(135deg, #0aaefe 0%, #495aff 100%);
  }
  .bg-red {
    background-image: linear-gradient(135deg, #ec8c69 0%, #ff4a52 100%);
  }
  .day-icon {
    position: absolute;
    bottom: 4px;
    right: 4px;
    width: 22px;
    height: 9px;
  }
  .star-icon {
    position: absolute;
    top: 0;
    right: 0;
    width: 26px;
    height: 26px;
  }
}
.flip-animation {
  animation-name: flipInX;
  animation-duration: 0.4s;
}
@keyframes flipInX {
  from {
    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    animation-timing-function: ease-in;
  }

  40% {
    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    animation-timing-function: ease-in;
  }

  60% {
    transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
  }

  80% {
    transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
  }

  to {
    transform: perspective(400px);
  }
}
</style>
