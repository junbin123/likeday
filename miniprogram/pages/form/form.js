const utils = require("../../utils/utils.js")
const db = wx.cloud.database();
const app = getApp();

Page({
  data: {
    // reminder: ['不设置提醒', '提前一天', '提前两天', '提前三天', '提前四天', '提前五天'],
    // reminderIndex: 0,
    id: "",
    title: '',
    targetDate: '',
    initTargetDate: '',
    category: 0,
    top: false,
    repeat: 0,
    form: [{
        type: 'title',
        placeholder: '输入事件名，例如：她的生日',
        iconUrl: '/images/icon/form_icon/title.png'
      },
      {
        type: 'targetDate',
        title: '目标日',
        iconUrl: '/images/icon/form_icon/date.png'
      },
      {
        type: 'category',
        title: '分类',
        iconUrl: '/images/icon/form_icon/category.png',
        categoryArr: ['生活', '工作', '纪念日', '添加新分类'],
      },
      {
        type: 'top',
        title: '置顶',
        iconUrl: '/images/icon/form_icon/top.png'
      },
      {
        type: 'repeat',
        title: '重复',
        iconUrl: '/images/icon/form_icon/repeat.png',
        repeatArr: ['不重复', '每天重复', '每周重复', '每月重复', '每年重复'],
      }
    ]

  },

  onLoad: function(options) {
    // 编辑操作，根据事件id获取数据
    if (options.id) {
      var card = app.globalData.cards.find((item, indexm, arr) => {
        return item._id === options.id
      })
      this.setData({
        id: options.id,
        title: card.title,
        initTargetDate: card.initTargetDate,
        targetDate: card.targetDate,
        category: card.category,
        top: card.top,
        repeat: card.repeat,
      })
    }
  },

  // 事件名输入
  bindTitleConfirm: function(event) {},

  // 目标日输入
  bindDateChange: function(event) {
    this.setData({
      initTargetDate: event.detail.value
    })
    var repeat = 2
    var initTargetDate = event.detail.value
    var tempTargetDate = utils.resetTargetDate(initTargetDate, initTargetDate, repeat)
    var targetDate = utils.resetTargetDate(initTargetDate, tempTargetDate, repeat)

    console.log(initTargetDate)
    console.log(targetDate)
  },

  // 分类设置
  // bindCategoryChange: function(event) {
  //   this.setData({
  //     category: event.detail.value,
  //   })
  // },

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

  // 提醒时间设置
  // bindReminderChange: function(event) {
  //   this.setData({
  //     reminderIndex: event.detail.value
  //   })
  // },

  // 保存按钮
  formSubmit: function(event) {
    var value = event.detail.value;
    var initTargetDate = value.targetDate
    var tempTargetDate = utils.resetTargetDate(initTargetDate, initTargetDate, parseInt(value.repeat))
    var targetDate = utils.resetTargetDate(initTargetDate, tempTargetDate, parseInt(value.repeat))
    console.log(value)
    // 判断必填项是否填写
    if (value.title == "") {
      wx.showToast({
        title: '请输入事件名',
        icon: 'none',
        duration: 1000
      })
    } else if (value.targetDate == "") {
      wx.showToast({
        title: '请设置目标日期',
        icon: 'none',
        duration: 1000
      })
    } else { // 处理表单内容，并保存到数据库event
      var weeks = ["日", "一", "二", "三", "四", "五", "六"],
        week = "星期" + weeks[new Date(targetDate).getDay()];
      var data = {
        title: value.title,
        targetDate: targetDate,
        initTargetDate: initTargetDate,
        category: 0,
        top: value.top,
        repeat: value.repeat,
        week: week,
        deleteState: false
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
    // 实现订阅消息
    // wx.requestSubscribeMessage({
    //   tmplIds: ['yyFvDHU6xbrik5jQwYDpJuix8OOiBIvNrNTyC6u4anA'],
    //   success(res) {
    //     wx.cloud.callFunction({
    //       name: "push",
    //       success(res) {
    //         console.log("调用云函数push成功" + res)
    //       },
    //       fail(res) {
    //         console.log("调用云函数push失败" + res)
    //       }
    //     })
    //   }
    // })
  },

  onShareAppMessage: function() {
    return {
      title: '简单漂亮的倒数日工具',
      path: '/pages/index/index',
      imageUrl: '/images/other/share_img.png'
    }
  },

})