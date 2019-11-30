var utils = require("utils/utils.js")


App({
  globalData: {
    isIPX: false,
    cards: [],
    hasGetUserInfo: false,
    avatarUrl: '/images/icon/personal_icon/default_avatar.png',
    nickname: '点击登录',
  },

  onLaunch: function() {
    wx.hideTabBar();
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'product-wta0k',
        traceUser: false,
      })
    }

    // 判断是否iphoneX
    wx.getSystemInfo({
      success: (res) => {
        if (res.model.search("iPhone X") != -1) {
          this.globalData.isIPX = true
        }
      }
    })

    // 判断用户是否授权信息
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          this.globalData.hasGetUserInfo = true
          console.log('用户已授权个人信息')
        } else {
          console.log('用户未授权个人信息')
        }
      },
      fail: (res) => {
        console.log('wx.getSetting 接口调用失败')
      }
    })

    // 获取用户昵称和头像
    wx.getUserInfo({
      success: (res) => {
        this.globalData.nickname = res.userInfo.nickName
        this.globalData.avatarUrl = res.userInfo.avatarUrl
      },
      fail: (res) => {
        console.log('wx.getUserInfo 接口调用失败')
      }
    })

  },


  onShow: function() {},
})