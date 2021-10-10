<template>
  <button
    :disabled="disabled"
    :form-type="formType"
    :open-type="openType"
    :hover-stop-propagation="false"
    :session-from="sessionFrom"
    :send-message-img="sendMessageImg"
    :send-message-path="sendMessagePath"
    :send-message-title="sendMessageTitle"
    :show-message-card="showMessageCard"
    :class="['button-box', 'flex-center', buttonClass, `${size || 'normal'}-size`]"
    :hover-class="hoverClass"
    :hover-stay-time="300"
    @click="handleClick"
    @contact="handleContact"
    @error="handleError"
    @opensetting="handleOpenSetting"
    @getphonenumber="handleGetPhoneNumber"
  >
    <slot>
      <text :class="['iconfont', icon, 'icon-class']" />
      {{ name }}
    </slot>
  </button>
</template>

<script>
/**
 * 自定义按钮
 */
export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
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
    showMessageCard: {
      type: Boolean,
      default: true
    },
    type: {
      // 按钮样式
      type: String,
      default: 'default',
      validator: (val) => {
        return ['default', 'gray', 'danger'].includes(val)
      }
    },
    name: {
      // 按钮名
      type: String,
      default: ''
    },
    icon: {
      // icon名
      type: String,
      default: ''
    },
    size: {
      // 按钮大小
      type: String,
      default: 'normal',
      validator: (val) => {
        return ['normal', 'small'].includes(val)
      }
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
    }
  },
  methods: {
    handleClick () {
      this.$emit('handleClick', this.item)
    },
    handleContact (data) {
      this.$emit('handleContact', { ...this.item, data })
    },
    handleError (data) {
      this.$emit('handleError', { ...this.item, data })
    },
    handleOpenSetting (data) {
      this.$emit('handleOpenSetting', { ...this.item, data })
    },
    handleGetPhoneNumber (data) {
      this.$emit('handleGetPhoneNumber', { ...this.item, data })
    }
  }
}
</script>

<style lang="scss" scoped>
.button-box {
  font-size: 16px;
  height: 48px;
  width: 100%;
  border-radius: 4px;
}
.primary-default {
  background: $color-blue;
  color: #fff;
}
.primary-hover {
  background: #3a48cc;
  color: #fff;
}
.primary-disabled {
  background: #919cff;
  color: #fff;
}
.gray-default {
  background: #ededed;
  color: $color-blue;
}

.danger-default {
  background: #fdeeee;
  color: #e33636;
}
.danger-hover {
  background: #fad4d4;
}
.gray-hover {
  background: #cdcecf;
  color: $color-blue;
}
.gray-disabled {
  background: #ededed;
  color: #aaaaaa;
}
.icon-class {
  padding-right: 4px;
  font-size: 16px;
}
.normal-size {
  height: 48px;
  font-size: 16px;
}
.small-size {
  height: 38px;
  font-size: 14px;
}
.fixed-bottom-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 750rpx;
  padding: 12px;
  background: #fff;
}
</style>
