var utils = require("utils/utils.js")


App({
  globalData: {
    isIPX: false,
    cards: [],
  },

  onLaunch: function() {
    wx.hideTabBar();
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'product-wta0k',
        traceUser: true,
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

  },


  onShow: function() {},


})