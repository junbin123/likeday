<template>
  <view class="loading-image-box" :style="imageStyle" @click="handleClick">
    <view v-if="!src" class="image-bg font-size-16 color-999 bg-color-f4f5f6 flex-center">图片加载中...</view>
    <image v-else :src="src" :style="imageStyle"></image>
  </view>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '100px'
    },
    height: {
      type: String,
      default: '100px'
    }
  },
  computed: {
    imageStyle ({ width, height }) {
      return `width:${width};height:${height}`
    }
  },
  methods: {
    handleClick () {
      this.$emit('handleClick')
    }
  }

}
</script>

<style lang="scss" scoped>
.loading-image-box{
  position: relative;
  .image-bg{
    width: 100%;
    height: 100%;
  }
}

</style>
