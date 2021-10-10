<template>
  <view class="container">
    <view class="navigation-box" :style="customStyle">
      <view class="navigation-status" :style="'height:' + statusBarHeight"></view>
      <view class="navigation-title" :style="'height:' + titleBarHeight">{{ title }}</view>
      <view class="navigation-icon" :style="iconStyle">
        <text :class="['icon-font', iconName]"></text>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * 自定义导航栏组件
 * @namespace
 * @Author 伍俊滨
 * @Email junbin666@foxmail.com
 * @Date 2020-06-19 16:22:18
 * @LastEditors 伍俊滨
 * @LastEditTime 2020-06-19 16:22:18
 */
export default {
  name: 'CustomNavigation',
  props: {
    //  导航栏标题
    title: {
      type: String,
      default: '标题'
    },
    // 导航栏icon
    iconClass: {
      type: String,
      default: ''
    },
    // 自定义样式
    customStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      statusBarHeight: '20px', // 状态栏高度
      titleBarHeight: '44px', // 标题栏高度
      iconStyle: {} // icon 样式
    }
  },
  computed: {},
  created () {
    const systemInfo = uni.getSystemInfoSync()
    this.statusBarHeight = systemInfo.statusBarHeight + 'px'
    this.titleBarHeight = /iOS/.test(systemInfo.system) ? '44px' : '48px'
    this.iconStyle = `width:${this.titleBarHeight};height:${this.titleBarHeight};top:${this.statusBarHeight}`
  },
  onShow () {},
  onHide () {},
  onUnload () {},
  methods: {}
}
</script>

<style scoped>
.navigation-box {
  width: 750rpx;
  position: relative;
  background: #fff;
  color: #000;
}
.navigation-title {
  width: 750rpx;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.navigation-icon {
  position: absolute;
  left: 0;
}
</style>
