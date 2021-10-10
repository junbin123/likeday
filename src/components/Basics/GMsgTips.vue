<template>
  <view :class="['msg-container',animationClass]">
    <view class="msg-box" :style="'padding:0 ' + spacing"><slot /></view>
    <image
      src="/static/image/common/msg-arrow.png"
      :class="['msg-arrow', `arrow-${arrowDirect}`]"
      :style="[arrowMoveStyle]"
    />
  </view>
</template>

<script>
/**
 * 对话框提示组件
 */
export default {
  name: 'GMsgTips',
  props: {
    spacing: {
      // 左右间距
      type: String,
      default: '12px'
    },
    arrowMove: {
      // 箭头左右位置，仅arrowDirect为left或right有效
      type: String,
      default: ''
    },
    arrowDirect: {
      // 箭头指向
      type: String,
      default: 'bottom',
      validator: (val) => {
        return ['top', 'bottom', 'left', 'right'].includes(val)
      }
    },
    isAnimation: {
      // 开启动效
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  computed: {
    arrowMoveStyle () {
      // 箭头位置样式
      if (['left', 'right'].includes(this.arrowDirect)) {
        return {}
      }
      if (!this.arrowMove || this.arrowMove === '50%') {
        return { left: '50%', marginLeft: '-9px' }
      }
      if (this.arrowMove.slice(0, 1) === '-') {
        return { right: this.arrowMove.slice(1) }
      } else {
        return { left: this.arrowMove }
      }
    },
    animationClass () {
      if (!this.isAnimation) {
        return ''
      }
      if (['left', 'right'].includes(this.arrowDirect)) {
        return 'animation-slide-x'
      } else {
        return 'animation-slide-y'
      }
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.msg-container {
  color: #fff;
  font-size: 14px;
  width: fit-content;
  min-width: 32px;
  height: 38px;
  position: relative;
  box-shadow: 2px 2px 20px 0 rgba(0, 0, 0, 0.2);
  animation-duration: 2s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  .msg-box {
    background: $color-blue;
    border-radius: 4px;
    @include flex-center();
    height: 100%;
    min-width: 32px;
  }
  .msg-arrow {
    width: 18px;
    height: 8px;
    position: absolute;
  }
  .arrow-left {
    top: 15px;
    left: -11px;
    transform: rotate(90deg);
  }
  .arrow-right {
    top: 15px;
    right: -11px;
    transform: rotate(-90deg);
  }
  .arrow-bottom {
    bottom: -6px;
    transform: rotate(0deg);
  }
  .arrow-top {
    top: -6px;
    transform: rotate(180deg);
  }
}
.animation-slide-y {
  animation-name: slideY;
}
.animation-slide-x {
  animation-name: slideX;
}
@keyframes slideY {
  0% {
    transform: translateY(6px);
  }
  50% {
    transform: translateY(-6px);
  }
  100% {
    transform: translateY(6px);
  }
}
@keyframes slideX {
  0% {
    transform: translateX(6px);
  }
  50% {
    transform: translateX(-6px);
  }
  100% {
    transform: translateX(6px);
  }
}
</style>
