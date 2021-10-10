<template>
  <view
    v-if="isShow"
    :class="['overlay',animationClass]"
    @touchmove="touchmove"
    @click.stop="handleClick"
    :style="{'z-index':zIndex,'animation-duration':`${duration}ms`}">
    <slot/>
  </view>
</template>

<script>
/**
 * 遮罩组件
 */
export default {
  name: 'GOverlay',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    zIndex: { // 层级
      type: Number,
      default: 9
    },
    lockSroll: { // 锁定背景滚动
      type: Boolean,
      default: true
    },
    duration: { // 动画时长
      type: Number,
      default: 300
    }
  },
  data () {
    return {
      isShow: false,
      animationClass: 'opacityIn' // 显示和消失动画
    }
  },
  computed: {},
  mounted () {
    this.isShow = this.value
  },
  watch: {
    value (val) {
      if (val) {
        this.isShow = true
      } else {
        this.close()
      }
    }
  },
  methods: {
    touchmove () {
      return false
    },
    handleClick () {
      this.$emit('handleClick')
      this.close()
    },
    close () {
      this.animationClass = 'opacity-0 opacityOut'
      setTimeout(() => {
        this.isShow = false
        this.animationClass = 'opacityIn'
        this.$emit('input', false)
      }, this.duration)
    }

  }
}
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  overflow: hidden;
  background: rgba(0,0,0,0.7);
  @include flex-center();
}

</style>
