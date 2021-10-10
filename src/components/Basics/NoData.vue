<template>
  <view class="no-data-container flex-center flex-column">
    <image class="no-data-img" src="https://img-blog.csdnimg.cn/8b42f848aef6456ba68a8fc4e861cbc0.png"></image>
    <view class="no-data-title font-size-18 color-999 margin-top-50">{{title}}</view>
  </view>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '没有数据了'
    }
  }
}
</script>

<style lang="scss" scoped>
.no-data-container{
  height: 600rpx;
  width: 100%;
}
.no-data-img{
  width: 164rpx;
  height: 160rpx;
}
</style>
