# likeday-uni
> Likeday 小程序 | uni-app 框架

## 常用命令
```sh
# 安装依赖包
npm i

# 运行本地 3000 端口
npm run dev 

# 运行线上环境
npm run dev -prod

# 打包
npm run build -prod
```

## 物料
- [icon 图片](https://icons8.cn/icons/fluent)

## 数据格式
```js
// 倒数日数据格式
{
  id: '',
  uid: '',
  title: '距离周五',
  targetDate: {
    isLunar: true, // 是否显示农历
    week: 1, // 0~6，星期
    solorDate: '2021/09/10',
    lunarDate: '2021年八月初四'
  },
  categoryId: 'HKNI', // 分类id，没有为空
  isTop: true, // 是否置顶
  isArchive: false, // 是否归档
  isReminder: true, // 是否开启提醒
  repeatInfo: {  // 重复信息
    name: '每1天重复',
    interval: 1,  // 取值:0~10 0未开启
    type: 'day'  // 取值：day week month year 
  },
  reminderInfo: {  // 提醒信息
    name: '提前1天下午 9 点提醒我',
    day: 1,  // 取值0~7，提前day天
    type: 'am', // 取值am pm
    hour: 9 // 取值1~12，几点
  }
}
```






