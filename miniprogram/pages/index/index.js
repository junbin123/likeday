var utils = require("../../utils/utils.js");
const db = wx.cloud.database();
const app = getApp();

Page({
  data: {
    cards: [],
    canUseHeight: 0,
    hasGetUserInfo: true,
    emptyState: true,
  },
  onShareAppMessage: function() {
    return {
      title: '简单漂亮的倒数日工具',
      path: '/pages/index/index',
      imageUrl: '/images/other/share_img.png'
    }
  },

  onLoad() {
    this.getTabBar().setData({
      selected: 0
    })
    this.requestEventData(); //请求event集合数据
    utils.getNumberFont()
    // this.deleteMyData()
  },

  onShow: function() {
    this.getTabBar().setData({
      selected: 0
    })
    this.requestEventData(); //请求event集合数据
  },

  onPullDownRefresh: function() {
    this.onShow();
    wx.stopPullDownRefresh()
  },

  // 点击卡片事件
  onCardTap: function(event) {
    var title = event.currentTarget.dataset.title;
    var betweenDays = event.currentTarget.dataset.betweendays;
    var targetdate = event.currentTarget.dataset.targetdate;
    var week = event.currentTarget.dataset.week;
    var id = event.currentTarget.dataset.id;
    var url = '/pages/share/share?title=' + title + '&betweendays=' + betweenDays + '&targetdate=' + targetdate + '&week=' + week + '&id=' + id;
    wx.navigateTo({
      url: url,
      success: function(res) {
        console.log(res)
      },
      fail: function(res) {
        console.log(res)
      },
      complete: function(res) {},
    })
  },

  // 请求event集合数据
  requestEventData() {
    db.collection('event').where({
        deleteState: false
      })
      .get({
        success: (res) => {
          var cards = utils.setTopCard(res.data);
          // 重复事件，目标日更新
          cards = cards.map(item => {
            item.newTargetDate = utils.resetTargetDate(item.targetDate, parseInt(item.repeat))
            item.newWeek = utils.getWeekStr(item.newTargetDate)
            item.betweenDays = utils.daysBetween(item.newTargetDate);
            return item
          })
          // console.log(cards)
          this.setData({
            cards: cards,
            canUseHeight: cards.length * 80 + 56,
            emptyState: cards.length ? false : true
          })
          app.globalData.cards = cards
        }
      })
  },

  // 批量删除我的数据
  deleteMyData() {
    wx.cloud.callFunction({
      name: "batchDelete"
    }).then(res => {
      console.log("批量删除云函数调用成功" + res);
    }).catch(err => {
      console.log("批量删除云函数调用失败" + err);
    })
  },

})