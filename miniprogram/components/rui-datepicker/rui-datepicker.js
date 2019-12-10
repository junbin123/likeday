import solarLunar from './solarlunar';
// 获取当前日期
const thisDate = new Date();
const thisYear = thisDate.getFullYear();
const thisMonth = thisDate.getMonth() + 1;
const thisDay = thisDate.getDate();
const thisDateStr = thisYear + '-' + thisMonth + '-' + thisDay
// 设置年份数组1940-2100
const dafaultYearArr = [];
for (let i = 1940; i <= 2100; i++) {
  dafaultYearArr.push(i);
}
// 日期选择最大值最小值
const solarMinMonth = 2;
const solarMinDay = 8;
const maxLunar = solarLunar.solar2lunar(thisYear, 12, 31);
const lunarMaxMonth = maxLunar.lMonth;
const lunarMaxDay = maxLunar.lDay;

// 默认初始配置数据
const dafaultConfig = {
  confirm: false, //是否需要确认
  date: thisDateStr, //默认日期(新历)
  hour: '-1', //默认时辰,未知
  showHour: false, //是否有时辰选项
  lunar: false, //默认展示农历
}
Component({

  properties: {
    targetDate: String,
    isLunar: Boolean,
  },
  // 组件的内部数据
  data: {
    // 默认初始配置数据
    config: {},
    returnDate: {
      lastTab: 'lunar', //最后确认tab,农历lunar,公历solar
      year: '', //公历年
      month: '', //公历月
      day: '', //公历日
      lYear: '', //农历年
      lMonth: '', //农历月
      lDay: '', //农历日
      isLeap: '', //农历月是否为闰月
      lunarStr: '', //1991年十一月廿六 0子时
      solarStr: '', //公历: 1991年12月31日 0时
      thisStr: '', //当前在什么下返回
      hour: '', //时辰,为空表示不需要时辰，-1为未知时辰
    },
    // 选择块数据
    selectArr: [],
    yearArr: dafaultYearArr,
    monthArr: [],
    dayArr: [],
    hourArr: [],
    // 当前tab
    lunarTab: true,
    // 是否显示
    isShow: false,
    // 确认块隐藏
    hiddenConfirm: true,
  },

  pageLifetimes: {
    show: function() {
      dafaultConfig.date = thisDateStr
      dafaultConfig.lunar = false
      if (this.data.targetDate) {
        dafaultConfig.date = this.data.targetDate
        dafaultConfig.lunar = this.data.isLunar
      }
    },
    hide: function() {},
    resize: function() {},
  },

  //组件的方法列表,内部方法_开头
  methods: {
    // 确认完成
    confirm() {
      // 判断是否需要确认
      if (this.data.config.confirm) {
        // 判断是否在确认步骤[完成&确认]
        if (this.data.hiddenConfirm === false) {
          this.setData({
            isShow: false,
            hiddenConfirm: true
          });
          this.triggerEvent('confirm', this.data.returnDate);
        } else {
          this.setData({
            hiddenConfirm: false
          });
        }
      } else {
        this.setData({
          isShow: false,
          hiddenConfirm: true
        });
        this.triggerEvent('confirm', this.data.returnDate);
      }
    },
    // 初始化插件数据并显示
    init(param) {
      // 合并对象,以默认配置为基础，返回新配置
      let defaultSet = Object.assign({}, dafaultConfig, param);
      // 检测数据合法性
      defaultSet = this._checkConfig(defaultSet);
      // 默认农历
      if (defaultSet.lunar == true) {
        //载入农历数据
        this._initlunar(defaultSet.date, defaultSet.hour);
      } else {
        //载入公历数据
        this._initsolar(defaultSet.date, defaultSet.hour);
      }
      // 设置配置，显示组件
      this.setData({
        lunarTab: defaultSet.lunar === true ? true : false,
        config: defaultSet,
        isShow: true
      });
      // 设置当前日期返回数据
      this._setReturnDate();
    },
    // 取消
    _cancel() {
      // 判断是否在确认步骤[返回修改&取消]
      if (this.data.hiddenConfirm === false) {
        this.setData({
          hiddenConfirm: true
        })
      } else {
        this.setData({
          isShow: false
        });
      }
    },
    // 检测配置的合法性，防止程序报错
    _checkConfig(conf) {
      // 是否需要确认:只能true 或 false
      if (typeof conf.confirm != 'boolean') {
        conf.confirm = dafaultConfig.confirm
      }
      // 是否有时辰选项:只能true 或 false
      if (typeof conf.showHour != 'boolean') {
        conf.showHour = dafaultConfig.showHour
      }
      // 默认展示农历:只能true 或 false
      if (typeof conf.lunar != 'boolean') {
        conf.lunar = dafaultConfig.lunar
      }
      // 时辰格式，区间[-1,24]
      if (parseInt(conf.hour) < -1 || parseInt(conf.hour) > 24 || conf.hour == '') {
        conf.hour = dafaultConfig.hour
      }
      // 日期格式，1991-12-31
      let confDate = new Date(conf.date);
      if (confDate == 'Invalid Date' || confDate.getFullYear() < 1940 || confDate.getFullYear() > 2030) {
        conf.date = dafaultConfig.date
      }
      return conf;
    },
    // 公农历切换
    _solarLunarChange(event) {
      const type = event.currentTarget.dataset.type;
      const thisDate = this.data.returnDate;

      // 农历下点击公历切换
      if (this.data.lunarTab !== true && type == 'lunar') {
        this.setData({
          lunarTab: true
        })
        this._initlunar(thisDate.year + '-' + thisDate.month + '-' + thisDate.day, thisDate.hour);
      }
      // 公历下点击农历切换
      if (this.data.lunarTab === true && type == 'solar') {
        this.setData({
          lunarTab: false
        })
        this._initsolar(thisDate.year + '-' + thisDate.month + '-' + thisDate.day, thisDate.hour);
      }
      this._setReturnDate();
    },
    // 切换picker
    _pickerChange(event) {
      let selectArr = event.detail.value;
      if (this.data.lunarTab === true) {
        //在农历下
        // 该年是否有闰月，0没有
        const leapMonth = solarLunar.leapMonth(selectArr[0] + 1940);
        const oldMonthArr = this.data.monthArr;
        // 刷新月份数组
        let monthArr = [];
        for (let i = 1; i <= 12; i++) {
          monthArr.push(this._getLunarName('month', i));
          // 判断是否有闰月
          if (leapMonth > 0 && i == leapMonth) {
            monthArr.push('闰' + this._getLunarName('month', i));
          }
        }

        // 日期数组
        let dayArr = [];
        let maxDay;
        //判断是否有闰月
        if (leapMonth > 0) {
          if (selectArr[1] < leapMonth) {
            //月份小于闰月，+1
            maxDay = solarLunar.monthDays(selectArr[0] + 1940, selectArr[1] + 1)
          } else {
            if (selectArr[1] == leapMonth) {
              maxDay = solarLunar.leapDays(selectArr[0] + 1940, leapMonth)
            } else {
              // 月份大于闰月
              maxDay = solarLunar.monthDays(selectArr[0] + 1940, selectArr[1])
            }
          }
        } else {
          //没有闰月，+1 (有闰月切换没闰月最大值处理)
          let thisMonth = (selectArr[1] + 1) > monthArr.length ? monthArr.length : (selectArr[1] + 1);
          maxDay = solarLunar.monthDays(selectArr[0] + 1940, thisMonth);
        }
        for (let i = 1; i <= maxDay; i++) {
          dayArr.push(this._getLunarName('day', i));
        }
        // 年切换月份位置修正：有闰年 -> 没闰年
        if (oldMonthArr.length > monthArr.length) {
          let oldLeapMonth = 0;
          for (let i = 0, max = oldMonthArr.length; i < max; i++) {
            if ('' + oldMonthArr[i].indexOf('闰') >= 0) {
              oldLeapMonth = i;
            }
          }
          selectArr[1] = ((selectArr[1] + 1) > oldLeapMonth) ? selectArr[1] - 1 : selectArr[1];
        }
        // 年份切换月份位置修正：没闰年 -> 有闰年
        if (oldMonthArr.length < monthArr.length) {
          selectArr[1] = ((selectArr[1] + 1) > leapMonth) ? selectArr[1] + 1 : selectArr[1];
        }
        // 判断是否超出月份最大值(有闰年切换没闰年的情况)
        selectArr[1] = selectArr[1] >= monthArr.length ? (monthArr.length - 1) : selectArr[1];
        // 判断是否超出日期最大值
        selectArr[2] = selectArr[2] >= maxDay ? maxDay - 1 : selectArr[2];
        // 判断到达年份最大
        if (selectArr[0] == thisYear - 1940) {
          // 有无闰月
          if (leapMonth > 0) {
            selectArr[1] = selectArr[1] > lunarMaxMonth ? lunarMaxMonth : selectArr[1];
            // 日期最大值
            if (selectArr[1] == lunarMaxMonth && (selectArr[2] + 1) > lunarMaxDay) {
              selectArr[2] = lunarMaxDay - 1;
            }
          } else {
            selectArr[1] = selectArr[1] > lunarMaxMonth - 1 ? lunarMaxMonth - 1 : selectArr[1];
            // 日期最大值
            if (selectArr[1] == (lunarMaxMonth - 1) && (selectArr[2] + 1) > lunarMaxDay) {
              selectArr[2] = lunarMaxDay - 1;
            }
          }
        }
        // 更新+最大值选择
        this.setData({
          monthArr: monthArr,
          dayArr: dayArr,
          selectArr: selectArr
        })
      } else {
        //在公历下
        // 刷新日期数组
        let dayArr = [];
        let maxDay = solarLunar.solarDays(selectArr[0] + 1940, selectArr[1] + 1);
        for (let i = 1; i <= maxDay; i++) {
          dayArr.push(i);
        }
        // 判断是否超出日期最大值
        selectArr[2] = selectArr[2] >= maxDay ? maxDay - 1 : selectArr[2];
        // 判断月份是否到达最小
        if (selectArr[0] == 0 && (selectArr[1] + 1) < solarMinMonth) {
          selectArr[1] = solarMinMonth - 1;
        }
        //判断年份月份到达最小
        if (selectArr[0] == 0 && (selectArr[1] + 1) == solarMinMonth && (selectArr[2] + 1) < solarMinDay) {
          selectArr[2] = solarMinDay - 1;
        }
        // 更新日期+最小值选择
        this.setData({
          selectArr: selectArr,
          dayArr: dayArr
        })
      }
      // 设置当前日期返回数据
      this._setReturnDate();
    },
    // 设置返回数据，每次切换执行
    _setReturnDate() {
      // 微信picker-view的bug，重新设置位置
      this.setData({
        selectArr: this.data.selectArr
      })
      const selectArr = this.data.selectArr;
      let thisDateJson = {};
      thisDateJson.hour = this.data.config.showHour === false ? '' : selectArr[3] - 1;
      if (this.data.lunarTab === true) {
        //农历下
        thisDateJson.lastTab = 'lunar';
        // 公历数据
        thisDateJson.lYear = selectArr[0] + 1940;
        const leapMonth = solarLunar.leapMonth(selectArr[0] + 1940);
        if (leapMonth > 0) {
          thisDateJson.lMonth = selectArr[1] >= leapMonth ? selectArr[1] : selectArr[1] + 1;
        } else {
          thisDateJson.lMonth = selectArr[1] + 1;
        }
        thisDateJson.lDay = selectArr[2] + 1;
        thisDateJson.isLeap = (leapMonth > 0 && selectArr[1] == leapMonth) ? true : false;
        if (thisDateJson.isLeap == true) {
          thisDateJson.lunarStr = thisDateJson.lYear + '年闰' + this._getLunarName('month', thisDateJson.lMonth) + '' + this._getLunarName('day', thisDateJson.lDay);
        } else {
          thisDateJson.lunarStr =
            thisDateJson.lYear + '年' + this._getLunarName('month', thisDateJson.lMonth) + '' + this._getLunarName('day', thisDateJson.lDay);
        }
        // 农历数据
        let solarData = solarLunar.lunar2solar(thisDateJson.lYear, thisDateJson.lMonth, thisDateJson.lDay, thisDateJson.isLeap);
        thisDateJson.year = solarData.cYear;
        thisDateJson.month = solarData.cMonth;
        thisDateJson.day = solarData.cDay;
        thisDateJson.solarStr = thisDateJson.year + '年' + thisDateJson.month + '月' + thisDateJson.day + '日';
      } else {
        //公历下
        thisDateJson.lastTab = 'solar';
        // 公历数据
        thisDateJson.year = selectArr[0] + 1940;
        thisDateJson.month = selectArr[1] + 1;
        thisDateJson.day = selectArr[2] + 1;
        thisDateJson.solarStr = thisDateJson.year + '年' + thisDateJson.month + '月' + thisDateJson.day + '日';
        // 农历数据
        let lunarData = solarLunar.solar2lunar(thisDateJson.year, thisDateJson.month, thisDateJson.day);
        thisDateJson.lYear = lunarData.lYear;
        thisDateJson.lMonth = lunarData.lMonth;
        thisDateJson.lDay = lunarData.lDay;
        thisDateJson.isLeap = lunarData.isLeap;
        if (thisDateJson.isLeap == true) {
          thisDateJson.lunarStr = thisDateJson.lYear + '年闰' + this._getLunarName('month', thisDateJson.lMonth) + '' + this._getLunarName('day', thisDateJson.lDay);
        } else {
          thisDateJson.lunarStr = thisDateJson.lYear + '年' + this._getLunarName('month', thisDateJson.lMonth) + '' + this._getLunarName('day', thisDateJson.lDay);
        }
      }
      // 判断是否有选择时辰
      if (thisDateJson.hour !== '') {
        thisDateJson.solarStr += ' ' + (thisDateJson.hour < 0 ? '时辰未知' : (thisDateJson.hour + '时'));
        thisDateJson.lunarStr += ' ' + (thisDateJson.hour < 0 ? '时辰未知' : (this._getLunarName('hour', thisDateJson.hour) + '时'));
      }
      //判断当前模式返回thisStr
      if (this.data.lunarTab === true) {
        thisDateJson.thisStr = thisDateJson.lunarStr;
      } else {
        thisDateJson.thisStr = thisDateJson.solarStr;
      }
      // 返回节气和星期
      let mySelectDate = solarLunar.solar2lunar(thisDateJson.year, thisDateJson.month, thisDateJson.day)
      // console.log(mySelectDate)
      thisDateJson.term = mySelectDate.term
      thisDateJson.week = mySelectDate.ncWeek

      this.setData({
        returnDate: thisDateJson
      })



    },
    // 返回中文农历名
    _getLunarName(type, number) {
      const monthArr = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '腊月'];
      const dayArr = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十', '三十一'];
      const hourArr = ['0子', '1丑', '2丑', '3寅', '4寅', '5卯', '6卯', '7辰', '8辰', '9巳', '10巳', '11午', '12午', '13未', '14未', '15申', '16申', '17酉', '18酉', '19戌', '20戌', '21亥', '22亥', '23子'];
      if (type === 'month') return monthArr[number - 1];
      if (type === 'day') return dayArr[number - 1];
      if (type === 'hour') return hourArr[number];
    },
    // 填充农历数据
    _initlunar(date, hour) {
      const dateArr = date.split("-");
      // 转换公历to农历
      const lunarData = solarLunar.solar2lunar(dateArr[0], dateArr[1], dateArr[2]);
      // 该年是否有闰月，0没有
      const leapMonth = solarLunar.leapMonth(lunarData.lYear);
      // 月份数组
      let monthArr = [];
      for (let i = 1; i <= 12; i++) {
        monthArr.push(this._getLunarName('month', i));
        // 判断是否有闰月
        if (leapMonth > 0 && i == leapMonth) {
          monthArr.push('闰' + this._getLunarName('month', i));
        }
      }
      // 日期数组
      let dayArr = [];
      let maxDay;
      // 该日期是否是闰月
      if (lunarData.isLeap) {
        maxDay = solarLunar.leapDays(dateArr[0], dateArr[1])
      } else {
        maxDay = solarLunar.monthDays(dateArr[0], dateArr[1])
      }
      for (let i = 1; i <= maxDay; i++) {
        dayArr.push(this._getLunarName('day', i));
      }

      // 时辰数组
      let hourArr = ['未知'];
      for (let i = 0; i <= 23; i++) {
        hourArr.push(this._getLunarName('hour', i) + '时');
      }
      // 设置位置
      let selectArr = [
        lunarData.lYear - 1940,
        (leapMonth > 0 && leapMonth <= lunarData.lMonth) ? lunarData.lMonth : lunarData.lMonth - 1,
        lunarData.lDay - 1,
        parseInt(hour) + 1
      ];
      this.setData({
        lunarTab: true,
        monthArr: monthArr,
        dayArr: dayArr,
        hourArr: hourArr,
        selectArr: selectArr
      })
    },
    // 填充公历数据
    _initsolar(date, hour) {
      const dateArr = date.split("-");
      // 月份数组
      let monthArr = [];
      for (let i = 1; i <= 12; i++) {
        monthArr.push(i);
      }

      // 日期数组
      let dayArr = [];
      let maxDay = solarLunar.solarDays(dateArr[0], dateArr[1])
      for (let i = 1; i <= maxDay; i++) {
        dayArr.push(i);
      }

      // 时辰数组
      let hourArr = ['未知'];
      for (let i = 0; i <= 23; i++) {
        hourArr.push(i + '时');
      }

      // 设置位置
      let selectArr = [dateArr[0] - 1940, dateArr[1] - 1, dateArr[2] - 1, parseInt(hour) + 1];
      this.setData({
        lunarTab: false,
        monthArr: monthArr,
        dayArr: dayArr,
        hourArr: hourArr,
        selectArr: selectArr
      })
    },
    // 阻塞事件冒泡，底层滑动
    handleStop() {
      return false;
    }
  }
})