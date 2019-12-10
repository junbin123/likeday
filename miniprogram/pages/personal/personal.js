const db = wx.cloud.database();
var app = getApp();

Page({
  data: {
    section: [{
        title: "吐个槽",
        icon: "/images/icon/personal_icon/contact.png",
        line: true,
        openType: "",
        bindtap: "onTucaoMiniProgram"
      },
      {
        title: "关于开发者",
        icon: "/images/icon/personal_icon/developer.png",
        line: true,
        openType: "",
        bindtap: "onAboutMe"
      },
      {
        title: "邀请好友使用",
        icon: "/images/icon/personal_icon/share.png",
        line: false,
        openType: "share"
      }
    ],
    hasGetUserInfo: false,
    avatarUrl: app.globalData.avatarUrl,
    nickname: app.globalData.nickname,
  },


  onLoad: function(options) {
    this.getTabBar().setData({
      selected: 2
    })
    this.setData({
      avatarUrl: app.globalData.avatarUrl,
      nickname: app.globalData.nickname
    })
  },

  onShow: function() {
    this.getTabBar().setData({
      selected: 2
    })
  },

  onShareAppMessage: function() {
    return {
      title: '简单漂亮的倒数日工具',
      path: '/pages/index/index',
      imageUrl: '/images/other/share_img.png'
    }
  },

  onAboutMe: function(event) {
    wx.navigateTo({
      url: '/pages/personal/about-me/about-me',
    })
  },

  onTucaoMiniProgram: function() {
    wx.navigateToMiniProgram({
      appId: 'wx8abaf00ee8c3202e',
      extraData: {
        id: "108043",
        customData: {
          clientInfo: app.globalData.model,
          osVersion: app.globalData.system,
        }
      }
    })
  },

  bindGetUserInfo: function(event) {
    var avatarUrl = event.detail.userInfo.avatarUrl
    var nickname = event.detail.userInfo.nickName
    this.setData({
      avatarUrl: avatarUrl,
      nickname: nickname,
    })
    app.globalData.avatarUrl = avatarUrl
    app.globalData.nickname = nickname
  },
})