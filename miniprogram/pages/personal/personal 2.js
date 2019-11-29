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
    avatarUrl: "/images/icon/personal_icon/default_avatar.png",
    nickName: "显示微信头像，点我登录"
  },


  onLoad: function(options) {
    this.getTabBar().setData({
      selected: 2
    })

    // 检查用户是否授权个人信息
    wx.getUserInfo({
      success: res => {
        this.setData({
          hasGetUserInfo: true,
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName
        })
        // app.globalData.hasGetUserInfo = true
        console.log(res.userInfo)
      },
      fail: res => {
        this.setData({
          hasGetUserInfo: false,
          avatarUrl: "/images/icon/personal_icon/default_avatar.png",
          nickName: "显示微信头像，点我登录"
        })
        // app.globalData.hasGetUserInfo = false
      }
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

  // 新用户信息添加到数据库user
  onGetUserInfo: function(event) {
    var userInfo = event.detail.userInfo;
    db.collection("user").add({
      data: {
        avatarUrl: userInfo.avatarUrl,
        city: userInfo.city,
        country: userInfo.country,
        gender: userInfo.gender,
        language: userInfo.language,
        nickName: userInfo.nickName,
        province: userInfo.province,
      },
      success: function(res) {
        console.log("用户信息获取成功" + res);

      },
      fail: function(err) {
        console.log("用户信息获取失败" + err);
      }
    })
    this.setData({
      avatarUrl: userInfo.avatarUrl,
      nickName: userInfo.nickName
    })
  },

  onAboutMe: function(event) {
    wx.navigateTo({
      url: '/pages/personal/about-me/about-me',
    })
  },

})