<template>
  <view class="page-container container">
    <TabBar />
    <view class="header-box flex padding-left-20">
      <image
        class="header-avatar margin-right-20"
        :src="userInfo.avatarUrl || 'https://img-blog.csdnimg.cn/f700769de9414b118a0ca52fd20a27c0.png'"
        :lazy-load="true"
        mode="aspectFill"
      ></image>
      <view class="header-content flex flex-column justify-center" @click="handleUserInfo">
        <view class="header-name color-black font-size-24 font-weight-bolder"
          >{{userInfo.nickName || '点击授权'}}</view
        >
        <view class="header-btn flex-center font-size-10" hover-class="hover-color-ddd">
          <text class="iconfont icon-update font-size-12"/>
          更新个人信息
        </view>
      </view>
    </view>

    <view class="overflow border-radius-4 box-shadow">
      <MeCell iconName="icon-category" title="分类管理" value="点击管理" data="cate" :isBorderBottom="true" @click="handleCellClick"/>
      <MeCell iconName="icon-delete" title="已删除的倒数日" value="点击查看" data="delete" @click="handleCellClick"/>
    </view>

    <view class="overflow border-radius-4 box-shadow margin-top-30">
      <MeCell iconName="icon-account" title="关于开发者" value="联系我" data="developer" :isBorderBottom="true" @click="handleCellClick"/>
      <MeCell iconName="icon-share" title="推荐给好友" value="点击分享" data="share" @click="handleCellClick"/>
    </view>

    <view class="overflow border-radius-4 box-shadow margin-top-30">
      <MeCell iconName="icon-feedback" title="吐个槽" data="tugecao" @click="handleCellClick"/>
    </view>

    <!-- <view class="overflow border-radius-4 box-shadow margin-top-30">
      <MeCell iconName="icon-update" title="同步我之前的数据" data="sync" @click="handleCellClick"/>
    </view> -->

    <!-- <button @click="deleteUser">删除用户</button> -->

    <view class="footer-box flex-center" @longpress="handleCopy">
      <image src="/static/image/common/likeday-logo.png" :lazy-load="true" class="footer-img relative margin-left-20 margin-right-20"/>
    </view>

    <!-- 分享弹窗 -->
    <SharePop v-model="sharePop"/>
  </view>
</template>

<script>
/**
 * 我的页面
 */
import MeCell from '@/components/Basics/MeCell'
import { updateUserInfo, deleteUser } from '@/app/service/user.js'
import SharePop from '@/components/Basics/SharePop' // 分享弹窗
import TabBar from '@/components/tabBar.vue'
import { mapState } from 'vuex'
import login from '@/app/request/login.js'
export default {
  components: {
    MeCell,
    SharePop,
    TabBar
  },
  data () {
    return {
      sharePop: false, // 是否显示分享弹窗
      isLoading: false
    }
  },
  computed: {
    ...mapState('app', {
      userInfo: (state) => state.userInfo,
      systemInfo: (state) => state.systemInfo
    })

  },
  watch: {},
  async onLoad (options) {
    if (!this.userInfo?.uid) {
      await login()
    }
  },
  onShow () {},
  onHide () {},
  onUnload () {},
  onPullDownRefresh () {},
  onReachBottom () {},
  onShareTimeline () {
    return {
      title: '一款好用的倒数日工具给你',
      query: '',
      imageUrl: 'https://img-blog.csdnimg.cn/23a498a1e3144ba3b9af1887a29335e3.png'
    }
  },
  onShareAppMessage (e) {
    return {
      title: '推荐一款好用的倒数日工具给你',
      imageUrl: 'https://img-blog.csdnimg.cn/d532dcf961304234a0b26287ad7ed617.png',
      path: '/pages/index/home'
    }
  },
  methods: {
    handleCopy () {
      uni.setClipboardData({
        data: this.userInfo.uid,
        success: () => {
          uni.showToast({ title: '已复制', icon: 'none' })
        }
      })
    },
    deleteUser () {
      wx.showModal({
        title: '确定删除？',
        confirmText: '删除',
        confirmColor: '#E33636',
        success: async (res) => {
          if (res.cancel) {
            return
          }
          await deleteUser()
          uni.showToast({ title: '已删除' })
        }
      })
    },
    handleCellClick (data) {
      const eventDict = {
        sync: () => {
          const url = '/pages/other/sync'
          uni.navigateTo({ url })
        },
        cate: () => {
          const url = '/pages/edit/category'
          uni.navigateTo({ url })
        },
        delete: () => {
          const url = '/pages/edit/deleteList'
          uni.navigateTo({ url })
        },
        developer: () => {
          const url = '/pages/other/about'
          uni.navigateTo({ url })
        },
        share: () => {
          this.sharePop = true
        },
        tugecao: () => {
          uni.navigateToMiniProgram({
            appId: 'wx8abaf00ee8c3202e',
            extraData: {
              id: '108043',
              customData: {
                clientInfo: this.systemInfo.model,
                os: this.systemInfo.system,
                customInfo: this.userInfo.uid
              }
            }

          })
        }
      }
      eventDict[data] && eventDict[data]()
      console.log(data)
    },
    handleUserInfo () {
      updateUserInfo().then(res => {
        console.log('更新用户信息', res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding-top: 140rpx;
  .header-box {
    margin-bottom:80rpx;
    height: 60px;
    .header-avatar {
      width: 60px;
      height: 100%;
      border-radius: 50%;
    }
    .header-content {
      height: 100%;
      .header-btn {
        height: 20px;
        width: 86px;
        color: #243949;
        border-radius: 4px;
        box-shadow: inset 0 0 0 0.6px #243949;
        margin-top: 2px;
      }
    }
  }
  .footer-box{
    width: 100%;
    height: 28px;
    padding-top: 100rpx;
    .footer-img{
      width: 99px;
      height: 28px;
    }
    .footer-logo{
      font-size: 26px;
      color: #d1d2d3;
    }
    &:before{
      content: '';
      width: 60rpx;
      border-top: 1px solid #d1d2d3;
    }
    &:after{
      content: '';
      width: 60rpx;
      border-top: 1px solid #d1d2d3;
    }
  }

  .logo-box{
    font-size: 30px;
    color: #ccc;
  }
}
</style>
