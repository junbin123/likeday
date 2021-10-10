<template>
  <view class="page-container container" :style="'padding-top:'+navBarHeight+'px'">
    <GNavBar :title="eventInfo.id ?'编辑倒数日':'添加倒数日'" background="#f1f1f1"/>
    <view v-for="(item,index) in formList" :key="index">
      <FormCell
        v-model="item.value"
        :title="item.title"
        :iconName="item.iconName"
        :type="item.type"
        :placeholder="item.placeholder"
        :name="item.name"
        :marginTop="item.marginTop"
        :isHover="item.isHover"
        :isRequired="item.isRequired"
        :isShow="item.isShow"
        :rightImg="item.rightImg"
        :borderBottom="item.borderBottom"
        :round="item.round"
        :disabled="index === 5 ? isReminderDisabled : false"
        @handleCalendar="handleCalendarSwitch"
        @handleClick="handleCellClick" />
    </view>
    <view style="position:relative">
      <GButton name="保存" :isBottom="true" @handleClick="handleSave" />
    </view>
  <GOverlay />
  <!-- 分类选择组件 -->
  <CateSelectPop v-model="showCategoryPop" :iconIndex="iconIndex" @handleClick="handleSelectIcon"/>
  <!-- 日历组件 -->
  <Calendar
    v-model="showCalendar"
    :currentDate="eventInfo.targetDate.solorDate"
    @handleClose="handleCalendarClose"
    @handleSubmit="handleCalendarChange" />
  <!-- 重复方式选择 -->
  <GPicker
    title="选择重复方式"
    ref="repeatCom"
    v-model="showRepeatPicker"
    :pickerList="repeatList"
    :pickerValue="repeatValues"
    @change="handleRepeatChange"
    @confirm="handleRepeatConfirm"/>
  <!-- 提时间选择 -->
  <GPicker
    title="选择提醒时间"
    v-model="showTimePicker"
    :pickerList="reminderList"
    :pickerValue="reminderValues"
    @confirm="handleTimeConfirm" />
  </view>
</template>

<script>
/**
 * 添加事件页面
 */
import FormCell from '@/components/Business/Add/FormCell'
import CateSelectPop from '@/components/Business/Add/CateSelectPop'
import GButton from '@/components/Basics/GButton'
import GOverlay from '@/components/Basics/GOverlay'
import Calendar from '@/components/Business/Add/Calendar'
import GNavBar from '@/components/Basics/GNavBar'
import GPicker from '@/components/Basics/GPicker'
import login from '@/app/request/login.js'
import { mapState } from 'vuex'
import { solarToLunar } from '@/utils/calendar'
import { editCountdown, addCountdown } from '@/app/service/countdown'
import { updateUserInfo } from '@/app/service/user.js'
const nowDate = new Date()
export default {
  components: { FormCell, GButton, GOverlay, Calendar, GNavBar, GPicker, CateSelectPop },
  data () {
    return {
      isLock: false,
      originCateId: '', // 初始分类id，用于更新分类的倒数日数量
      nowDate: this.$day(), // 当前日期dayjs对象
      id: '', // 倒数日id
      isReminderDisabled: true, //  到期提醒是否不可点击
      targetDate: '',
      showCategoryPop: false,
      showCalendar: false,
      showRepeatPicker: false,
      showTimePicker: false,
      repeatList: [['不重复', '每 1', '每 2', '每 3', '每 4', '每 5', '每 6', '每 7', '每 8', '每 9', '每 10'], ['不重复', '天重复', '周重复', '月重复', '年重复']],
      reminderList: [['当天', '提前一天', '提前两天', '提前三天', '提前四天', '提前五天', '提前六天', '提前七天'], ['上午', '下午'], ['1 点', '2 点', '3 点', '4 点', '5 点', '6 点', '7 点', '8 点', '9 点', '10 点', '11 点', '12 点']],
      eventInfo: {
        title: '',
        targetDate: {
          isLunar: false,
          week: 0, // 0~6
          solorDate: '',
          lunarDate: ''
        },
        categoryId: '001',
        isTop: true, // 是否置顶
        repeatInfo: {
          interval: 0,
          type: 'day',
          name: '不重复'
        },
        isReminder: false,
        reminderInfo: {
          name: '当天上午 9 点提醒我',
          day: 0, // 取值0~7，提前day天
          type: 'am', // 取值am pm
          hour: 9 // 取值1~12，几点
        }
      }
    }
  },
  computed: {
    ...mapState('app', {
      uid: state => state.userInfo?.uid || '',
      categoryList: state => state.userInfo?.categoryList || [],
      openid: state => state.userInfo?.openid || '',
      countdownCount: (state) => state.userInfo.countdownCount || 0,
      systemInfo: 'systemInfo',
      userInfo: 'userInfo'
    }),
    iconIndex ({ eventInfo, categoryList }) {
      return categoryList.findIndex(item => item.id === eventInfo.categoryId)
    },
    navBarHeight () {
      return this.systemInfo.titleBarHeight + this.systemInfo.statusBarHeight
    },
    // 重复选择器值
    repeatValues ({ eventInfo }) {
      const { interval = 0, type = 'day' } = eventInfo.repeatInfo || {}
      if (interval === 0) {
        return [0, 0]
      }
      const dict = { day: 1, week: 2, month: 3, year: 4 }
      return [interval, dict[type]]
    },
    // 事件提醒选择器值
    reminderValues ({ eventInfo = {} }) {
      const { day = 0, type = 'am', hour = 9 } = eventInfo.reminderInfo || {}
      return [day, type === 'am' ? 0 : 1, hour - 1]
    },
    formList ({ eventInfo, categoryList }) {
      const categoryItem = categoryList.find(item => eventInfo.categoryId === item.id) || {}
      return [{
        isShow: true,
        title: '名称',
        iconName: 'icon-description',
        type: 'input',
        name: 'title',
        placeholder: '输入名称，例如：她的生日',
        value: eventInfo.title,
        marginTop: '6px',
        isHover: false,
        isRequired: true,
        round: 'round',
        borderBottom: false,
        disabled: false
      }, {
        isShow: true,
        title: '目标日',
        iconName: 'icon-date',
        type: 'calendar',
        name: 'targetDate',
        value: eventInfo.targetDate,
        marginTop: '12px',
        isHover: false,
        isRequired: true,
        round: 'roundTop',
        borderBottom: true,
        disabled: false
      }, {
        isShow: true,
        title: '选择分类',
        iconName: 'icon-category',
        type: 'default',
        name: 'category',
        value: categoryItem.name || '全部',
        marginTop: '',
        isHover: true,
        isRequired: true,
        rightImg: `/static/image/category/${categoryItem.icon || 'icon-home'}.png`,
        round: 'roundBottom',
        borderBottom: false,
        disabled: false
      }, {
        isShow: true,
        title: '是否置顶',
        iconName: 'icon-publish',
        type: 'switch',
        name: 'isTop',
        value: eventInfo.isTop,
        marginTop: '12px',
        isHover: false,
        isRequired: false,
        round: 'roundTop',
        borderBottom: true,
        disabled: false
      }, {
        isShow: true,
        title: '是否重复',
        iconName: 'icon-repeat',
        type: 'default',
        name: 'repeat',
        value: eventInfo.repeatInfo.name,
        marginTop: '',
        isHover: true,
        isRequired: false,
        round: '',
        borderBottom: true,
        disabled: false
      }, {
        isShow: true,
        title: '是否到期提醒',
        iconName: 'icon-alarm',
        type: 'switch',
        name: 'isReminder',
        value: eventInfo.isReminder,
        marginTop: '',
        isHover: false,
        isRequired: false,
        round: eventInfo.isReminder ? '' : 'roundBottom',
        borderBottom: eventInfo.isReminder,
        disabled: false
      }, {
        isShow: eventInfo.isReminder,
        title: '提醒时间',
        iconName: 'icon-schedule',
        type: 'default',
        name: 'remindTime',
        value: eventInfo.reminderInfo.name,
        marginTop: '',
        isHover: true,
        isRequired: true,
        round: 'roundBottom',
        borderBottom: false,
        disabled: false
      }]
    }
  },
  onLoad (options) {
    if (!this.uid) {
      login()
    }
    this.id = options.id || '' // 倒数日id
    if (options.eventInfo) {
      this.eventInfo = JSON.parse(decodeURIComponent(options.eventInfo))
      this.originCateId = this.eventInfo.categoryId
    } else {
      this.initTargetDate()
    }
    this.setReminderDisabled() // 设置提醒是否可点击
  },
  onShow () {},
  onHide () {},
  onUnload () {},
  methods: {
    handleRepeatChange (data) {
      if (data[0] === 0 || data[1] === 0) {
        this.$refs.repeatCom.valueList = [0, 0]
      }
    },
    // 初始化 targetDate
    initTargetDate () {
      const year = this.nowDate.year()
      const lunarInfo = solarToLunar(this.nowDate.format('YYYY/MM/DD'))
      this.eventInfo.targetDate = {
        ...this.eventInfo.targetDate,
        lunarDate: `${year}年${lunarInfo.monthStr}${lunarInfo.dayStr}`,
        solorDate: this.nowDate.format('YYYY/MM/DD'),
        week: this.nowDate.day()
      }
    },
    // 表单验证
    validateForm () {
      const { title } = this.eventInfo
      if (!title) {
        uni.showToast({ title: '请输入事件名', icon: 'none' })
        return false
      }
      return true
    },
    // 拉去订阅消息
    requestSubscribe () {
      const tmpl = 'XSxMNQY5tufCuldgLOfSo-hH1aem9GCWPZTVsZSR5k0'
      const promise = new Promise(resolve => {
        uni.requestSubscribeMessage({
          tmplIds: [tmpl],
          complete: res => {
            resolve(res)
          }
        })
      })
      return promise
    },
    // 保存点击事件
    async handleSave () {
      if (this.isLock) {
        return
      }
      this.isLock = true
      if (!this.userInfo.isAuth) {
        await updateUserInfo()
        this.isLock = false
        return
      }
      if (!this.validateForm()) {
        this.isLock = false
        return
      }
      await this.requestSubscribe()
      uni.showLoading({
        title: '保存中',
        mask: true
      })
      const { title, targetDate, categoryId, isTop, repeatInfo, isReminder, reminderInfo } = this.eventInfo
      const data = { title, targetDate, categoryId, isTop, repeatInfo, isReminder, reminderInfo, openid: this.openid }
      try {
        if (this.id) {
          const res = await editCountdown({ ...data, id: this.id })
          if (this.originCateId !== categoryId) {
            this.$store.dispatch('app/updateCategoryCount', {
              id: categoryId,
              change: 1
            })
            this.$store.dispatch('app/updateCategoryCount', {
              id: this.originCateId,
              change: -1
            })
          }
          console.log('编辑事件', res)
        } else {
          const res = await addCountdown(data)
          console.log('添加事件', res)
        }
      } catch (err) {
        console.log(err)
      }
      uni.hideLoading()
      const timer = setTimeout(() => {
        uni.switchTab({
          url: '/pages/index/home',
          success: res => {
            this.$bus('refreshHome', { categoryId }) // 刷新首页
          }
        })
        this.isLock = false
        clearTimeout(timer)
      }, 200)
    },
    // 日历组件确认事件
    handleCalendarChange ({ week, lunarYear, lunarMonth, lunarDay, year, month, day }) {
      this.showCalendar = false
      const { targetDate = {} } = this.eventInfo
      this.eventInfo.targetDate = {
        ...targetDate,
        week,
        solorDate: this.$day(`${year}/${month}/${day}`).format('YYYY/MM/DD'),
        lunarDate: `${lunarYear}年${lunarMonth}${lunarDay}`
      }
      this.setReminderDisabled()
    },
    // 设置提醒是否可编辑
    setReminderDisabled () {
      console.log('setReminderDisabled')
      const [year, month, day] = this.eventInfo.targetDate.solorDate.split('/').map(item => Number(item))
      const date = new Date(year, month - 1, day).getTime()
      if (nowDate.getTime() - date > 0 && this.eventInfo.repeatInfo.interval === 0) {
        this.isReminderDisabled = true
        this.eventInfo.isReminder = false
        console.log('9-----')
      } else {
        this.isReminderDisabled = false
      }
    },
    // 日历组件关闭事件
    handleCalendarClose () {
      console.log('handleCalendarClose')
    },
    // 提醒事件点击事件
    handleTimeConfirm (data) {
      const list = this.reminderList
      const name = `${list[0][data[0]]}${list[1][data[1]]} ${list[2][data[2]]}提醒我`
      const day = data[0]
      const type = data[1] === 0 ? 'am' : 'pm'
      const hour = data[2] + 1
      this.eventInfo.reminderInfo = { name, day, type, hour }
      this.showTimePicker = false
    },
    // 重复方式点击事件
    handleRepeatConfirm (data) {
      const open = data[0] > 0 && data[1] > 0
      const dict = ['', 'day', 'week', 'month', 'year']
      const list = this.repeatList
      const name = open ? `${list[0][data[0]]} ${list[1][data[1]]}` : '不重复'
      const interval = open ? data[0] : 0
      const type = open ? dict[data[1]] : ''
      this.eventInfo.repeatInfo = { name, interval, type }
      this.showRepeatPicker = false
      this.setReminderDisabled()
    },
    handleCellClick ({ name, value }) {
      console.log('handleCellClick', { name, value })
      const cellDict = {
        title: () => {
          this.eventInfo.title = value
        },
        targetDate: () => {
          this.showCalendar = true
        },
        category: () => {
          this.showCategoryPop = true
        },
        isTop: () => {
          this.eventInfo.isTop = value
        },
        repeat: () => {
          this.showRepeatPicker = true
        },
        isReminder: () => {
          this.eventInfo.isReminder = value
        },
        remindTime: () => {
          this.showTimePicker = true
        }
      }
      cellDict[name] && cellDict[name]()
    },
    handleCalendarSwitch ({ isLunar }) {
      const { targetDate = {} } = this.eventInfo
      this.eventInfo.targetDate = {
        ...targetDate,
        isLunar
      }
    },
    // 选择分类ICON
    handleSelectIcon (id) {
      this.eventInfo.categoryId = id
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  padding-bottom: 200px;
  .cate-pop{
    height: 100%;
    .cate-pop-scroll{
      height: 100%;
    }
  }
}

</style>
