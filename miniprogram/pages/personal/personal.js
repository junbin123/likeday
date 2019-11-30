const db = wx.cloud.database();
var app = getApp();

Page({
  data: {
    section: [{
        title: "意见反馈",
        icon: "/images/icon/personal_icon/contact.png",
        line: true,
        openType: "feedback"
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
    nickname: app.globalData.nickname
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