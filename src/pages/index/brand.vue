<template>
  <view class="container">
    <!-- 主页背景区域 -->
    <view class="brand-bg">
      <view class="brand-bg-box">
        <image
          src="https://i.loli.net/2020/07/14/VkzmuTYIvK85ct9.jpg"
          class="brand-bg-img"
          mode="aspectFill"
        />
      </view>
      <!-- <view class="brand-text">
        <view class="status-bar"></view>
        <view class="title-bar">伍俊滨</view>
      </view> -->
      <CustomNavigation />
    </view>
    <view> </view>
    <!-- 主页数据模块 -->
    <view class="brand-info"></view>
    <!-- 主页金刚区模块 -->
    <view class="brand-setting"></view>
    <!-- tabbar 组件 -->

    <!-- 正在抽奖模块 -->
    <view class="brand-lottery--ing"></view>
    <!-- 往期抽奖模块 -->
    <view class="brand-lottery--has"></view>
    <!-- 锦鲤晒单模块 -->
    <view class="brand-fish"></view>
    <!-- 品牌介绍模块 -->
    <view class="brand-intro"></view>
  </view>
</template>

<script>
/**
 * 品牌主页
 * @namespace
 * @Author 伍俊滨
 * @Email junbin666@foxmail.com
 * @Date 2020-06-19 16:22:18
 * @LastEditors 伍俊滨
 * @LastEditTime 2020-06-19 16:22:18
 */
import CustomNavigation from '@/components/CustomNavigation.vue'
export default {
  components: {
    CustomNavigation
  },
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
      title: '',
      imageUrl: '',
      path: ''
    }
  },
  methods: {}
}
</script>

<style scoped>
.container {
  position: relative;
}
.brand-bg-box {
  width: 100%;
  height: 270px;
  position: absolute;
  overflow: hidden;
}
.brand-bg-img {
  width: 100%;
  height: 270px;
  display: block;
  position: absolute;
  left: 0;
  top: 0;
}

.brand-bg-img:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 270px;
  background: rgba(0, 0, 0, 0.3);
}
.brand-bg-img:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 270px;
  backdrop-filter: blur(30px);
}
.brand-text {
  position: absolute;
}
</style>
