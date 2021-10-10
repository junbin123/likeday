<template>
  <view
    :class="['button-container',{'fixed-bottom-btn':isBottom,'border-top':isBottom}]"
    :style="systemInfo.isIphoneX && isBottom?'padding-bottom:46px':''">
      <button
        :disabled="disabled"
        :form-type="formType"
        :open-type="openType"
        :hover-stop-propagation="hoverStopPropagation"
        :session-from="sessionFrom"
        :send-message-img="sendMessageImg"
        :send-message-path="sendMessagePath"
        :send-message-title="sendMessageTitle"
        :app-parameter="appParameter"
        :show-message-card="showMessageCard"
        :class="['button-box',buttonClass,`${size}-size`]"
        :hover-class="hoverClass"
        @click="handleClick"
        @contact="handleContact"
        @error="handleError"
        @opensetting="handleOpenSetting"
        @launchapp="handleLaunchApp"
        @getphonenumber="handleGetPhoneNumber"
      >
      <text :class="['iconfont',icon,'icon-class']"/>
      {{name}}
      </button>
      <slot />
  </view>
</template>

<script>
/**
 * 自定义按钮
 */
import { mapState } from 'vuex'
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    formType: {
      type: String,
      default: ''
    },
    openType: {
      type: String,
      default: ''
    },
    hoverStopPropagation: {
      type: Boolean,
      default: false
    },
    sessionFrom: {
      type: String,
      default: ''
    },
    sendMessageTitle: {
      type: String,
      default: ''
    },
    sendMessagePath: {
      type: String,
      default: ''
    },
    sendMessageImg: {
      type: String,
      default: ''
    },
    appParameter: {
      type: String,
      default: ''
    },
    showMessageCard: {
      type: Boolean,
      default: false
    },
    type: { // 按钮样式
      type: String,
      default: 'default',
      validator: (val) => {
        return ['default', 'gray', 'danger'].includes(val)
      }
    },
    name: { // 按钮名
      type: String,
      default: ''
    },
    icon: { // icon名
      type: String,
      default: ''
    },
    customDate: { // 点击后抛出的数据
      type: [String, Object, Array, Number, Boolean]
    },
    size: { // 按钮大小
      type: String,
      default: 'normal',
      validator: (val) => {
        return ['normal', 'small'].includes(val)
      }
    },
    isBottom: { // 是否固定在底部
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  computed: {
    hoverClass () {
      const hoverDict = {
        default: 'primary-hover',
        gray: 'gray-hover',
        danger: 'danger-hover'
      }
      return hoverDict[this.type]
    },
    buttonClass () {
      const classDict = {
        default: 'primary-default',
        gray: 'gray-default',
        danger: 'danger-default'
      }
      const disableClassDict = {
        default: 'primary-disabled',
        gray: 'gray-disabled',
        danger: 'danger-disabled'
      }
      return this.disabled ? disableClassDict[this.type] : classDict[this.type]
    },
    ...mapState('app', {
      systemInfo: 'systemInfo'
    })

  },
  methods: {
    handleClick () {
      this.$emit('handleClick', this.customDate)
    },
    handleContact (data) {
      this.$emit('handleContact', data)
    },
    handleError (data) {
      this.$emit('handleError', data)
    },
    handleOpenSetting (data) {
      this.$emit('handleOpenSetting', data)
    },
    handleLaunchApp (data) {
      this.$emit('handleLaunchApp', data)
    },
    handleGetPhoneNumber (data) {
      this.$emit('handleGetPhoneNumber', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.button-box{
  @include flex-center();
  font-size: 18px;
  height: 48px;
  width: 100%;
  border-radius: 4px;
}
.primary-default{
  background: $color-blue;
  color: #fff;
}
.primary-hover{
  background: #3A48CC;
  color: #fff;
}
.primary-disabled{
  background: #919CFF;
  color: #fff;
}
.gray-default{
  background: #EDEDED;
  color: $color-blue;
}

.danger-default{
  background: #FDEEEE;
  color: #E33636;
}
.danger-hover{
  background: #FAD4D4;
}
.gray-hover{
  background: #CDCECF;
  color: $color-blue;
}
.gray-disabled{
  background: #EDEDED;
  color: #AAAAAA;
}
.icon-class{
  padding-right: 4px;
  font-size: 18px;
}
.normal-size{
  height: 48px;
  font-size: 18px;
}
.small-size{
  height: 38px;
  font-size: 14px;
}
.fixed-bottom-btn{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 750rpx;
  padding: 12px;
  background: #fff;
}
</style>
