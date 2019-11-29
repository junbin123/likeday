var app = getApp()
Component({
  data: {
    selected: 0,
    list: [{
        "pagePath": "/pages/index/index",
        "text": "首页",
        "iconPath": "/images/icon/index.png",
        "selectedIconPath": "/images/icon/index_select.png"
      },
      {
        "pagePath": "/pages/form/form",
        "iconPath": "/images/icon/form_select.png",
      },
      {
        "pagePath": "/pages/personal/personal",
        "text": "我的",
        "iconPath": "/images/icon/personal.png",
        "selectedIconPath": "/images/icon/personal_select.png"
      }
    ],
    height: app.globalData.isIPX ? '90px' : '56px',
  },

  attached() {},
  methods: {
    // 添加事件tab
    navigateTab(event) {
      wx.navigateTo({
        url: '/pages/form/form',
        events: {},
        success: function(res) {
          console.log(res);
        }
      })
    },
    // 左右切换tab
    switchTab(event) {
      const data = event.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({
        url
      })
      this.setData({
        selected: parseInt(data.index)
      })
      console.log(data.index);
    }
  },
})