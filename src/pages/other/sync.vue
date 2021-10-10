<template>
  <view class="container page-container padding-top-30">
    <view class="padding-top-20 font-size-20 color-333 flex-center padding-bottom-20">此功能将在近期上线</view>
    <view class="content padding-left-30 padding-right-30 font-size-14 color-666 padding-top-50">
      <view class="padding-bottom-20">你好，LikeDay 发布过两个版本的小程序，一个是这个新版本，另一个下面这个老版本。</view>
      <ButtonItem
        name="点击跳转老版本"
        type="gray"
        size="small"
        @handleClick="handleJump"/>
      <view class="padding-bottom-20 padding-top-20">老版本由于被投诉无法使用「LikeDay 倒数日」这个名称，因此将在 2021 年 12 月 31 日下线。</view>
      <view class="padding-bottom-20 color-red">
        如果你在 2021 年 9 月 20 日之前使用过老版本小程序，近期我会开发一个功能，同步你之前创建的倒数日。
      </view>
      <view class="padding-bottom-20">欢迎关注！</view>
      <view class="padding-bottom-20">也可以添加我的微信，功能上线后，提醒你。(备注老用户)</view>
    </view>
    <image src="https://img-blog.csdnimg.cn/20210621043231736.png" :lazy-load="true" class="wx-img margin-top-30" @click="handleWeixin"></image>
    <view class="click-text font-size-12 color-999 flex-center">▲点击预览，保存图片</view>
  </view>
</template>

<script>
/**
 * 同步我之前的数据
 * @Author 伍俊滨
 * @Email junbin666@foxmail.com
 * @Date 2021-06-19
 */
// import GButton from '@/components/Basics/GButton'
import ButtonItem from '@/components/Basics/ButtonItem.vue'
export default {
  components: { ButtonItem },
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
    handleJump () {
      uni.navigateToMiniProgram({
        appId: 'wxe607a0b0977f67f3'
      })
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
.container{
  background: white;
  padding-bottom: 100rpx;
}
</style>
