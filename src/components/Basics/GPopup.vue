<template>
  <view class="popup-container flex-center">
    <GOverlay
      v-model="isShow"
      @handleClick="handleClose"
      :duration="duration"
      ref="overlay"
    />
    <view class="container-sub" :style="[containerStyle]" :class="isOverflow ? 'overflow' : ''">
      <view v-if="title" class="pop-header flex-center justify-between font-size-14 bg-color-f4f5f6 color-666">
        {{title}}
        <view hover-class="hover-color-ddd" class="iconfont icon-close color-999 font-size-20 close-box flex-center" @click="handleClose"></view>
      </view>
      <slot>
        123
      </slot>
      <view class="is-iphonex" v-if="isAddBottom"></view>
    </view>
  </view>
</template>

<script>
/**
 * 弹出层组件
 */
import GOverlay from '@/components/Basics/GOverlay'
import { mapState } from 'vuex'
export default {
  components: {
    GOverlay
  },
  props: {
    isOverflow: {
      type: Boolean,
      default: true
    },
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    height: {
      // 弹窗高度
      type: String,
      default: ''
    },
    width: {
      // 弹窗宽度
      type: String,
      default: ''
    },
    position: {
      // 位置
      type: String,
      default: 'bottom',
      validator: (value) => {
        return ['top', 'bottom', 'left', 'right', 'center'].includes(value)
      }
    },
    radius: {
      // 圆角
      type: String,
      default: ''
    },
    duration: {
      // 动画时长 ms
      type: Number,
      default: 300
    }
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState('app', {
      isIphoneX: state => state.systemInfo.isIphoneX
    }),
    isAddBottom ({ isIphoneX, position }) { // 是否需要添加底部高度
      return ['bottom', 'left', 'right'].includes(position) && isIphoneX
    },
    containerStyle ({ position, isShow, width, radius }) {
      if (position === 'bottom') {
        return {
          width: '750rpx',
          bottom: 0,
          borderRadius: '20rpx 20rpx 0 0',
          transform: isShow ? 'translateY(0)' : 'translateY(102%)'
        }
      }
      if (position === 'left') {
        return {
          width,
          bottom: 0,
          top: 0,
          left: 0,
          borderRadius: radius || '0 20rpx 20rpx 0',
          transform: isShow ? 'translateX(0)' : 'translateX(-102%)'
        }
      }
      return {}
    },
    isShow: {
      get () {
        return this.value
        // return true
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
  },
  mounted () {
  },
  methods: {
    handleClose () {
      console.log('1---------------')
      this.isShow = false
      this.$emit('handleClose')
    }
  }
}
</script>

<style lang="scss" scoped>
.container-sub{
  position: fixed;
  width: auto;
  height: auto;
  background: white;
  z-index: 99;
  transition: all 0.3s ease-in-out;
  transform: translateY(102%);
}
.pop-header{
  height: 46px;
  padding-left: 30rpx;
  padding-right: 20rpx;
}
.close-box{
  width: 36px;
  height: 36px;
  border-radius: 6rpx;
}
</style>
