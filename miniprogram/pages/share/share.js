var utils = require("../../utils/utils.js")
const db = wx.cloud.database();
const app = getApp();

Page({
  data: {
    imageTemplatePath: "/images/poster/share_poster_template01.png",
    imgBoxHeight: 0, //获取不同设备高度，以实现垂直居中
    card: {},
    height: app.globalData.isIPX ? '98px' : '64px',
  },

  onLoad: function(options) {
    // 初始化卡片数据
    var id = options.id
    var title = options.title
    var betweenDays = options.betweendays
    var targetDateStr = "目标日：" + options.targetdate + " " + options.week
    var imageTemplatePath = "/images/poster/share_poster_template01.png"
    var fontColor = "blue"
    if (betweenDays < 0) {
      title = title + "已经过去"
      betweenDays = -betweenDays
      imageTemplatePath = "/images/poster/share_poster_template02.png"
      fontColor = "red"
    } else {
      title = title + "还有"
    }
    this.setData({
      card: {
        title: title,
        betweenDays: betweenDays,
        targetDateStr: targetDateStr,
        imageTemplatePath: imageTemplatePath,
        fontColor: fontColor,
        id: id
      }
    })

    // 获取不同设备高度，以实现垂直居中
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          imgBoxHeight: res.windowHeight - 64
        })
      },
    })
  },

  onReady: function() {
    // 绘制图片
    const ctx = wx.createCanvasContext('sharePoster')
    ctx.drawImage(this.data.card.imageTemplatePath, 0, 0, 320, 414) //绘制模板
    // 绘制事件名
    ctx.beginPath()
    ctx.setFontSize(19)
    ctx.fillStyle = "#fff"
    ctx.setTextAlign('center');
    ctx.fillText(this.data.card.title, 160, 62, 200)
    ctx.closePath()
    // 绘制倒数日
    var color = this.data.card.fontColor;
    var betweenDays = this.data.card.betweenDays.toString();
    var betweenDaysArray = utils.getBetweenDaysArray(betweenDays, color);
    for (let item of betweenDaysArray) {
      ctx.drawImage(item.url, item.x, 132, item.width, 80)
    }
    // 绘制目标日
    ctx.beginPath()
    ctx.setFontSize(12)
    ctx.fillStyle = '#666666'
    ctx.setTextAlign('left')
    ctx.fillText(this.data.card.targetDateStr, 40, 275)
    ctx.closePath()
    ctx.draw();
    /* 分界线 */

  },


  // 生成并保存图片
  onSaveImage: function() {
    wx.canvasToTempFilePath({
      canvasId: 'sharePoster',
      x: 0,
      y: 0,
      width: 320,
      height: 414,
      destWidth: 1200,
      destHeight: 1552,
      fileType: "jpg",
      quality: 1,
      success: function(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function() {
            wx.showToast({
              title: "保存成功！",
              duration: 2000
            })
          }
        })
      }
    })
  },

  // 删除倒数日事件
  onDeleteCard: function() {
    var id = this.data.card.id
    wx.showModal({
      title: "确定删除？",
      success(res) {
        if (res.confirm) {
          // 更改数据库的deleteState值
          db.collection("event").doc(id).update({
            data: {
              deleteState: true
            }
          }).then(res => {
            console.log("删除成功，数据库已更新：" + res);
          }).catch(err => {
            console.log("删除失败：" + err);
          })
          // 返回首页
          wx.switchTab({
            url: '/pages/index/index',
            success: function(res) {
              let page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
            }
          })
        } else if (res.cancel) {}
      }
    })
  },

  // 编辑卡片
  onEditCard: function() {
    wx.navigateTo({
      url: '/pages/form/form?id=' + this.data.card.id,
      success: () => {}

    })

  },








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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '简单漂亮的倒数日工具',
      path: '/pages/index/index',
      imageUrl: '/images/other/share_img.png'
    }
  },
})