<template>
  <view class="container page-container padding-top-30">
    <image src="/static/image/common/likeday-logo.png" :lazy-load="true" class="logo-img relative margin-bottom-30"/>
    <view class="content padding-left-30 padding-right-30 font-size-16 color-333">
      <view class="padding-bottom-20">LikeDay，一款简单好用的倒数日工具。</view>
      <view class="padding-bottom-20">帮助你管理日常中重要的日子，让生活井井有条。</view>
      <view class="padding-bottom-20">对 LikeDay 感兴趣，欢迎添加我的微信。</view>
    </view>
    <image src="https://img-blog.csdnimg.cn/20210621043231736.png" :lazy-load="true" class="wx-img margin-top-30" @click="handleWeixin"></image>
    <view class="click-text font-size-12 color-999 flex-center">▲点击预览，保存图片</view>

    <!-- <GButton :isBottom="true" name="鼓励开发者" @handleClick="handleClick"/> -->
  </view>
</template>

<script>
/**
 * 关于我页面
 * @Author 伍俊滨
 * @Email junbin666@foxmail.com
 * @Date 2021-06-19
 */
// import GButton from '@/components/Basics/GButton'
export default {
  // components: { GButton },
  data () {
    return {}
  },
  computed: {},
  onLoad (options) {},
  onShow () {},
  onHide () {},
  onUnload () {},
  onPullDownRefresh () {},
  onReachBottom () {},
  onShareAppMessage (e) {
    return {
      title: '推荐一款好用的倒数日工具给你',
      imageUrl: 'https://img-blog.csdnimg.cn/d532dcf961304234a0b26287ad7ed617.png',
      path: '/pages/index/home'
    }
  },
  methods: {
    handleClick () {
      // TODO:跳转客服，自动回复图片
      // 'https://img-blog.csdnimg.cn/20210621045908275.png'
    },
    handleWeixin () {
      uni.previewImage({
        urls: ['https://img-blog.csdnimg.cn/20210621043231736.png']
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.logo-img{
  width: 106px;
  height: 30px;
  display: block;
  position: relative;
  left: 50%;
  margin-left: -53px;
}
.content{
  line-height: 22px;
}
.wx-img{
  width: 400rpx;
  height: 532rpx;
  display: block;
  position: relative;
  left: 50%;
  margin-left: -200rpx;
}
.click-text{
  height: 30px;
  line-height: 30px;
}
</style>
