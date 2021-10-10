<template>
  <view class="container-mask flex-center flex-column" @click="handleClick" v-if="isShow">
    <image
      class="container-image"
      src="https://img-blog.csdnimg.cn/853d3122ea714180a7816ec2eea5275e.png"
    />
    <view class="container-text color-white font-size-18 padding-top-50">左滑试试</view>
  </view>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isShow: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    handleClick () {
      this.isShow = false
      uni.setStorageSync('hasShowGesture', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.container-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 99;
}
.container-image {
  width: 200rpx;
  height: 200rpx;
  animation: swiperFinger 1.4s cubic-bezier(.21,.65,.54,.8) 0.5s infinite;
}
@keyframes swiperFinger {
  from {
    transform: translateX(-200rpx);
  }
  to {
    opacity: 0;
    transform: translateX(200rpx);
  }
}
</style>
