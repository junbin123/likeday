<template>
  <view
    class="container"
    :catchtouchmove="isShowSidebar ? true:''"
    @touchstart="touchstart"
    @touchend="touchend">
    <view class="loading-box">
      <GLoading  v-model="isLoading" position="sbsolute"/>
    </view>
    <SwiperAnimate v-model="showGesture"/>
    <view class="tabbar-container" :style="isShowSidebar ? 'transform:translateX(68%)' : ''">
      <TabBar :isFixed="false"/>
    </view>
    <!-- 切换tab -->
    <view class="slide-container" :style="isShowSidebar ? 'transform:translateX(68%)' : ''">
      <HomeSlideTab
        :iconUrl="tabInfo.iconUrl"
        :title="tabInfo.title"
        :showLeftIcon="!isShowSidebar"
        @handleClickIcon="handleMenuClick"/>
    </view>
    <!-- 侧边栏 -->
    <HomeSidebar
      v-model="isShowSidebar"
      :selectIndex="tabIndex"
      :isBounce="isBounce"
      @handleClick="handleSideClick"/>
    <!-- 引导对话框 -->
    <view class="msg-tips-box" :style="[tipsStyle]">
      <GMsgTips
        v-if="false"
        :arrowDirect="tipsInfo.arrowDirect"
        :isAnimation="true"
        :arrowMove="tipsInfo.arrowMove">{{tipsInfo.title}}</GMsgTips>
    </view>

    <view class="event-container" :style="isShowSidebar ? 'transform:translateX(68%)' : ''">
      <view
        class="countdown-box"
        v-for="item in pageList"
        :key="item.id">
        <EventCard
          :item="item"
          @handleClick="handleEventClick"/>
      </view>
      <NoData v-if="!initLoading && pageList.length === 0"/>
      <view class="footer-text color-999 font-size-14 padding-top-20">{{footerText}}</view>
    </view>
  </view>
</template>

<script>
import HomeSlideTab from '@/components/Business/Home/HomeSlideTab'
import HomeSidebar from '@/components/Business/Home/HomeSidebar'
import GMsgTips from '@/components/Basics/GMsgTips'
import GLoading from '@/components/Basics/GLoading'
import TabBar from '@/components/tabBar.vue'
import EventCard from '@/components/Basics/EventCard'
import NoData from '@/components/Basics/NoData'
import SwiperAnimate from '@/components/Business/Home/SwiperAnimate'
import { mapState } from 'vuex'
import { getCountdownList, formatCountdown } from '@/app/service/countdown'
import { moveUserInfo, getUserInfo } from '@/app/service/user'
import { pagination } from '@/mixins/pagination'

export default {
  mixins: [pagination],
  components: {
    SwiperAnimate,
    NoData,
    EventCard,
    HomeSidebar,
    HomeSlideTab,
    GMsgTips,
    GLoading,
    TabBar
  },
  data () {
    return {
      showGesture: false, // 是否显示引导手势
      isBounce: false, // 是否侧边栏弹跳效果
      pageX: 0, // 滑动点
      params: {
        categoryId: ''
      },
      isLoading: true,
      tipsInfo: { // 对话框提示信息
        isShow: true,
        title: '分类管理管理',
        arrowDirect: 'top',
        arrowMove: '12px'
      },
      tabIndex: -1, // 当前选中的tab下标，-1表示全部
      isShowSidebar: false // 是否显示侧边栏
    }
  },
  computed: {
    ...mapState('app', {
      systemInfo: 'systemInfo',
      categoryList: (state) => state.userInfo.categoryList || [{ name: '', icon: 'icon-love' }],
      userInfo: (state) => state.userInfo
    }),
    footerText ({ pageList, initLoading, total, loading }) {
      if (!initLoading && loading) {
        return '加载中...'
      }
      if (pageList.length === total && !loading && pageList.length > 0) {
        return '到底了~'
      }
      return ''
    },
    tabInfo ({ tabIndex = -1, categoryList = [] }) {
      if (tabIndex === -1) {
        return {
          iconUrl: '/static/image/category/icon-home.png',
          title: '全部'
        }
      }
      return {
        iconUrl: `/static/image/category/${categoryList[tabIndex].icon}.png`,
        title: categoryList[tabIndex].name
      }
    },

    tipsStyle () {
      return {
        top: this.systemInfo.isIphoneX ? '90px' : '70px',
        left: '2px'
      }
    }
  },
  bus: {
    refreshHome ({ categoryId = '', isSwitch = true }) { // 刷新首页
      console.log('refreshHome==========', { categoryId })
      if ((categoryId !== this.params.categoryId) && isSwitch) {
        this.params.categoryId = categoryId
        this.tabIndex = this.categoryList.findIndex(item => item.id === categoryId)
      }
      uni.startPullDownRefresh()
    },
    categoryList (val) {
      // 修改categoryList后，更新tabIndex
      this.tabIndex = val.findIndex(item => item.id === this.params.categoryId)
      if (this.tabIndex === -1) {
        this.params.categoryId = ''
        this.getInitList(this.params)
      }
      console.log('tabIndex------------', this.tabIndex)
    }
  },
  async onLoad (options) {
    if (this.systemInfo.scene === 1154) {
      this.isLoading = false
      this.pageList = this.getPageListDefault() // 朋友圈显示默认倒数日
      return
    }
    const { moveUid, moveOpenid } = options
    await this.setMoveUserInfo({ moveUid, moveOpenid })
    const res = await this.getInitList(this.params)
    console.log(res, '==')
    this.isBounce = true
    this.showGesture = !uni.getStorageSync('hasShowGesture') && this.userInfo.isNew
    uni.showShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  onShow () {},
  onReady () {},
  onReachBottom () {
    if (!this.loading && this.pageList.length < this.total) {
      this.loadNextPage(this.params)
    }
  },
  onShareAppMessage (res) {
    return {
      title: '推荐一款好用的倒数日工具给你',
      imageUrl: 'https://img-blog.csdnimg.cn/d532dcf961304234a0b26287ad7ed617.png',
      path: '/pages/index/home'
    }
  },
  onPageScroll (res) {},
  onShareTimeline (res) {
    return {
      title: '一款好用的倒数日工具',
      imageUrl: 'https://img-blog.csdnimg.cn/034958bc386d46a98ce4d61678073375.png'
    }
  },
  onPullDownRefresh () {
    console.log('onPullDownRefresh--------------------')
    this.getInitList(this.params).then(res => {
      wx.stopPullDownRefresh()
    })
  },
  methods: {
    // 迁移用户数据
    async setMoveUserInfo ({ moveUid, moveOpenid }) {
      if (!moveUid || !moveOpenid) {
        return
      }
      uni.showLoading({
        title: '数据迁移中...',
        mask: true
      })
      try {
        const res = await moveUserInfo({ moveUid, moveOpenid })
        if (res.code === 0) {
          uni.showToast({ title: res.msg })
        } else {
          uni.showToast({ title: '迁移失败', icon: 'error' })
        }
        await getUserInfo()
        uni.hideLoading()
      } catch (err) {
        console.log(err)
        uni.showToast({ title: '迁移失败', icon: 'error' })
        uni.hideLoading()
      }
    },
    getPageListDefault () {
      const item = {
        isTop: true,
        repeatInfo: {
          name: '每 1 周重复',
          value: '1,2'
        },
        targetDate: {
          isLunar: false,
          lunarDate: '2021年八月初四',
          solorDate: '2021/9/10',
          week: 5
        },
        title: '距离周五'
      }
      return [formatCountdown(item)]
    },
    touchstart (e) {
      const pageX = e.changedTouches[0].pageX
      this.pageX = pageX
      console.log('touchstart', pageX)
    },
    touchend (e) {
      if (this.systemInfo.scene === 1154 || this.isLoading) {
        return
      }
      const delta = 60
      const pageX = e.changedTouches[0].pageX
      if (pageX - this.pageX > delta) {
        this.isBounce = false
        this.isShowSidebar = true
      }
      if (this.pageX - pageX > delta) {
        this.isShowSidebar = false
      }
    },
    async getList (params) {
      const res = await getCountdownList(params)
      this.isLoading = false
      return res
    },
    /**
     * 左上角icon点击事件
     */
    handleMenuClick () {
      this.isBounce = false
      this.isShowSidebar = true
    },
    /**
     * 事件卡片点击事件
     */
    handleEventClick (data) {
      const url = `/pages/index/detail?data=${encodeURIComponent(JSON.stringify(data))}`
      uni.navigateTo({ url })
    },
    /**
     * 侧边栏点击事件
     */
    async handleSideClick ({ index = -1 }) {
      this.isShowSidebar = false
      if (this.tabIndex === index) {
        return
      }
      this.tabIndex = index
      this.params = {
        categoryId: index === -1 ? '' : this.categoryList[index].id
      }
      uni.showLoading()
      await this.getInitList(this.params)
      uni.hideLoading()
    }
  }
}
</script>

<style lang="scss" scope>
.container{
  min-height: 100vh;
  background: #f1f2f3;
  padding-bottom: 200rpx;
}
.msg-tips-box{
  z-index: 2;
  position: fixed;
}
.countdown-box{
  padding-bottom: 20rpx;
}
.slide-container{
  top: 0;
  left: 0;
  right: 0;
  transition: all 0.3s ease-in-out;
  position: sticky;
  z-index: 9;
}
.tabbar-container{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  transition: all 0.3s ease-in-out;
  z-index: 9;
}
.event-container{
  padding: 20rpx;
  transition: all 0.3s ease-in-out;
}
.footer-text{
  text-align: center;
}
.loading-box{
  position: fixed;
  height: calc(100% - 60px);
  left: 0;
  right: 0;
  top: 0;
}
</style>
