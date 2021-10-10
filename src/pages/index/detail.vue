<template>
  <view class="container flex-center flex-column">
    <image
      class="container-bg"
      mode="aspectFill"
      src="https://images.unsplash.com/photo-1633130285991-6fdd6a44c204?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1453&q=80"
    ></image>
    <CountdownCard :item="countdownInfo"/>
    <!-- <view class="share-image">
      <LoadingImage
        width="600rpx"
        height="776rpx"
        :src="tempFilePath"
        @handleClick="handleImageClick"
      />
    </view> -->
    <view class="click-text font-size-14 color-999 flex-center"
      >▲点击预览，保存图片</view
    >

    <canvas class="poster-canvas" canvas-id="posterCanvas"></canvas>
    <canvas class="number-canvas" canvas-id="numberCanvas"></canvas>
    <canvas class="card-canvas" canvas-id="cardCanvas"></canvas>

    <!-- <ButtonList :buttonList="buttonList" @handleClick="handleBtnClick" /> -->
  </view>
</template>

<script>
/**
 *  事件详情页
 */
import CanvasContext from '@/utils/canvas.js'
import { getTitleTextInfo } from '@/utils/poster.js'
import { getStrLength } from '@/utils/base.js'
import { archiveCountdown } from '@/app/service/countdown.js'
// import LoadingImage from '@/components/Basics/LoadingImage.vue'
import CountdownCard from '@/components/Business/Common/CountdownCard.vue'
import login from '@/app/request/login.js'
import { mapState } from 'vuex'
// import ButtonList from '@/components/Basics/ButtonList.vue'
export default {
  components: { CountdownCard },
  data () {
    return {
      countdownInfo: {}, // 事件信息
      dayCountUrl: '', // 天数图片
      numberInfo: {}, // 天数图片中间数字渲染数据
      renderInfo: {
        // 渲染用数据
        title: '我是标题',
        dayCount: 23,
        targetStr: '目标日：2021/01/01 星期五',
        qrCode: '',
        type: 'blue'
      },
      tempFilePath: '', // 图片本地地址
      shareCardUrl: '' // 分享小程序卡片图片
    }
  },
  computed: {
    ...mapState('app', {
      isIphoneX: (state) => state.systemInfo.isIphoneX,
      uid: (state) => state.userInfo.uid,
      nickName: (state) => state.userInfo.nickName
    }),
    isCreator ({ countdownInfo, uid }) {
      return countdownInfo?.uid === uid
    },
    buttonList ({ isCreator }) {
      if (isCreator) {
        return [
          { type: 'danger', name: '删除', label: 'delete', width: '158rpx' },
          { type: 'gray', name: '编辑', label: 'edit', width: '158rpx' },
          { type: 'default', name: '分享', openType: 'share', width: '338rpx' }
        ]
      } else {
        return [
          {
            type: 'gray',
            name: '复制',
            label: 'copy'
          },
          {
            type: 'default',
            name: '分享',
            openType: 'share'
          }
        ]
      }
    }
  },
  async onLoad (options) {
    if (!this.uid) {
      login()
    }
    this.countdownInfo = JSON.parse(decodeURIComponent(options.data))
    this.renderInfo = await this.getRenderInfo()
    const numberOptions = {
      dayCount: this.renderInfo.dayCount,
      type: this.renderInfo.type
    }
    const { tempFilePath, numberInfo } = await this.renderNumber(numberOptions)
    this.dayCountUrl = tempFilePath
    this.numberInfo = numberInfo
    this.renderPoster()
    this.renderCard()
  },
  onShow () {},
  onHide () {},
  onUnload () {},
  onPullDownRefresh () {},
  onReachBottom () {},
  onShareAppMessage (e) {
    const path = `/pages/index/detail?data=${encodeURIComponent(
      JSON.stringify(this.countdownInfo)
    )}`
    return {
      title: `${this.nickName || '我'} 分享一个倒数日给你`,
      imageUrl: this.shareCardUrl,
      path
    }
  },
  methods: {
    async getRenderInfo () {
      const { title = '', dayTimes = 0 } = this.countdownInfo
      const { isLunar, week, solorDate, lunarDate } =
        this.countdownInfo.targetDate
      const weekList = ['日', '一', '二', '三', '四', '五', '六']
      const weekStr = `星期${weekList[week]}`
      const targetStr = isLunar
        ? `目标日：${lunarDate}`
        : `目标日：${solorDate} ${weekStr}`
      return {
        title,
        dayCount: Math.abs(dayTimes),
        targetStr,
        qrCode: '',
        type: dayTimes >= 0 ? 'blue' : 'red'
      }
    },
    handleBtnClick ({ label, ...item }) {
      console.log('handleBtnClick', item)
      if (label === 'edit') {
        const url = `/pages/index/add?eventInfo=${encodeURIComponent(
          JSON.stringify(this.countdownInfo)
        )}&id=${this.countdownInfo.id}`
        uni.navigateTo({ url })
        return
      }
      if (label === 'delete') {
        uni.showModal({
          content: '确定删除这个倒数日吗？',
          cancelText: '取消',
          confirmText: '删除',
          confirmColor: '#E33636',
          success: (res) => {
            if (res.confirm) {
              archiveCountdown({ ...this.countdownInfo, isArchive: true }).then(
                (result) => {
                  uni.showToast({
                    title: result.msg,
                    icon: 'none'
                  })
                  const timer = setTimeout(() => {
                    uni.switchTab({ url: '/pages/index/home' })
                    this.$bus('refreshHome', { isSwitch: false })
                    clearTimeout(timer)
                  }, 300)
                }
              )
            } else if (res.cancel) {
            }
          }
        })
      }
      if (label === 'copy') {
        const { id, ...data } = this.countdownInfo
        const url = `/pages/index/add?eventInfo=${encodeURIComponent(
          JSON.stringify(data)
        )}`
        uni.navigateTo({ url })
      }
    },
    handleImageClick () {
      if (this.tempFilePath) {
        uni.previewImage({
          current: this.tempFilePath,
          urls: [this.tempFilePath],
          complete: (res) => {
            console.log(res, '预览')
          }
        })
      } else {
        uni.showToast({ title: '图片加载中', icon: 'none' })
      }
    },
    // 渲染分享卡片图
    async renderCard () {
      let ctx = new CanvasContext('cardCanvas', {
        width: 420,
        height: 336
      })
      ctx
        .image({
          url:
            this.renderInfo.type === 'blue'
              ? '/static/image/poster/blue-card.png'
              : '/static/image/poster/red-card.png',
          x: 0,
          y: 0,
          width: 420,
          height: 336
        })
        .image({
          // 渲染天数
          url: this.dayCountUrl,
          x: 32,
          y: 126,
          width: 320,
          height: 148
        })

      const dayXYDict = {
        // 根据天数长度，获取「天」字渲染x、y值
        1: {
          width: 43,
          height: 40,
          x: 228,
          y: 202
        },
        2: {
          width: 43,
          height: 40,
          x: 268,
          y: 202
        },
        3: {
          width: 43,
          height: 40,
          x: 300,
          y: 202
        },
        4: {
          width: 43,
          height: 40,
          x: 332,
          y: 202
        },
        5: {
          width: 34,
          height: 32,
          x: 354,
          y: 204
        },
        6: {
          width: 34,
          height: 32,
          x: 354,
          y: 200
        }
      }
      const {
        x = 354,
        y = 194,
        width = 34,
        height = 32
      } = dayXYDict[String(this.renderInfo.dayCount).length] || {}
      ctx.image({
        // 渲染「天」字
        url:
          this.renderInfo.type === 'blue'
            ? 'https://img-blog.csdnimg.cn/20210627234220616.png'
            : 'https://img-blog.csdnimg.cn/20210627234216550.png',
        x,
        y,
        width,
        height
      })
      ctx = this.renderTitle({ ctx, x: 210, top: 20, maxWidth: 290 })
      ctx.draw().then((res) => {
        this.shareCardUrl = res.tempFilePath
      })
    },
    // 渲染海报
    async renderPoster () {
      let ctx = new CanvasContext('posterCanvas', {
        width: 375,
        height: 485
      })
      ctx
        .image({
          url:
            this.renderInfo.type === 'blue'
              ? '/static/image/poster/blue-poster.png'
              : '/static/image/poster/red-poster.png',
          x: 0,
          y: 0,
          width: 375,
          height: 485
        })
        .text({
          x: 44,
          y: 304,
          text: this.renderInfo.targetStr,
          font: 'normal 16px sans-serif',
          textAlign: 'left',
          color: '#666'
        })
        // .image({  TODO:绘制小程序码的
        //   url: this.renderInfo.qrCode,
        //   x: 20,
        //   y: 392,
        //   width: 76,
        //   height: 76
        // })
        .image({
          url: this.dayCountUrl,
          x: 30,
          y: 128,
          width: 315,
          height: 163
        })
      // 渲染标题
      ctx = this.renderTitle({ ctx, x: 187 })
      ctx.draw().then((res) => {
        this.tempFilePath = res.tempFilePath
      })
    },
    /**
     * 渲染天数图片，450*233px，依赖<canvas>
     * @param {Number} dayCount 天数，支持6位数及以下
     * @param {type} type 颜色类型 blue、red
     */
    renderNumber ({ dayCount = 0, type = 'blue' }) {
      const dayLength = String(dayCount).length
      const width = 450
      const height = 233
      const imageOverlapWidth = dayLength - 1 // 所有数字图片重叠的宽度
      const ctx = new CanvasContext('numberCanvas', {
        width,
        height
      })

      // 每个数字都能最大显示的情况
      let imageHeight = 233
      let imageWidth = 96
      let imageBoxWidth = dayLength * imageWidth - imageOverlapWidth // 数字图片总宽
      let firstImageX = (width - imageBoxWidth) / 2
      let firstImageY = 0

      // 每个数字需要等比缩放的情况
      if (dayLength * 96 > width) {
        imageWidth = width / dayLength
        imageHeight = (233 / 96) * imageWidth
        imageBoxWidth = width - imageOverlapWidth
        firstImageX = (width - imageBoxWidth) / 2
        firstImageY = (233 - imageHeight) / 2
      }

      const imageOptions = {
        y: firstImageY,
        width: imageWidth,
        height: imageHeight
      }

      ctx
        // .box({ // 开启显示底色
        //   backgroundColor: '#f9f9f9',
        //   x: 0,
        //   y: 0,
        //   width,
        //   height
        // })
        .box({
          backgroundColor: type === 'blue' ? '#495aff' : '#ff4a52',
          x: firstImageX + 1,
          y: firstImageY + 1,
          width: imageBoxWidth - 2,
          height: imageHeight - 2
        })

      String(dayCount)
        .split('')
        .forEach((item, index) => {
          ctx.image({
            ...imageOptions,
            x: firstImageX + index * imageWidth - index, // 每个图片盖住前一个图片一像素
            url: `/static/image/number/${item}.png`
          })
        })
      return new Promise((resolve) => {
        ctx.draw().then((res) => {
          const numberInfo = {
            // 数字尺寸数据
            width: imageBoxWidth,
            heihgt: imageHeight
          }
          resolve({ ...res, numberInfo })
        })
      })
    },
    /**
     * 渲染标题
     * @param {CanvasContext} ctx new CanvasContext对象
     */
    renderTitle ({ ctx, x, maxWidth = 275, top = 27 }) {
      const title =
        this.renderInfo.title +
        (this.renderInfo.type === 'blue' ? '还有' : '过去')
      const { fontSize, rows, sliceIndex } = getTitleTextInfo(
        getStrLength(title)
      )
      const options = {
        maxWidth,
        font: `normal bold ${fontSize}px sans-serif`,
        textAlign: 'center',
        color: '#fff',
        text: title,
        x
      }
      if (rows === 1) {
        const y = top + (90 - fontSize) / 2
        ctx.text({ ...options, y })
      }
      if (rows === 2) {
        const title1 = title.slice(0, sliceIndex / 2)
        const title2 = title.slice(sliceIndex / 2)
        const y1 = top + (90 - fontSize * 2 - 8) / 2
        const y2 = top + (90 - fontSize * 2 - 8) / 2 + fontSize + 8
        ctx.text({
          ...options,
          text: title1,
          y: y1
        })
        ctx.text({
          ...options,
          text: title2,
          y: y2
        })
      }
      return ctx
    },
    handleSave () {
      uni.saveImageToPhotosAlbum({
        filePath: this.tempFilePath,
        success: () => {
          uni.showToast({
            title: '保存成功'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  width: 100%;
}
.container-bg {
  left: 0;
  top: 0;
  position: fixed;
  width: 100vw;
  height: 100vh;
  // -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.poster-canvas {
  width: 375px;
  height: 485px;
  position: fixed;
  left: -5000px;
}
.img-item {
  width: 300px;
  height: 388px;
}
.number-canvas {
  width: 450px;
  height: 233px;
  position: fixed;
  left: -5000px;
}
.card-canvas {
  width: 420px;
  height: 336px;
  position: fixed;
  left: -5000px;
}
.btn-box {
  padding: 0 24rpx;
  width: 100%;
  height: 72px;
  @include flex-between();
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  .btn-item {
    width: 50%;
  }
  .btn-left {
    padding-right: 12rpx;
  }
  .btn-right {
    padding-left: 12rpx;
  }
}
.share-image {
  width: 600rpx;
  height: 776rpx;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.06);
  position: relative;
  left: 50%;
  margin-left: -300rpx;
}
.click-text {
  height: 50px;
  line-height: 50px;
}
</style>
