<template>
  <view class="tab-bar-box border-top" :class="isFixed ? 'fixed':''">
    <view class="tab-bar">
      <view v-for="(item, index) in tabList" class="tab-bar-item v-hover-opacity" @click="handleClick(item)" :key="index" hover-class="tab-bar-hover">
        <image v-if="index===1" :src="item.iconPath" class="add-image"/>
        <block v-else>
          <image :src="item.iconPath" class="icon-image"/>
          <view :class="item.textClass">{{item.text}}</view>
        </block>
      </view>
    </view>
    <view :class="{'is-iphonex':isIphoneX}"/>
  </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    isFixed: {
      type: Boolean,
      default: true
    }

  },
  data () {
    return {}
  },
  computed: {
    ...mapState('app', {
      isIphoneX: state => state.systemInfo.isIphoneX,
      tabBarIndex: state => state.systemInfo.tabBarIndex
    }),
    tabList ({ tabBarIndex }) {
      return [
        {
          pagePath: '/pages/index/home',
          iconPath: `/static/image/tab_bar/home_icon${tabBarIndex === 0 ? '_select' : ''}.png`,
          textClass: tabBarIndex === 0 ? 'font-color-main' : '',
          text: '首页',
          index: 0
        },
        {
          pagePath: '/pages/index/add',
          iconPath: '/static/image/tab_bar/add_icon.png',
          index: 1
        },
        {
          pagePath: '/pages/index/me',
          iconPath: `/static/image/tab_bar/me_icon${tabBarIndex === 2 ? '_select' : ''}.png`,
          textClass: tabBarIndex === 2 ? 'font-color-main' : '',
          text: '我的',
          index: 2
        }
      ]
    }
  },
  mounted () {
    const page = getCurrentPages()[0].route
    if (page === 'pages/index/home') {
      this.$store.dispatch('app/systemInfo', { tabBarIndex: 0 })
    }
    if (page === 'pages/index/me') {
      this.$store.dispatch('app/systemInfo', { tabBarIndex: 2 })
    }
  },
  methods: {
    handleClick ({ type, pagePath: url, index }) {
      if (index === this.tabBarIndex) {
        return
      }
      if (index === 0 || index === 2) {
        this.$store.dispatch('app/systemInfo', { tabBarIndex: index })
        uni.switchTab({ url })
        return
      }
      if (index === 1) {
        uni.navigateTo({ url })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$tabbar-height: 60px;
.tab-bar-box{
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: #fbfbfb;
}
.tab-bar{
  width: 100%;
  height: $tabbar-height;
  display: flex;
  justify-content: center;
  font-size: 12px;
  color: #808080;
  .tab-bar-item{
    width: 120px;
    height: $tabbar-height;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .icon-image{
      width: 26px;
      height: 26px;
    }
    .add-image{
      width: 47px;
      height: 32px;
    }
  }
}
.tab-bar-hover{
  background: #f1f1f1;
}
.fixed{
  position: fixed;
}
</style>
