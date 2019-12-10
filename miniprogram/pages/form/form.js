const utils = require("../../utils/utils.js")
const db = wx.cloud.database();
const app = getApp();

Page({
  data: {
    repeatArr: ['不重复', '每天重复', '每周重复', '每月重复', '每年重复'],
    id: "",
    title: '',
    targetDate: '',
    targetDateSolar: '',
    targetDateLunar: '',
    targetDateStr: '请选择日期',
    isLunar: false,
    category: 0,
    top: false,
    repeat: 0,
  },

  onLoad: function(options) {
    // 编辑操作，根据事件id获取数据
    if (options.id) {
      var card = app.globalData.cards.find((item, index, arr) => {
        return item._id === options.id
      })
      this.setData({
        id: options.id,
        title: card.title,
        targetDate: card.targetDate,
        targetDateStr: card.targetDateStr,
        isLunar: card.isLunar,
        top: card.top,
        repeat: card.repeat,
      })
    }
  },

  // 事件名输入
  bindTitleConfirm: function(event) {},

  // 目标日输入
  showDatepicker: function() {
    this.selectComponent("#ruiDatepicker").init({
      date: '',
      showHour: false,
      confirm: false
    });
  },

  dateConfirm: function(event) {
    var date = event.detail
    console.log(date)
    this.setData({
      targetDate: utils.formatDateTemp(date.year, date.month, date.day),
      targetDateSolar: date.solarStr,
      targetDateLunar: date.lunarStr,
      targetDateStr: date.thisStr,
      isLunar: date.lastTab === "lunar" ? true : false,
    })
  },

  // 置顶设置
  bindTopChange: function(event) {
    this.setData({
      top: event.detail.value,
    })
  },

  // 重复设置
  bindRepeatChange: function(event) {
    this.setData({
      repeat: event.detail.value,
    })
  },


  // 保存按钮
  formSubmit: function(event) {
    var value = event.detail.value;
    // 判断必填项是否填写
    if (value.title == "") {
      wx.showToast({
        title: '请输入事件名',
        icon: 'none',
        duration: 1000
      })
    } else if (this.data.targetDate == "") {
      wx.showToast({
        title: '请设置目标日期',
        icon: 'none',
        duration: 1000
      })
    } else { // 处理表单内容，并保存到数据库event
      var weeks = ["日", "一", "二", "三", "四", "五", "六"],
        week = "星期" + weeks[new Date(value.targetDate).getDay()];
      var data = {
        title: value.title,
        targetDate: this.data.targetDate,
        targetDateSolar: this.data.targetDateSolar,
        targetDateLunar: this.data.targetDateLunar,
        targetDateStr: this.data.targetDateStr,
        isLunar: this.data.isLunar,
        category: 0,
        top: value.top,
        repeat: value.repeat,
        week: week,
        deleteState: false,
        nickname: app.globalData.nickname,
        avatarUrl: app.globalData.avatarUrl,
      }
      if (this.data.id) {
        db.collection('event').doc(this.data.id).update({
            data: data
          }).then(console.log)
          .catch(console.err)
      } else {
        db.collection("event").add({
            data: data
          }).then(console.log)
          .catch(console.err)
      }

      // 返回首页，并重新加载数据
      wx.switchTab({
        url: '/pages/index/index',
        success: function(event) {
          let page = getCurrentPages().pop();
          if (page == undefined || page == null) return;
          page.onShow()
        }
      })
    }
  },

  onShareAppMessage: function() {
    return {
      title: '简单漂亮的倒数日工具',
      path: '/pages/index/index',
      imageUrl: '/images/other/share_img.png'
    }
  },

})