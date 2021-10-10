<template>
  <view class="card-container border-radius-10">
    <view class="card-header color-white flex-center font-size-30">
      距离周末还有
    </view>
    <view class="card-content flex-center flex-column likeday-font color-blue">
      1234
    </view>
  </view>
</template>

<script>
export default {
  props: ['item'],
  data () {
    return {}
  }

}
</script>

<style scoped lang="scss">
.card-container{
  width: 630rpx;
  height: 550rpx;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.3);
  position: relative;
  background: rgba(0, 0, 0, .2);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}
.card-header{
  height: 160rpx;
  box-shadow: 0 1px 0 0 rgba(255,255,255,0.4);
}
.card-content{
  background: rgba(255, 255, 255, .3);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  -webkit-text-stroke: 1px rgba(255, 255, 255, .5);
  height: calc(100% - 160rpx);
  font-size: 200rpx;
}

</style>
