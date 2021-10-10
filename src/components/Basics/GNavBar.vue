<template>
  <view class="nav-bar-container" :style="[navBarStyle]">
    <div class="navigation-box">
      <view class="navigation-status" :style="'height:' + statusBarHeight"></view>
      <view class="navigation-title" :style="'height:' + titleBarHeight+';line-height:'+titleBarHeight">{{ title }}</view>
      <view
        class="navigation-icon v-hover-opacity"
        :style="iconStyle"
        @click="handleClick"
        v-if="currentUrl !== homeUrl">
        <view :class="['iconfont', iconClass, 'icon-class']" />
      </view>
    </div>
  </view>
</template>

<script>
/**
 * 自定义导航栏组件
 * @namespace
 */
import { mapState } from 'vuex'
export default {
  name: 'GNavBar',
  props: {
    //  导航栏标题
    title: {
      type: String,
      default: ''
    },
    // 自定义样式
    customStyle: {
      type: Object,
      default: () => ({})
    },
    background: {
      type: String,
      default: ''
    },
    // 首页路径
    homeUrl: {
      type: String,
      default: '/pages/index/home'
    }
  },
  data () {
    return {
      statusBarHeight: '20px', // 状态栏高度
      titleBarHeight: '44px', // 标题栏高度
      pagesLength: 1, // 页面栈数量
      currentUrl: '', // 当前页面url
      iconClass: '' // 左边的icon icon-navigation_back icon-navigation_home
    }
  },
  computed: {
    ...mapState('app', {
      systemInfo: 'systemInfo'
    }),
    navBarStyle () {
      return {
        ...this.customStyle,
        background: this.background
      }
    },
    iconStyle () {
      return `width:${this.titleBarHeight};height:${this.titleBarHeight};top:${this.statusBarHeight}`
    }
  },
  created () {
    this.statusBarHeight = this.systemInfo.statusBarHeight + 'px'
    this.titleBarHeight = /iOS/.test(this.systemInfo.system) ? '44px' : '48px'
    this.pagesLength = getCurrentPages().length
    this.currentUrl = '/' + getCurrentPages()[this.pagesLength - 1].route
    this.iconClass = this.pagesLength > 1 ? 'icon-left-arrow' : 'icon-home'
  },
  methods: {
    handleClick () {
      if (this.pagesLength > 1) {
        uni.navigateBack({ delta: 1 })
      } else {
        uni.switchTab({ url: this.homeUrl })
      }
      this.$emit('handleClick')
    }
  }
}
</script>

<style scoped land="scss">
.nav-bar-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 99;
}
.navigation-box {
  width: 750rpx;
  position: relative;
  font-size: 18px;
}
.navigation-title {
  box-sizing: border-box;
  width: 100%;
  padding: 0 25%;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}
.navigation-icon {
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12rpx;
}
.icon-class {
  font-size: 22px;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  color: #333;
  background: #fff;
  border: 1px solid #ddd;
}
</style>
