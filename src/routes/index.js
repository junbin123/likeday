module.exports = {
  tabBar: {
    position: 'bottom',
    color: '#222',
    selectedColor: '#495AFF',
    backgroundColor: '#fff',
    custom: true,
    list: [
      {
        pagePath: 'pages/index/home',
        iconPath: 'static/image/tab_bar/home_icon.png',
        selectedIconPath: 'static/image/tab_bar/home_icon_select.png',
        text: 'LikeDay'
      },
      {
        pagePath: 'pages/index/me',
        iconPath: 'static/image/tab_bar/home_icon.png',
        selectedIconPath: 'static/image/tab_bar/home_icon_select.png',
        text: '我的'
      }
    ]
  },
  pages: [
    {
      path: 'pages/index/home',
      style: {
        navigationStyle: 'custom',
        enablePullDownRefresh: true
      }
    },
    {
      path: 'pages/index/detail',
      style: {
        navigationBarTitleText: ''
      }
    },
    {
      path: 'pages/index/add',
      style: {
        navigationStyle: 'custom'
      }
    },

    {
      path: 'pages/index/me',
      style: {
        navigationStyle: 'custom'
      }
    },
    {
      path: 'pages/edit/category',
      disableScroll: true,
      style: {
        navigationBarTitleText: '分类管理'
      }
    },
    {
      path: 'pages/edit/deleteList',
      style: {
        navigationBarTitleText: '已删除的倒数日'
      }
    },
    {
      path: 'pages/other/about',
      style: {
        navigationBarTitleText: '关于开发者'
      }
    },
    {
      path: 'pages/other/sync',
      style: {
        navigationBarTitleText: '同步我之前的数据'
      }
    }
  ],
  condition: {
    // current: 0,
    list: [
      {
        name: '分类',
        path: 'pages/edit/category',
        query: ''
      }
    ]
  },
  globalStyle: {
    navigationBarTextStyle: 'black',
    navigationBarBackgroundColor: '#f1f1f1',
    backgroundColor: '#f1f1f1'
  }
}
