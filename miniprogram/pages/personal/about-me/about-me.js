const app = getApp()
Page({

  data: {
    canUseHeight: 0,
    btnHeight: app.globalData.isIPX ? 98 : 64,
  },

  onLoad: function(options) {
    // 获取不同设备高度，以实现垂直居中
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          canUseHeight: res.windowHeight - this.data.btnHeight
        })
      },
    })
  },


  onCopyWechat: function() {
    wx.setClipboardData({
      data: 'abcmeego',
      success(res) {
        wx.getClipboardData({
          success(res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  onShareAppMessage: function() {
    return {
      title: '简单漂亮的倒数日工具',
      path: '/pages/index/index',
      imageUrl: '/images/other/share_img.png'
    }
  },


})